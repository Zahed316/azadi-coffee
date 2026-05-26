import { Prisma } from "@prisma/client";
import type { CartItem } from "@/lib/cart/types";
import { getProductBySlug } from "@/data/products";
import { assertDatabaseConfigured, prisma } from "@/lib/db/prisma";

export type PublicOrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type LocalOrder = {
  id: string;
  orderNumber: number;
  status: PublicOrderStatus;
  phone: string;
  address: string;
  items: Array<{ slug: string; name: string; nameEn: string; quantity: number; priceToman: number }>;
  totalToman: number;
  paymentMethod: "zarinpal";
  zarinpalAuthority?: string;
  zarinpalRefId?: string;
  createdAt: string;
};

export type CreateOrderInput = {
  phone: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
};

function mapOrderStatus(status: string): PublicOrderStatus {
  switch (status) {
    case "PAID":
    case "PROCESSING":
      return "processing";
    case "SHIPPED":
    case "COMPLETED":
      return "completed";
    case "FAILED":
      return "failed";
    case "CANCELLED":
      return "cancelled";
    default:
      return "pending";
  }
}

const orderInclude = {
  customer: true,
  address: true,
  items: true,
  payments: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
  },
};

type OrderWithRelations = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

function toLocalOrder(order: OrderWithRelations): LocalOrder {
  const latestPayment = order.payments[0];
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: mapOrderStatus(order.status),
    phone: order.customer.phone,
    address: order.address.line1,
    items: order.items.map((item) => ({
      slug: item.productSlug,
      name: item.nameFa,
      nameEn: item.nameEn,
      quantity: item.quantity,
      priceToman: item.unitPriceToman,
    })),
    totalToman: order.totalToman,
    paymentMethod: "zarinpal",
    zarinpalAuthority: latestPayment?.authority ?? undefined,
    zarinpalRefId: latestPayment?.refId ?? undefined,
    createdAt: order.createdAt.toISOString(),
  };
}

export function priceCartItems(items: CartItem[]) {
  if (items.length === 0) {
    throw new Error("Cart is empty.");
  }

  return items.map((item) => {
    const product = getProductBySlug(item.slug);
    if (!product) {
      throw new Error(`Product not found: ${item.slug}`);
    }
    if (product.inventory === "sold-out") {
      throw new Error(`Product is sold out: ${product.name}`);
    }

    const quantity = Math.max(1, Math.min(20, Math.trunc(item.quantity || 1)));
    return {
      slug: product.slug,
      name: product.name,
      nameEn: product.nameEn,
      quantity,
      priceToman: product.priceToman,
      weightGram: product.weightGram,
      lineTotalToman: product.priceToman * quantity,
    };
  });
}

export async function createOrder(input: CreateOrderInput): Promise<LocalOrder> {
  assertDatabaseConfigured();

  if (input.paymentMethod !== "zarinpal") {
    throw new Error("Only Zarinpal is enabled.");
  }

  const pricedItems = priceCartItems(input.items);
  const subtotalToman = pricedItems.reduce((sum, item) => sum + item.lineTotalToman, 0);
  const totalToman = subtotalToman;

  const order = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { phone: input.phone },
      update: {},
      create: { phone: input.phone },
    });

    const address = await tx.address.create({
      data: {
        customerId: customer.id,
        phone: input.phone,
        line1: input.address,
      },
    });

    const cartSnapshot = await tx.cartSnapshot.create({
      data: {
        payload: {
          items: pricedItems,
          subtotalToman,
          totalToman,
        },
      },
    });

    return tx.order.create({
      data: {
        customerId: customer.id,
        addressId: address.id,
        cartSnapshotId: cartSnapshot.id,
        subtotalToman,
        totalToman,
        status: "PENDING_PAYMENT",
        items: {
          create: pricedItems.map((item) => ({
            productSlug: item.slug,
            nameFa: item.name,
            nameEn: item.nameEn,
            quantity: item.quantity,
            unitPriceToman: item.priceToman,
            lineTotalToman: item.lineTotalToman,
          })),
        },
        payments: {
          create: {
            provider: "ZARINPAL",
            status: "PENDING",
            amountToman: totalToman,
          },
        },
      },
      include: orderInclude,
    });
  });

  return toLocalOrder(order);
}

export async function getOrder(id: string): Promise<LocalOrder | undefined> {
  assertDatabaseConfigured();
  const order = await prisma.order.findUnique({ where: { id }, include: orderInclude });
  return order ? toLocalOrder(order) : undefined;
}

export async function setOrderAuthority(id: string, authority: string): Promise<LocalOrder | undefined> {
  assertDatabaseConfigured();

  const order = await prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({ where: { id }, include: { payments: true } });
    if (!existing) return undefined;

    const payment = existing.payments.find((item) => item.provider === "ZARINPAL");
    if (!payment) return undefined;

    await tx.payment.update({
      where: { id: payment.id },
      data: { authority, status: "REQUESTED" },
    });

    return tx.order.findUnique({ where: { id }, include: orderInclude });
  });

  return order ? toLocalOrder(order) : undefined;
}

export async function updateOrderStatus(
  id: string,
  status: PublicOrderStatus,
  zarinpalRefId?: string,
): Promise<LocalOrder | undefined> {
  assertDatabaseConfigured();

  const dbStatus = status === "completed"
    ? "PAID"
    : status === "processing"
      ? "PROCESSING"
      : status === "failed"
        ? "FAILED"
        : status === "cancelled"
          ? "CANCELLED"
          : "PENDING_PAYMENT";

  const order = await prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({ where: { id }, include: { payments: true } });
    if (!existing) return undefined;

    await tx.order.update({ where: { id }, data: { status: dbStatus } });

    const payment = existing.payments.find((item) => item.provider === "ZARINPAL");
    if (payment) {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: status === "completed" ? "SUCCEEDED" : status === "failed" ? "FAILED" : payment.status,
          refId: zarinpalRefId ?? payment.refId,
        },
      });
    }

    return tx.order.findUnique({ where: { id }, include: orderInclude });
  });

  return order ? toLocalOrder(order) : undefined;
}

export async function getAdminOrders() {
  assertDatabaseConfigured();
  return prisma.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
