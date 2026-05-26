# skill: debug-payment

## Label
Debug payment issues

## When to Use
When the payment flow is broken — checkout fails, Zarinpal redirect doesn't happen, callback not received, order stuck in pending.

## Diagnostic Steps

### 1. Trace the Full Flow
```
Cart → /checkout → POST /api/checkout → /order/[id]?status=pending
  → PayButton → Server Action → Zarinpal redirect
  → User pays → GET /api/payment/callback → verify → /order/[id]?status=success|failed|error
```

### 2. Check Environment Variables
```
ZARINPAL_MERCHANT_ID=xxx       # Required — throws if missing
ZARINPAL_SANDBOX=true          # Set to "false" for production
NEXT_PUBLIC_SITE_URL=xxx       # Must match Zarinpal callback URL domain
```

If `ZARINPAL_MERCHANT_ID` is missing, payment request will throw "not configured."

### 3. Check POST /api/checkout
File: `src/app/api/checkout/route.ts`

- Receives `{ phone, address, paymentMethod, items }` in body
- Calls `createOrder()` from `src/lib/orders/store.ts`
- Returns `{ orderId }` as JSON
- Check browser Network tab: POST should return 200 with `{ orderId: "azadi-xxx" }`
- If 500: check request body format, check that cart items have all required fields

### 4. Check Server Action (PayButton)
File: `src/app/actions/payment.ts`

- PayButton calls Server Action with `orderId`, `amount`, `description`, `callbackUrl`
- Action calls `requestPayment()` from `src/lib/zarinpal.ts`
- On success, calls `setOrderAuthority()` and returns `{ gatewayUrl }`
- On failure, returns `{ error }` message
- Check server console for Zarinpal API response

### 5. Check Zarinpal Request
File: `src/lib/zarinpal.ts`, function `requestPayment()`

- Sandbox URL: `https://sandbox.zarinpal.com/pg/v4/payment/request.json`
- Production URL: `https://api.zarinpal.com/pg/v4/payment/request.json`
- Amount is in **Rial** (Toman × 10)
- Callback URL must be an absolute URL reachable by Zarinpal
- Response `data.code === 100` means success

Common Zarinpal error codes:
- `-9` — validation error (missing fields)
- `-10` — merchant ID or callback URL invalid
- `-11` — merchant inactive
- `-12` — amount too low (min 1000 Rial)
- Use sandbox test card: `5892 1010 0000 0000`, CVV: any, Expiry: any future date

### 6. Check Payment Callback
File: `src/app/api/payment/callback/route.ts`

- Zarinpal redirects to `GET /api/payment/callback?Authority=xxx&Status=OK`
- Status can be `OK` or `NOK` (user cancelled)
- Calls `verifyPayment()` with authority and amount
- Updates order status in in-memory store
- Redirects to `/order/[id]?status=success|failed|error`

### 7. Check Order Store
File: `src/lib/orders/store.ts`

- In-memory `Map<string, LocalOrder>` on `globalThis.__orders`
- **Lost on server restart** — if you restart the dev server, orders are gone
- If redirect to `/order/[id]` shows nothing, the order was lost
- Check: `GET /api/checkout` returned an orderId, but the redirect can't find it

### 8. Common Failure Points

| Symptom | Likely Cause |
|---|---|
| Checkout returns 500 | Missing fields in request body |
| PayButton shows error | Zarinpal credentials wrong or sandbox env missing |
| Zarinpal shows "invalid merchant" | `ZARINPAL_MERCHANT_ID` wrong |
| Redirect loop or 404 after payment | `NEXT_PUBLIC_SITE_URL` doesn't match Zarinpal config |
| Order not found after payment | Server restarted, in-memory store cleared |
| Payment succeeds but order shows "pending" | Verify callback not reached — check server logs |
| Double payment | No idempotency — user clicks twice before redirect |

### 9. Testing with Sandbox
```bash
# Set these in .env.local
ZARINPAL_SANDBOX=true
ZARINPAL_MERCHANT_ID=your-sandbox-merchant-id

# Sandbox test card
Card: 5892 1010 0000 0000
CVV: any
Expiry: any future
Password: dynamic (sent to sandbox test phone)
```

## Files Involved
- `src/lib/zarinpal.ts` — Zarinpal API client
- `src/app/actions/payment.ts` — Server Action
- `src/app/api/checkout/route.ts` — POST checkout
- `src/app/api/payment/callback/route.ts` — GET callback
- `src/lib/orders/store.ts` — In-memory orders
- `src/components/cart/PayButton.tsx` — Pay button
- `src/components/cart/CheckoutForm.tsx` — Checkout UI
- `src/components/cart/OrderStatus.tsx` — Result display
- `.env.local` — Credentials
