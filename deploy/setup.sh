#!/usr/bin/env bash
set -euo pipefail

# ══════════════════════════════════════════════════════════════
#  Azadi Coffee — Remote Server Bootstrap
#  Runs from YOUR local machine against a fresh Ubuntu/AlmaLinux
#  server.  Prompts for the root password once, then automates
#  everything via SSH.
#
#  Usage:  bash setup.sh
#  Log:    /var/log/server-setup.log (on the remote server)
# ══════════════════════════════════════════════════════════════

SCRIPT_VERSION="3.0.0"
REMOTE_FLAG="---AZADI-PROVISION---"

# ─── Colors ──────────────────────────────────────────────────

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'

info()  { printf "${GREEN}[✓]${NC} %s\n" "$*"; }
warn()  { printf "${YELLOW}[!]${NC} %s\n" "$*"; }
error() { printf "${RED}[✗]${NC} %s\n" "$*"; exit 1; }
header() {
  printf "\n${BLUE}════════════════════════════════════════${NC}\n"
  printf "${BLUE}  %s${NC}\n" "$*"
  printf "${BLUE}════════════════════════════════════════${NC}\n"
}
section() { printf "\n${BOLD}── %s ──${NC}\n" "$*"; }

prompt_yesno() {
  local msg="$1" default="${2:-n}" yn
  while true; do
    printf "${YELLOW}?${NC} %s [y/N]: " "$msg"
    read -r yn; yn="${yn:-$default}"
    case "$yn" in y|Y) return 0;; n|N) return 1;; *) ;; esac
  done
}

# ──────────────────────────────────────────────────────────────
#  REMOTE MODE — runs on the server via SSH heredoc
# ──────────────────────────────────────────────────────────────

