# Payment Agent — Azadi Coffee

> **Agent corporation:** [agent-corporation.md](./agent-corporation.md) · **Skills:** [debug-payment](../skills/debug-payment/SKILL.md) · **Related:** [architecture.md](./architecture.md) · [devops.md](./devops.md)

## Role
You handle the Zarinpal payment gateway integration, order flow, and checkout system.

## Payment Flow
1. User fills cart → goes to `/checkout`
2. CheckoutForm collects phone, address, payment method
3. `POST /api/checkout` creates order in in-memory store → returns `{ orderId }`
4. Redirect to `/order/[id]?status=pending`
5. User clicks PayButton → Server Action `initiatePayment` (`src/app/actions/payment.ts`)
6. Zarinpal `requestPayment()` → redirects user to Zarinpal gateway
7. User pays (or cancels) on Zarinpal
8. Zarinpal redirects to `GET /api/payment/callback` with `Authority` and `Status`
9. Callback verifies via `verifyPayment()` → updates order status
10. Redirect back to `/order/[id]?status=success|failed|error`

## Key Files
- `src/lib/zarinpal.ts` — `requestPayment()`, `verifyPayment()`, types
- `src/app/actions/payment.ts` — Server Action wrapping requestPayment
- `src/app/api/checkout/route.ts` — POST, creates in-memory order
- `src/app/api/payment/callback/route.ts` — GET, handles Zarinpal return
- `src/lib/orders/store.ts` — In-memory store: `create()`, `get()`, `update()`, `setAuthority()`
- `src/components/cart/PayButton.tsx` — Client button calling Server Action
- `src/components/cart/OrderStatus.tsx` — Displays order result

## Zarinpal Client Details
- **Library:** Custom (`src/lib/zarinpal.ts`), no third-party SDK
- **Sandbox:** `https://sandbox.zarinpal.com/pg/v4/payment/request.json`
- **Production:** `https://api.zarinpal.com/pg/v4/payment/request.json`
- **Gateway:** `StartPay/<authority>` (sandbox or production URL)
- **Verify:** `https://api.zarinpal.com/pg/v4/payment/verify.json`
- **Env vars:** `ZARINPAL_MERCHANT_ID`, `ZARINPAL_SANDBOX` (default true)

## Amount Handling
- All amounts in **Toman** (IRR/10) internally
- Convert to **Rial** (IRR) for Zarinpal API: `amount * 10`
- `formatToman()` displays in FA/EN formats
- `formatRial()` for raw Rial display

## Order Model (In-Memory)
```ts
{
  id: string           // UUID
  orderNumber: number  // Sequential counter
  status: "pending" | "processing" | "completed" | "failed"
  phone: string
  address: string
  items: CartItem[]
  totalToman: number
  paymentMethod: "zarinpal" | "behpardakht" | "idpay"
  zarinpalAuthority: string | null
  zarinpalRefId: number | null
  createdAt: Date
}
```

## Known Issues
- **In-memory store:** Orders lost on server restart — needs DB
- **No webhook:** Relies entirely on redirect callback — if user closes browser after payment, order may not verify
- **No idempotency:** If callback is retried, could double-verify
- **Stub gateways:** Behpardakht Mellat and IDPay are referenced but not implemented
- **No refund handling**

## Multi-Gateway Support (Future)
CheckoutForm has a gateway picker with options: Zarinpal, Behpardakht Mellat, IDPay. Only Zarinpal is implemented. To add a new gateway:
1. Create `src/lib/<gateway>.ts` following Zarinpal pattern
2. Add cases to Server Action in `src/app/actions/payment.ts`
3. Add verify logic to `src/app/api/payment/callback/route.ts`
