#!/usr/bin/env sh
set -e

echo "============================================"
echo "  Azadi Coffee — Server Setup"
echo "============================================"
echo ""

# ──────────────────────────────────────────────
# 1. Domain
# ──────────────────────────────────────────────
DEFAULT_DOMAIN=$(hostname -f 2>/dev/null || echo "localhost")
printf "Enter the live domain [%s]: " "$DEFAULT_DOMAIN"
read -r DOMAIN
DOMAIN="${DOMAIN:-$DEFAULT_DOMAIN}"

echo ""
echo "  Using domain: $DOMAIN"
echo ""

# ──────────────────────────────────────────────
# 2. Create .env.local
# ──────────────────────────────────────────────
if [ -f .env.local ]; then
  printf ".env.local already exists. Overwrite? [y/N]: "
  read -r OVERWRITE
  if [ "$OVERWRITE" != "y" ] && [ "$OVERWRITE" != "Y" ]; then
    echo "  Skipping .env.local creation."
  else
    cat > .env.local <<EOF
DOMAIN=${DOMAIN}
NEXT_PUBLIC_SITE_URL=https://${DOMAIN}
WORDPRESS_BASE_URL=https://${DOMAIN}/wp
WORDPRESS_API_URL=https://${DOMAIN}/wp-json
EOF
    echo "  Created .env.local"
  fi
else
  cat > .env.local <<EOF
DOMAIN=${DOMAIN}
NEXT_PUBLIC_SITE_URL=https://${DOMAIN}
WORDPRESS_BASE_URL=https://${DOMAIN}/wp
WORDPRESS_API_URL=https://${DOMAIN}/wp-json
EOF
  echo "  Created .env.local"
fi

echo ""

# ──────────────────────────────────────────────
# 3. Generate nginx.conf from template
# ──────────────────────────────────────────────
if command -v envsubst >/dev/null 2>&1; then
  export DOMAIN
  envsubst '${DOMAIN}' < nginx.conf.template > nginx.conf
  echo "  Generated nginx.conf from template"
else
  echo "  WARNING: envsubst not found. nginx.conf not generated."
  echo "  Install gettext or manually substitute \${DOMAIN} in nginx.conf.template"
fi

echo ""

# ──────────────────────────────────────────────
# 4. Create required directories
# ──────────────────────────────────────────────
mkdir -p wp-content

echo ""
echo "============================================"
echo "  Setup complete! Run:"
echo ""
echo "    docker compose up -d"
echo ""
echo "  Then visit https://${DOMAIN}"
echo "============================================"