if [[ "${1:-}" == "$REMOTE_FLAG" ]]; then
  # Redirect all output to logfile as well
  LOG_FILE="${2:-/var/log/server-setup.log}"
  mkdir -p "$(dirname "$LOG_FILE")"
  exec 1>>"$LOG_FILE" 2>&1

  # Root check
  if [[ $EUID -ne 0 ]]; then
    echo "FATAL: remote script must run as root"
    exit 1
  fi

  SSH_PORT="${3:-22}"
  DOMAIN="${4:-localhost}"
  PUBLIC_IP="${5:-}"
  PRIVATE_IP="${6:-}"

  echo "[$(date +%FT%T)] Starting provisioning for ${DOMAIN}"

  # ── Detect OS ────────────────────────────────────────────
  . /etc/os-release
  OS_ID="$ID"
  OS_NAME="$PRETTY_NAME"

  case "$OS_ID" in
    ubuntu) PKG_INSTALL="DEBIAN_FRONTEND=noninteractive apt-get install -y"
            PKG_UPDATE="DEBIAN_FRONTEND=noninteractive apt-get update -y" ;;
    almalinux) PKG_INSTALL="dnf install -y"
               PKG_UPDATE="dnf update -y" ;;
    *) echo "FATAL: unsupported OS ${OS_ID}"; exit 1 ;;
  esac

  echo "Detected: ${OS_NAME}"

  # ── System Update & Base Packages ────────────────────────
  echo "Updating packages..."
  eval "$PKG_UPDATE" || true
  BASE_PKGS=(curl wget git unzip vim ca-certificates gnupg)
  if [[ "$OS_ID" == "ubuntu" ]]; then
    BASE_PKGS+=(apt-transport-https software-properties-common ufw)
  else
    BASE_PKGS+=(dnf-utils policycoreutils)
  fi
  eval "$PKG_INSTALL ${BASE_PKGS[*]}" || true

  # ── Docker ───────────────────────────────────────────────
  if ! command -v docker &>/dev/null; then
    echo "Installing Docker..."
    case "$OS_ID" in
      ubuntu)
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
          | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
          > /etc/apt/sources.list.d/docker.list
        apt-get update -y
        apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        ;;
      almalinux)
        dnf install -y dnf-utils
        yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        sed -i 's/\\$releasever/8/g' /etc/yum.repos.d/docker-ce.repo
        dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        ;;
    esac
    systemctl enable docker; systemctl start docker
  fi
  echo "Docker: $(docker --version)"

  # ── Firewall ─────────────────────────────────────────────
  if [[ "$OS_ID" == "ubuntu" ]]; then
    ufw allow "$SSH_PORT/tcp" comment 'SSH'
    ufw allow 80/tcp   comment 'HTTP'
    ufw allow 443/tcp  comment 'HTTPS'
    ufw --force enable
    echo "UFW enabled"
  else
    systemctl enable --now firewalld 2>/dev/null || true
    firewall-cmd --permanent --add-port="${SSH_PORT}/tcp" 2>/dev/null || true
    firewall-cmd --permanent --add-service=http 2>/dev/null || true
    firewall-cmd --permanent --add-service=https 2>/dev/null || true
    firewall-cmd --reload 2>/dev/null || true
    echo "firewalld configured"
  fi

  # ── SSH hardening ────────────────────────────────────────
  local sshd_cfg="/etc/ssh/sshd_config"
  local bak="/root/sshd_config.backup.$(date +%s)"
  cp "$sshd_cfg" "$bak"
  echo "SSH config backed up to ${bak}"

  sed -i 's/^PermitRootLogin.*/PermitRootLogin prohibit-password/' "$sshd_cfg" 2>/dev/null \
    || echo "PermitRootLogin prohibit-password" >> "$sshd_cfg"
  sed -i 's/^PasswordAuthentication.*/PasswordAuthentication no/' "$sshd_cfg" 2>/dev/null \
    || echo "PasswordAuthentication no" >> "$sshd_cfg"
  sed -i 's/^PubkeyAuthentication.*/PubkeyAuthentication yes/' "$sshd_cfg" 2>/dev/null \
    || echo "PubkeyAuthentication yes" >> "$sshd_cfg"
  sed -i 's/^ClientAliveInterval.*/ClientAliveInterval 300/' "$sshd_cfg" 2>/dev/null \
    || echo "ClientAliveInterval 300" >> "$sshd_cfg"
  sed -i 's/^ClientAliveCountMax.*/ClientAliveCountMax 2/' "$sshd_cfg" 2>/dev/null \
    || echo "ClientAliveCountMax 2" >> "$sshd_cfg"
  sed -i 's/^MaxAuthTries.*/MaxAuthTries 3/' "$sshd_cfg" 2>/dev/null \
    || echo "MaxAuthTries 3" >> "$sshd_cfg"

  # Restart SSH safely
  if sshd -t 2>/dev/null; then
    systemctl restart sshd 2>/dev/null || systemctl restart ssh 2>/dev/null || true
    echo "SSH hardened and restarted"
  else
    echo "SSH config error — restoring backup"
    cp "$bak" "$sshd_cfg"
  fi

  # ── Fail2Ban ─────────────────────────────────────────────
  eval "$PKG_INSTALL fail2ban" 2>/dev/null || true
  cat > /etc/fail2ban/jail.local <<-EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
[sshd]
enabled = true
port = ${SSH_PORT}
logpath = %(sshd_log)s
EOF
  systemctl enable --now fail2ban 2>/dev/null || true
  echo "Fail2Ban installed"

  # ── Auto updates ─────────────────────────────────────────
  if [[ "$OS_ID" == "ubuntu" ]]; then
    DEBIAN_FRONTEND=noninteractive apt-get install -y unattended-upgrades 2>/dev/null || true
    dpkg-reconfigure -f noninteractive unattended-upgrades 2>/dev/null || true
  else
    dnf install -y dnf-automatic 2>/dev/null || true
    systemctl enable --now dnf-automatic.timer 2>/dev/null || true
  fi

  # ── Dotfiles ─────────────────────────────────────────────
  chmod 700 /root/.ssh 2>/dev/null || true
  chmod 600 /root/.ssh/authorized_keys 2>/dev/null || true

  # ── Summary ──────────────────────────────────────────────
  echo ""
  echo "════════════════════════════════════════"
  echo "  Provisioning Complete"
  echo "════════════════════════════════════════"
  echo "  OS:          ${OS_NAME}"
  echo "  Domain:      ${DOMAIN}"
  echo "  Public IP:   ${PUBLIC_IP:-auto}"
  echo "  Docker:      $(docker --version 2>/dev/null || echo 'n/a')"
  echo "  Compose:     $(docker compose version 2>/dev/null || echo 'n/a')"
  echo "  SSH port:    ${SSH_PORT}"
  echo "  Log:         ${LOG_FILE}"
  echo "  Backup:      /root/"
  echo ""
  echo "  Next:  git clone <repo> /opt/azadi-coffee"
  echo "         cd /opt/azadi-coffee/deploy && docker compose up -d"
  echo ""

  exit 0
