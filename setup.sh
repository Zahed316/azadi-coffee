#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "============================================"
echo "  Azadi Coffee — Setup"
echo "============================================"
echo ""
echo "  Two modes:"
echo ""
echo "  1. Remote server bootstrap (run from YOUR machine):"
echo "     Connects to a fresh server via root password,"
echo "     installs Docker + firewall + Fail2Ban, hardens SSH."
echo ""
echo "     sudo bash ${SCRIPT_DIR}/deploy/setup.sh"
echo ""
echo "  2. Local project env file (creates .env.local):"
echo "     cd ${SCRIPT_DIR}/deploy && bash setup.sh"
echo ""
