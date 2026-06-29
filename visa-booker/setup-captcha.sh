#!/usr/bin/env bash
# One-time setup for the audio-bypass captcha solver (captcha.mode=audio).
# Clones sarperavci/GoogleRecaptchaBypass and installs the Python deps.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/python-captcha"
REPO="$DIR/GoogleRecaptchaBypass"

echo ">> Captcha solver setup in $DIR"

# 1. ffmpeg is required by the audio pipeline.
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "!! ffmpeg not found. Install it first:"
  echo "     Ubuntu/Debian : sudo apt-get install -y ffmpeg"
  echo "     macOS (brew)  : brew install ffmpeg"
  echo "     Windows       : https://ffmpeg.org/download.html (add to PATH)"
  exit 1
fi

# 2. Clone (or update) the upstream solver.
if [ -d "$REPO/.git" ]; then
  echo ">> Updating GoogleRecaptchaBypass..."
  git -C "$REPO" pull --ff-only || true
else
  echo ">> Cloning GoogleRecaptchaBypass..."
  git clone --depth 1 https://github.com/sarperavci/GoogleRecaptchaBypass.git "$REPO"
fi

# 3. Install Python dependencies (prefer a local venv to stay isolated).
PY="${PYTHON:-python3}"
echo ">> Installing Python dependencies with $PY..."
"$PY" -m pip install --user -r "$DIR/requirements.txt"
# The upstream repo ships its own requirements too.
if [ -f "$REPO/requirements.txt" ]; then
  "$PY" -m pip install --user -r "$REPO/requirements.txt"
fi

echo ">> Done. Set captcha.mode=audio in config.properties to use it."
