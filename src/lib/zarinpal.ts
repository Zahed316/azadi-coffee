const SANDBOX_REQUEST_URL = "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
const PRODUCTION_REQUEST_URL = "https://api.zarinpal.com/pg/v4/payment/request.json";
const SANDBOX_PAY_URL = "https://sandbox.zarinpal.com/pg/StartPay";
const PRODUCTION_PAY_URL = "https://www.zarinpal.com/pg/StartPay";
const VERIFY_URL = "https://api.zarinpal.com/pg/v4/payment/verify.json";

function isSandbox(): boolean {
  return process.env.ZARINPAL_SANDBOX !== "false";
}

function getMerchantId(): string {
  const id = process.env.ZARINPAL_MERCHANT_ID;
  if (!id) throw new Error("ZARINPAL_MERCHANT_ID is not configured.");
  return id;
}

export type PaymentRequestResult = {
  success: true;
  authority: string;
  gatewayUrl: string;
} | {
  success: false;
  code: number;
  message: string;
};

export type PaymentVerifyResult = {
  success: true;
  refId: number;
} | {
  success: false;
  code: number;
  message: string;
};

export async function requestPayment(params: {
  amount: number;
  description: string;
  callbackUrl: string;
  email?: string;
  mobile?: string;
}): Promise<PaymentRequestResult> {
  const merchantId = getMerchantId();
  const url = isSandbox() ? SANDBOX_REQUEST_URL : PRODUCTION_REQUEST_URL;

  const body = {
    merchant_id: merchantId,
    amount: params.amount,
    description: params.description,
    callback_url: params.callbackUrl,
    ...(params.email ? { email: params.email } : {}),
    ...(params.mobile ? { mobile: params.mobile } : {}),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (result.data?.code === 100 && result.data?.authority) {
    const gatewayUrl = `${isSandbox() ? SANDBOX_PAY_URL : PRODUCTION_PAY_URL}/${result.data.authority}`;
    return { success: true, authority: result.data.authority, gatewayUrl };
  }

  return {
    success: false,
    code: result.data?.code ?? result.errors?.code ?? -1,
    message: result.errors?.message ?? "Unknown error",
  };
}

export async function verifyPayment(params: {
  authority: string;
  amount: number;
}): Promise<PaymentVerifyResult> {
  const merchantId = getMerchantId();

  const body = {
    merchant_id: merchantId,
    authority: params.authority,
    amount: params.amount,
  };

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (result.data?.code === 100 || result.data?.code === 101) {
    return { success: true, refId: result.data.ref_id };
  }

  return {
    success: false,
    code: result.data?.code ?? result.errors?.code ?? -1,
    message: result.errors?.message ?? "Verification failed",
  };
}
