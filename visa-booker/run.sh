#!/usr/bin/env bash
set -euo pipefail

# One-time: copy config and install the Playwright browser.
if [ ! -f config.properties ]; then
  echo "config.properties not found — copying from example. Edit it before running."
  cp config.example.properties config.properties
  exit 1
fi

# Install Chromium for Playwright (idempotent).
mvn -q exec:java -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install chromium" || true

# Run the watcher.
mvn -q exec:java
