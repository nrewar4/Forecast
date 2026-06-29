#!/usr/bin/env bash
# Self-test: logs in and reports what it sees + what it WOULD book, then exits.
# Books nothing. Run this to verify your config/selectors before going live.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

if [ ! -f config.properties ]; then
  echo "config.properties not found — copy it from the example and fill it in first:"
  echo "  cp config.example.properties config.properties"
  exit 1
fi

mvn -q exec:java -Dexec.args="dry-run"
