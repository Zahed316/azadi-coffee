# Agent Workflow

## Main Manager Agent

Owns product scope, sequencing, quality gates, originality checks, and handoff between design, backend, payment, SEO, and implementation. This agent decides what is ready to build and prevents copying protected reference-site assets or identity.

Responsibilities:

- Maintain the source of truth for scope and acceptance criteria.
- Coordinate specialist outputs.
- Convert Open Design artifacts into implementation tasks.
- Check that Azadi remains an original Persian coffee brand.
- Keep commerce and payment decisions pragmatic for Iran.

## Specialist Agents

### Reference Site Auditor

Analyzes the cloned WordPress site and extracts reusable visual rules: grid, spacing, typography scale, product presentation, blog structure, navigation rhythm, and ecommerce patterns.

### Azadi Brand Designer

Transforms the reference principles into an original specialty coffee identity: Persian-first typography, monochrome packaging language, roastery tone, and coffee product storytelling.

### Design System Agent

Creates tokens and components:

- Colors
- Typography
- Spacing
- Borders
- Buttons
- Inputs
- Product cards
- Blog cards
- Header/footer
- RTL layout rules

### Ecommerce UX Agent

Designs the shopping experience:

- Product listing
- Filters and sorting
- Product detail page
- Cart
- Checkout
- Empty states
- Order confirmation
- Account/order lookup

### Persian/RTL Agent

Validates:

- `lang="fa"` and `dir="rtl"`
- Persian typography
- Logical CSS properties
- Persian numerals where appropriate
- Toman/Rial formatting
- Mobile checkout usability

### Payment & Backend Architect

Owns:

- WooCommerce headless strategy
- Iranian gateway decision
- ZarinPal/IDPay/Mellat tradeoffs
- Order state and verification
- Deployment constraints
- SMS/OTP architecture

### Blog & SEO Agent

Defines:

- Blog content model
- Metadata
- Open Graph
- Product schema
- Breadcrumb schema
- Persian keyword strategy
- Canonicals and sitemap

### Next.js Implementation Agent

Converts approved designs into:

- App Router routes
- Reusable components
- Tailwind tokens
- Server data loaders
- Cart state
- Checkout pages
- SEO metadata