fi

# ══════════════════════════════════════════════════════════════
#  LOCAL MODE — orchestrates the remote provisioning
# ══════════════════════════════════════════════════════════════

clear
header "Azadi Coffee — Remote Server Bootstrap v${SCRIPT_VERSION}"
echo "  This script connects to a FRESH server via root password,"
echo "  hardens it, installs Docker + firewall + Fail2Ban, and"
echo "  disables password auth after setting up SSH keys."
echo ""
echo "  Supported:  Ubuntu 20.04+  |  AlmaLinux 8+"
echo ""

# ── 1. Server details ───────────────────────────────────────

section "Server Connection"

read -r -p "  Server IP or hostname: " SERVER_HOST
[[ -z "$SERVER_HOST" ]] && error "Server host required."

read -r -s -p "  Root password: " ROOT_PASS
echo ""
[[ -z "$ROOT_PASS" ]] && error "Root password required."

read -r -p "  SSH port [22]: " SSH_PORT
SSH_PORT="${SSH_PORT:-22}"

read -r -p "  Domain (e.g. azadicoffee.com) [$(hostname -f)]: " DOMAIN
DOMAIN="${DOMAIN:-$(hostname -f)}"

echo ""
if ! prompt_yesno "Provision ${SERVER_HOST} (port ${SSH_PORT}) for ${DOMAIN}?"; then
  echo "Aborted."
  exit 1
fi

# ── 2. Install sshpass locally if missing ───────────────────

section "Local Dependencies"

if ! command -v sshpass &>/dev/null; then
  echo "sshpass not found locally — installing..."
  if command -v apt-get &>/dev/null; then
    sudo apt-get install -y sshpass
  elif command -v dnf &>/dev/null; then
    sudo dnf install -y sshpass
  elif command -v brew &>/dev/null; then
    brew install sshpass
  else
    error "Please install sshpass manually (apt-get install sshpass / dnf install sshpass)"
  fi
fi
echo "sshpass available"

# ── 3. Wait for SSH to be ready ─────────────────────────────

section "Waiting for Server"

echo "Waiting for ${SERVER_HOST}:${SSH_PORT} to accept SSH..."
for i in $(seq 1 30); do
  if sshpass -p "$ROOT_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p "$SSH_PORT" "root@${SERVER_HOST}" "echo ready" 2>/dev/null; then
    echo "Server reachable (attempt $i)"
    break
  fi
  if [[ $i -eq 30 ]]; then
    error "Server not reachable after 30 attempts."
  fi
  sleep 2
done

# ── 4. Detect OS on remote server ───────────────────────────

section "Remote OS Detection"

REMOTE_OS=$(sshpass -p "$ROOT_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p "$SSH_PORT" "root@${SERVER_HOST}" \
  "grep '^ID=' /etc/os-release | cut -d= -f2 | tr -d '\"'" 2>/dev/null)

case "$REMOTE_OS" in
  ubuntu) echo "Detected: Ubuntu";;
  almalinux) echo "Detected: AlmaLinux";;
  *) error "Unsupported remote OS: ${REMOTE_OS}. Only Ubuntu and AlmaLinux are supported.";;
esac

# ── 5. Detect public IP on the remote server ────────────────

section "IP Detection"

