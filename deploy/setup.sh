#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────
#  Azadi Coffee — Production Server Setup Script
#  Target: Ubuntu 20.04+ / Debian 11+ / RHEL 8+ (CentOS, Rocky, Alma)
#  Usage:  sudo bash setup.sh
#  Log:    /var/log/server-setup.log
# ──────────────────────────────────────────────────────────────

SCRIPT_VERSION="2.0.0"
LOG_FILE="/var/log/server-setup.log"
BACKUP_DIR="/root/server-setup-backups"

# ─── Utilities ────────────────────────────────────────────────

exec 3>&1 4>&2
exec 1>>"$LOG_FILE" 2>&1

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'

info()  { printf "${GREEN}[✓]${NC} %s\n" "$*" >&3; }
warn()  { printf "${YELLOW}[!]${NC} %s\n" "$*" >&3; }
error() { printf "${RED}[✗]${NC} %s\n" "$*" >&3; }
header() { printf "\n${BLUE}============================================${NC}\n${BLUE}  %s${NC}\n${BLUE}============================================${NC}\n" "$*" >&3; }
section() { printf "\n${BOLD}── %s ──${NC}\n" "$*" >&3; }
prompt_yesno() {
  local msg="$1" default="${2:-n}"
  local yn
  while true; do
    printf "${YELLOW}?${NC} ${msg} [y/N]: " >&3
    read -r yn <&3
    yn="${yn:-$default}"
    case "$yn" in y|Y) return 0;; n|N) return 1;; *) ;; esac
  done
}

# ─── Preflight: root check ───────────────────────────────────

if [[ $EUID -ne 0 ]]; then
  error "This script must be run as root (use sudo)."
  exit 1
fi

mkdir -p "$BACKUP_DIR"

header "Azadi Coffee — Server Setup v${SCRIPT_VERSION}"
info "Log file: $LOG_FILE"

# ──────────────────────────────────────────────────────────────
#  1. OS Detection
# ──────────────────────────────────────────────────────────────

section "Operating System Detection"

OS_ID=""
OS_VERSION=""
OS_NAME=""
PKG_MGR=""
PKG_INSTALL=""
PKG_UPDATE=""

detect_os() {
  if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    OS_ID="$ID"
    OS_VERSION="$VERSION_ID"
    OS_NAME="$PRETTY_NAME"
  elif [[ -f /etc/redhat-release ]]; then
    OS_ID="rhel"
    OS_VERSION=$(rpm -q --qf '%{VERSION}' "$(rpm -q --whatprovides redhat-release)" 2>/dev/null || echo "unknown")
    OS_NAME=$(cat /etc/redhat-release)
  else
    error "Unsupported OS — cannot detect distribution."
    exit 1
  fi

  case "$OS_ID" in
    ubuntu|debian)
      PKG_MGR="apt"
      PKG_UPDATE="apt-get update -y"
      PKG_INSTALL="apt-get install -y"
      ;;
    centos|rhel|rocky|almalinux)
      PKG_MGR="dnf"
      PKG_UPDATE="dnf update -y"
      PKG_INSTALL="dnf install -y"
      # Fallback to yum on older CentOS 7
      if ! command -v dnf &>/dev/null; then
        PKG_MGR="yum"
        PKG_UPDATE="yum update -y"
        PKG_INSTALL="yum install -y"
      fi
      ;;
    *)
      error "Unsupported distribution: ${OS_ID}"
      error "Supported: Ubuntu, Debian, CentOS, Rocky Linux, AlmaLinux"
      exit 1
      ;;
  esac

  info "Detected: ${OS_NAME} (${OS_ID} ${OS_VERSION})"
  info "Package manager: ${PKG_MGR}"
}

detect_os

# ──────────────────────────────────────────────────────────────
#  2. System Update & Base Packages
# ──────────────────────────────────────────────────────────────

section "System Update & Base Packages"

BASE_PACKAGES=(curl wget git unzip vim ca-certificates gnupg lsb-release)

if [[ "$OS_ID" == "ubuntu" || "$OS_ID" == "debian" ]]; then
  BASE_PACKAGES+=(apt-transport-https software-properties-common net-tools)
else
  BASE_PACKAGES+=(net-tools iproute)
fi

info "Updating package lists..."
eval "$PKG_UPDATE" || warn "Package update had non-zero exit (may be harmless)"

