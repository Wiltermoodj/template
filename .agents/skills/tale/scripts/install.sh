#!/usr/bin/env bash
set -euo pipefail

# TALE Skill Installer
# Copies the tale skill into a target repository or the global Gemini/Antigravity configuration.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

show_help() {
  cat << 'EOF'
TALE Skill Installer

Usage:
  install.sh [options]

Options:
  -g, --global              Install skill globally (~/.gemini/config/skills/tale)
  -p, --project <PATH>      Install skill into a project repository (<PATH>/.agents/skills/tale)
  -h, --help                Show this help message

Default:
  If no options are provided, installs into the current working directory at ./.agents/skills/tale
EOF
}

TARGET_DIR=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -g|--global)
      TARGET_DIR="${HOME}/.gemini/config/skills/tale"
      shift
      ;;
    -p|--project)
      if [[ -z "${2:-}" ]]; then
        echo "Error: --project requires a directory path." >&2
        exit 1
      fi
      TARGET_DIR="${2}/.agents/skills/tale"
      shift 2
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      show_help
      exit 1
      ;;
  esac
done

if [[ -z "${TARGET_DIR}" ]]; then
  TARGET_DIR="$(pwd)/.agents/skills/tale"
fi

echo "Installing ASD-STE100 skill..."
echo "  Source: ${SKILL_ROOT}"
echo "  Target: ${TARGET_DIR}"

mkdir -p "${TARGET_DIR}"
cp -R "${SKILL_ROOT}/SKILL.md" "${TARGET_DIR}/"
cp -R "${SKILL_ROOT}/references" "${TARGET_DIR}/"
cp -R "${SKILL_ROOT}/scripts" "${TARGET_DIR}/"

if [[ -d "${SKILL_ROOT}/resources" ]]; then
  cp -R "${SKILL_ROOT}/resources" "${TARGET_DIR}/"
fi

chmod +x "${TARGET_DIR}/scripts/tale-lint.mjs" "${TARGET_DIR}/scripts/tale-lint.ts" "${TARGET_DIR}/scripts/install.sh"

echo "✓ ASD-STE100 skill installed successfully at: ${TARGET_DIR}"