REMOTE_PUBLIC_IP=$(sshpass -p "$ROOT_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p "$SSH_PORT" "root@${SERVER_HOST}" \
  "curl -s --max-time 5 https://api.ipify.org 2>/dev/null || curl -s --max-time 5 https://ifconfig.me 2>/dev/null || echo ''" 2>/dev/null)
echo "Public IP: ${REMOTE_PUBLIC_IP:-detecting later}"

REMOTE_PRIVATE_IP=$(sshpass -p "$ROOT_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p "$SSH_PORT" "root@${SERVER_HOST}" \
  "ip route get 1 2>/dev/null | awk '{print \$7; exit}' | head -1 || hostname -I 2>/dev/null | awk '{print \$1}'" 2>/dev/null)
echo "Private IP: ${REMOTE_PRIVATE_IP:-detecting later}"

# ── 6. Generate SSH key pair (if needed) ────────────────────

section "SSH Key Setup"

LOCAL_KEY="${HOME}/.ssh/id_ed25519"
if [[ -f "${LOCAL_KEY}.pub" ]]; then
  echo "Using existing SSH key: ${LOCAL_KEY}.pub"
else
  echo "Generating Ed25519 SSH key..."
  ssh-keygen -t ed25519 -f "$LOCAL_KEY" -N "" -C "azadi-provision"
fi

PUB_KEY=$(cat "${LOCAL_KEY}.pub")

echo "Installing public key on server..."
sshpass -p "$ROOT_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p "$SSH_PORT" "root@${SERVER_HOST}" \
  "mkdir -p /root/.ssh && echo '${PUB_KEY}' >> /root/.ssh/authorized_keys && chmod 700 /root/.ssh && chmod 600 /root/.ssh/authorized_keys" 2>/dev/null

# Verify key-based login works
if ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p "$SSH_PORT" "root@${SERVER_HOST}" "echo key-auth-ok" 2>/dev/null; then
  echo "SSH key authentication verified."
else
  error "SSH key login failed after installing key. Check permissions."
fi

# ── 7. Copy and run the provisioning script remotely ────────

section "Running Provisioning"

# Build the remote command inline using the same script in --remote mode
echo "Provisioning server (this may take a few minutes)..."

ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p "$SSH_PORT" "root@${SERVER_HOST}" \
  "bash -s" << REMOTE
set -euo pipefail
$(declare -f info warn error header section prompt_yesno 2>/dev/null || true)

# Re-exec this script in remote mode
# We need to download or generate the script. Easiest: pipe it via stdin.
# But since we're already piping stdin, we need a different approach.
# Let's just run the provisioning inline here.

LOG_FILE="${LOG_FILE:-/var/log/server-setup.log}"
mkdir -p \$(dirname "\$LOG_FILE")
exec 1>>"\$LOG_FILE" 2>&1

if [[ \$EUID -ne 0 ]]; then echo "FATAL: not root"; exit 1; fi

. /etc/os-release
OS_ID="\$ID"
OS_NAME="\$PRETTY_NAME"

case "\$OS_ID" in
  ubuntu) PKG_INSTALL="DEBIAN_FRONTEND=noninteractive apt-get install -y"
          PKG_UPDATE="DEBIAN_FRONTEND=noninteractive apt-get update -y" ;;
  almalinux) PKG_INSTALL="dnf install -y"
             PKG_UPDATE="dnf update -y" ;;
  *) echo "FATAL: unsupported OS"; exit 1 ;;
esac

echo "[provision] Detected: \${OS_NAME}"

# Update
echo "[provision] Updating packages..."
eval "\$PKG_UPDATE" || true

# Base packages
BASE_PKGS="curl wget git unzip vim ca-certificates gnupg"
if [[ "\$OS_ID" == "ubuntu" ]]; then
  BASE_PKGS="\$BASE_PKGS apt-transport-https software-properties-common ufw"
else
  BASE_PKGS="\$BASE_PKGS dnf-utils policycoreutils"
fi
eval "\$PKG_INSTALL \$BASE_PKGS" || true

# Docker
if ! command -v docker &>/dev/null; then
  echo "[provision] Installing Docker..."
  case "\$OS_ID" in
    ubuntu)
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
        | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
      echo "deb [arch=\$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable" \
        > /etc/apt/sources.list.d/docker.list
      apt-get update -y
      apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
      ;;
    almalinux)
      dnf install -y dnf-utils
      yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
      sed -i 's/\\\$releasever/8/g' /etc/yum.repos.d/docker-ce.repo
      dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
      ;;
  esac
  systemctl enable docker; systemctl start docker
fi

# Firewall
echo "[provision] Configuring firewall..."
SSH_PORT="${SSH_PORT:-22}"
if [[ "\$OS_ID" == "ubuntu" ]]; then
  ufw allow "\$SSH_PORT/tcp" comment 'SSH'
  ufw allow 80/tcp comment 'HTTP'
  ufw allow 443/tcp comment 'HTTPS'
  ufw --force enable
else
  systemctl enable --now firewalld 2>/dev/null || true
  firewall-cmd --permanent --add-port="\${SSH_PORT}/tcp" 2>/dev/null || true
  firewall-cmd --permanent --add-service=http 2>/dev/null || true
  firewall-cmd --permanent --add-service=https 2>/dev/null || true
  firewall-cmd --reload 2>/dev/null || true