info "Installing base packages..."
eval "$PKG_INSTALL ${BASE_PACKAGES[*]}" || {
  error "Failed to install some base packages."
  warn "Continuing anyway — some features may be unavailable."
}

info "Base packages installed."

# ──────────────────────────────────────────────────────────────
#  3. Docker & Docker Compose Installation
# ──────────────────────────────────────────────────────────────

section "Docker Installation"

install_docker() {
  if command -v docker &>/dev/null; then
    info "Docker already installed: $(docker --version)"
    return
  fi

  info "Installing Docker..."

  case "$OS_ID" in
    ubuntu|debian)
      curl -fsSL https://download.docker.com/linux/${OS_ID}/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
      echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/${OS_ID} $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
      apt-get update -y
      apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
      ;;
    centos|rhel|rocky|almalinux)
      dnf install -y yum-utils
      yum-config-manager --add-repo https://download.docker.com/linux/${OS_ID}/docker-ce.repo
      dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
      ;;
  esac

  systemctl enable docker
  systemctl start docker

  info "Docker installed: $(docker --version)"
}

install_docker

# Add current (non-root) user to docker group if applicable
if [[ -n "${SUDO_USER:-}" ]]; then
  usermod -aG docker "$SUDO_USER" 2>/dev/null && info "User '${SUDO_USER}' added to docker group."
fi

# Verify Docker
docker run --rm hello-world &>/dev/null && info "Docker hello-world check passed." || warn "Docker hello-world check failed (expected on some restricted envs)."

info "Docker Compose: $(docker compose version 2>/dev/null || echo 'plugin installed')"

# ──────────────────────────────────────────────────────────────
#  4. Server IP Detection
# ──────────────────────────────────────────────────────────────

section "IP Address Detection"

