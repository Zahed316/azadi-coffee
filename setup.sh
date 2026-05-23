#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "============================================"
echo "  Azadi Coffee — Setup"
echo "============================================"
echo ""
echo "This script has moved to deploy/setup.sh"
echo ""
echo "Two modes:"
echo ""
echo "  1. Production server preparation (run on a fresh server):"
echo "     sudo bash ${SCRIPT_DIR}/deploy/setup.sh"
echo ""
echo "  2. Local project setup (run from deploy/ directory):"
echo "     cd ${SCRIPT_DIR}/deploy && bash setup.sh"
echo ""