fi

# SSH hardening
echo "[provision] Hardening SSH..."
cp /etc/ssh/sshd_config /root/sshd_config.backup.\$(date +%s)
sed -i 's/^PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config 2>/dev/null \
  || echo "PermitRootLogin prohibit-password" >> /etc/ssh/sshd_config
sed -i 's/^PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config 2>/dev/null \
  || echo "PasswordAuthentication no" >> /etc/ssh/sshd_config
sed -i 's/^PubkeyAuthentication.*/PubkeyAuthentication yes/' /etc/ssh/sshd_config 2>/dev/null \
  || echo "PubkeyAuthentication yes" >> /etc/ssh/sshd_config
for opt in "ClientAliveInterval 300" "ClientAliveCountMax 2" "MaxAuthTries 3"; do
  key="\${opt% *}"; val="\${opt#* }"
  sed -i "s/^\${key}.*/\${key} \${val}/" /etc/ssh/sshd_config 2>/dev/null \
    || echo "\${key} \${val}" >> /etc/ssh/sshd_config
done
if sshd -t 2>/dev/null; then
  systemctl restart sshd 2>/dev/null || systemctl restart ssh 2>/dev/null || true
fi

# Fail2Ban
echo "[provision] Installing Fail2Ban..."
eval "\$PKG_INSTALL fail2ban" 2>/dev/null || true
cat > /etc/fail2ban/jail.local <<-EOL
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
[sshd]
enabled = true
port = \${SSH_PORT}
logpath = %(sshd_log)s
EOL
systemctl enable --now fail2ban 2>/dev/null || true

# Auto updates
echo "[provision] Configuring auto-updates..."
if [[ "\$OS_ID" == "ubuntu" ]]; then
  DEBIAN_FRONTEND=noninteractive apt-get install -y unattended-upgrades 2>/dev/null || true
  dpkg-reconfigure -f noninteractive unattended-upgrades 2>/dev/null || true
else
  dnf install -y dnf-automatic 2>/dev/null || true
  systemctl enable --now dnf-automatic.timer 2>/dev/null || true
fi

# File permissions
chmod 700 /root/.ssh 2>/dev/null || true
chmod 600 /root/.ssh/authorized_keys 2>/dev/null || true

# Docker verify
docker run --rm hello-world 2>/dev/null && echo "[provision] Docker OK" || true

echo "[provision] Complete."
REMOTE

echo ""
info "Provisioning script finished."

# ── 8. Final check & summary ───────────────────────────────

section "Post-Provision Verification"

# Verify remotely via key auth
verify() {
  local label="$1" cmd="$2"
  local result
  result=$(ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p "$SSH_PORT" "root@${SERVER_HOST}" "$cmd" 2>/dev/null || echo "FAIL")
  echo "  $label: $result"
}

verify "OS" "grep '^PRETTY_NAME' /etc/os-release | cut -d= -f2 | tr -d '\"'"
verify "Docker" "docker --version 2>/dev/null || echo 'not found'"
verify "Compose" "docker compose version 2>/dev/null || echo 'not found'"
verify "UFW" "ufw status 2>/dev/null | head -1 || firewall-cmd --state 2>/dev/null || echo 'not configured'"
verify "Fail2Ban" "systemctl is-active fail2ban 2>/dev/null || echo 'not active'"
verify "SSH auth" "grep '^PasswordAuthentication' /etc/ssh/sshd_config 2>/dev/null || echo 'unknown'"

echo ""
header "Done — ${SERVER_HOST} is ready for production"

echo ""
echo "  Connect: ssh -p ${SSH_PORT} root@${SERVER_HOST}"
echo "  Domain:  ${DOMAIN}"
echo "  Public:  ${REMOTE_PUBLIC_IP:-detect with: curl -s api.ipify.org}"
echo ""
echo "  Next steps:"
echo "    1. git clone <repo> /opt/azadi-coffee"
echo "    2. cd /opt/azadi-coffee/deploy && docker compose up -d"
echo "    3. Point DNS A-record ${DOMAIN} → ${REMOTE_PUBLIC_IP:-your server IP}"
echo "    4. Visit https://${DOMAIN}/wp-admin to complete WordPress setup"
echo ""
echo "  Log on server: /var/log/server-setup.log"
echo ""