detect_ip() {
  local public_ip="" private_ip=""

  # Public IP — try multiple providers
  for provider in "https://api.ipify.org" "https://ifconfig.me" "https://icanhazip.com"; do
    public_ip=$(curl -s --max-time 5 "$provider" 2>/dev/null | head -1)
    [[ -n "$public_ip" && "$public_ip" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] && break
  done

  # Private IP
  private_ip=$(ip route get 1 2>/dev/null | awk '{print $7; exit}' | head -1)
  if [[ -z "$private_ip" ]]; then
    private_ip=$(hostname -I 2>/dev/null | awk '{print $1}')
  fi

  echo "$public_ip" >/dev/null
  echo "$private_ip" >/dev/null

  if [[ -n "$public_ip" ]]; then
    info "Public IP:  ${public_ip}"
  else
    warn "Public IP:  could not be detected."
    public_ip="(unknown)"
  fi

  if [[ -n "$private_ip" ]]; then
    info "Private IP: ${private_ip}"
  else
    warn "Private IP: could not be detected."
    private_ip="(unknown)"
  fi
}

detect_ip

# ──────────────────────────────────────────────────────────────
#  5. Firewall Configuration
# ──────────────────────────────────────────────────────────────

section "Firewall Configuration"

configure_firewall() {
  # Detect SSH port
  SSH_PORT=$(grep -E "^Port " /etc/ssh/sshd_config 2>/dev/null | awk '{print $2}' | head -1)
  SSH_PORT="${SSH_PORT:-22}"
  info "Detected SSH port: ${SSH_PORT}"

  if [[ "$OS_ID" == "ubuntu" || "$OS_ID" == "debian" ]]; then
    if command -v ufw &>/dev/null; then
      info "Firewall system: UFW"
      if prompt_yesno "Configure UFW firewall now?"; then
        ufw allow "$SSH_PORT/tcp" comment "SSH"
        ufw allow 80/tcp comment "HTTP"
        ufw allow 443/tcp comment "HTTPS"
        ufw --force enable
        info "UFW enabled. Rules:"
        ufw status verbose >&3
      else
        warn "Skipping UFW configuration."
      fi
    else
      info "UFW not installed. Installing..."
      apt-get install -y ufw
      if prompt_yesno "Configure UFW firewall now?"; then
        ufw allow "$SSH_PORT/tcp" comment "SSH"
        ufw allow 80/tcp comment "HTTP"
        ufw allow 443/tcp comment "HTTPS"
        ufw --force enable
        info "UFW enabled. Rules:"
        ufw status verbose >&3
      else
        warn "Skipping UFW configuration."
      fi
    fi
  elif [[ "$OS_ID" == "centos" || "$OS_ID" == "rhel" || "$OS_ID" == "rocky" || "$OS_ID" == "almalinux" ]]; then
    if command -v firewall-cmd &>/dev/null; then
      info "Firewall system: firewalld"
      if prompt_yesno "Configure firewalld now?"; then
        systemctl enable firewalld
        systemctl start firewalld
        firewall-cmd --permanent --add-port="${SSH_PORT}/tcp"
        firewall-cmd --permanent --add-service=http
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload
        info "firewalld configured:"
        firewall-cmd --list-all >&3
      else
        warn "Skipping firewalld configuration."
      fi
    else
      warn "firewalld not found. Skipping firewall setup."
    fi
  fi
}

configure_firewall

# ──────────────────────────────────────────────────────────────
#  6. Security Hardening
# ──────────────────────────────────────────────────────────────

section "Security Hardening"

# ── 6a. SSH config backup & hardening ──

harden_ssh() {
  local sshd_config="/etc/ssh/sshd_config"
  local sshd_backup="${BACKUP_DIR}/sshd_config.backup.$(date +%s)"

  cp "$sshd_config" "$sshd_backup"
  info "SSH config backed up to: ${sshd_backup}"

  # Check for SSH key auth
  local has_key_auth=false
  if [[ -n "${SUDO_USER:-}" ]]; then
    local user_home
    user_home=$(getent passwd "$SUDO_USER" | cut -d: -f6)
    if [[ -f "${user_home}/.ssh/authorized_keys" && -s "${user_home}/.ssh/authorized_keys" ]]; then
      has_key_auth=true
    fi
  fi
  # Also check root
  if [[ -f /root/.ssh/authorized_keys && -s /root/.ssh/authorized_keys ]]; then
    has_key_auth=true
  fi

  # Disable root SSH login
  if grep -q "^PermitRootLogin" "$sshd_config"; then
    sed -i 's/^PermitRootLogin.*/PermitRootLogin prohibit-password/' "$sshd_config"
  else
    echo "PermitRootLogin prohibit-password" >> "$sshd_config"
  fi
  info "SSH root login: set to prohibit-password (key-only)."

  if $has_key_auth && prompt_yesno "SSH keys detected. Disable password authentication?"; then
    if grep -q "^PasswordAuthentication" "$sshd_config"; then
      sed -i 's/^PasswordAuthentication.*/PasswordAuthentication no/' "$sshd_config"
    else
      echo "PasswordAuthentication no" >> "$sshd_config"
    fi
    info "Password authentication: disabled."
  else
    if ! $has_key_auth; then
      warn "No SSH keys found — password authentication left enabled."
    else
      warn "Password authentication left enabled (user declined)."
    fi
  fi

  # Additional SSH hardening
  local settings=(
    "ClientAliveInterval 300"
    "ClientAliveCountMax 2"
    "MaxAuthTries 3"
    "MaxSessions 10"
    "Protocol 2"
  )
  for setting in "${settings[@]}"; do
    local key="${setting%% *}"
    local val="${setting#* }"
    if grep -q "^${key}" "$sshd_config"; then
      sed -i "s/^${key}.*/${key} ${val}/" "$sshd_config"
    else
      echo "${key} ${val}" >> "$sshd_config"
    fi
  done
  info "SSH hardening settings applied."

  # Test config before restart
  if sshd -t &>/dev/null; then
    systemctl restart sshd || systemctl restart ssh
    info "SSH configuration valid — service restarted."
  else
    error "SSH configuration has errors! Restoring backup..."
    cp "$sshd_backup" "$sshd_config"
    systemctl restart sshd || systemctl restart ssh
    warn "SSH config reverted to backup."
  fi
}

if prompt_yesno "Apply SSH hardening?"; then
  harden_ssh
else
  warn "SSH hardening skipped."
fi

# ── 6b. Fail2Ban ──

install_fail2ban() {
  if command -v fail2ban-server &>/dev/null; then
    info "Fail2Ban already installed."
    return
  fi

  info "Installing Fail2Ban..."
  eval "$PKG_INSTALL fail2ban" || {
    warn "Failed to install Fail2Ban."
    return
  }

  # Basic config
  local jail_local="/etc/fail2ban/jail.local"
  if [[ ! -f "$jail_local" ]]; then
    cat > "$jail_local" <<-EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
destemail = root@localhost
action = %(action_mwl)s

[sshd]
enabled = true
port = ${SSH_PORT:-22}
logpath = %(sshd_log)s
backend = %(sshd_backend)s
EOF
  fi

  systemctl enable fail2ban
  systemctl start fail2ban
  info "Fail2Ban installed and running."
}

if prompt_yesno "Install and configure Fail2Ban?"; then
  install_fail2ban
else
  warn "Fail2Ban installation skipped."
fi

# ── 6c. Automatic security updates ──

if prompt_yesno "Configure automatic security updates?"; then
  case "$OS_ID" in
    ubuntu|debian)
      eval "$PKG_INSTALL unattended-upgrades"
      dpkg-reconfigure -f noninteractive unattended-upgrades 2>/dev/null || true
      info "Unattended-upgrades configured."
      ;;
    centos|rhel|rocky|almalinux)
      eval "$PKG_INSTALL dnf-automatic"
      systemctl enable --now dnf-automatic.timer 2>/dev/null || warn "Could not enable dnf-automatic timer."
      info "DNF automatic updates configured."
      ;;
  esac
