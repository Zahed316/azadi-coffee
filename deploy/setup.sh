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
ENV_FILE="../.env.local"
if [ -f "$ENV_FILE" ]; then
  printf ".env.local already exists. Overwrite? [y/N]: "
  read -r OVERWRITE
  if [ "$OVERWRITE" != "y" ] && [ "$OVERWRITE" != "Y" ]; then
    echo "  Skipping .env.local creation."
  else
    cat > "$ENV_FILE" <<EOF
DOMAIN=${DOMAIN}
NEXT_PUBLIC_SITE_URL=https://${DOMAIN}
WORDPRESS_BASE_URL=https://${DOMAIN}/wp
WORDPRESS_API_URL=https://${DOMAIN}/wp-json
EOF
    echo "  Created $ENV_FILE"
  fi
else
  cat > "$ENV_FILE" <<EOF
DOMAIN=${DOMAIN}
NEXT_PUBLIC_SITE_URL=https://${DOMAIN}
WORDPRESS_BASE_URL=https://${DOMAIN}/wp
WORDPRESS_API_URL=https://${DOMAIN}/wp-json
EOF
  echo "  Created $ENV_FILE"
fi

echo ""

# ──────────────────────────────────────────────
# 3. Generate nginx.conf from template
# ──────────────────────────────────────────────
if command -v envsubst >/dev/null 2>&1; then
  export DOMAIN
  envsubst '${DOMAIN}' < nginx.conf.template > ../nginx.conf
  echo "  Generated nginx.conf from template"
else
  echo "  WARNING: envsubst not found. nginx.conf not generated."
  echo "  Install gettext or manually substitute \${DOMAIN} in nginx.conf.template"
fi

echo ""

# ──────────────────────────────────────────────
# 4. Create required directories
# ──────────────────────────────────────────────
mkdir -p ../wp-content

echo ""
echo "============================================"
echo "  Setup complete! Run from project root:"
echo ""
echo "    docker compose -f deploy/docker-compose.yml up -d"
echo ""
echo "  Or from deploy/:"
echo ""
echo "    docker compose up -d"
echo ""
echo "  Then visit https://${DOMAIN}"
echo "============================================"
