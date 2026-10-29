#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
  exec python3 run_local.py
elif command -v python >/dev/null 2>&1; then
  exec python run_local.py
else
  echo "OmniFile needs Python 3. Install Python and try again." >&2
  exit 1
fi