else
  warn "Automatic security updates skipped."
fi

# ── 6d. File permissions ──

section "File Permissions"

chmod 600 /etc/ssh/sshd_config 2>/dev/null || true
chmod 700 /root/.ssh 2>/dev/null || true
if [[ -f /root/.ssh/authorized_keys ]]; then
  chmod 600 /root/.ssh/authorized_keys
fi

# ──────────────────────────────────────────────────────────────
#  7. Final Summary
# ──────────────────────────────────────────────────────────────

header "Setup Complete — Final Report"

report() {
  local label="$1" value="$2" status="$3"
  case "$status" in
    ok)   printf "  ${GREEN}✓${NC}  %-30s %s\n" "$label" "$value" >&3;;
    warn) printf "  ${YELLOW}⚠${NC}  %-30s %s\n" "$label" "$value" >&3;;
    err)  printf "  ${RED}✗${NC}  %-30s %s\n" "$label" "$value" >&3;;
    *)    printf "     %-30s %s\n" "$label" "$value" >&3;;
  esac
}

report "OS" "${OS_NAME}" ok
report "Public IP" "${public_ip:-(unknown)}" ok
report "Private IP" "${private_ip:-(unknown)}" ok
report "Docker version" "$(docker --version 2>/dev/null || echo 'not installed')" ok
report "Docker Compose" "$(docker compose version 2>/dev/null || echo 'not installed')" ok

if command -v ufw &>/dev/null; then
  report "Firewall" "UFW $(ufw status 2>/dev/null | head -1)" ok
elif command -v firewall-cmd &>/dev/null; then
  report "Firewall" "firewalld $(firewall-cmd --state 2>/dev/null)" ok
else
  report "Firewall" "not configured" warn
fi

if command -v fail2ban-server &>/dev/null && systemctl is-active fail2ban &>/dev/null; then
  report "Fail2Ban" "active" ok
else
  report "Fail2Ban" "not installed" warn
fi

report "SSH port" "${SSH_PORT:-22}" ok
if grep -q "^PasswordAuthentication no" /etc/ssh/sshd_config 2>/dev/null; then
  report "SSH password auth" "disabled" ok
else
  report "SSH password auth" "enabled" warn
fi

echo "" >&3
header "Next Steps"
echo "" >&3
echo "  1. Clone the project repository:" >&3
echo "     git clone <repo-url> /opt/azadi-coffee" >&3
echo "" >&3
echo "  2. From the project's deploy/ directory, run:" >&3
echo "     docker compose up -d" >&3
echo "" >&3
echo "  3. Set DNS A-record for your domain to: ${public_ip:-(your server IP)}" >&3
echo "" >&3
echo "  4. Point your domain's A-record to the server IP above." >&3
echo "" >&3
echo "  5. Visit your domain to complete the WordPress setup wizard." >&3
echo "" >&3
echo "  Log file: ${LOG_FILE}" >&3
echo "  Backups:  ${BACKUP_DIR}" >&3
echo "" >&3

info "Setup script completed."
