#!/usr/bin/env bash
# Build pdf/deck.pdf from pdf/deck.html via headless Chrome for Testing.
# Uses the chromium binary that puppeteer auto-installed in ~/.cache/puppeteer.
# Safari's "Save as PDF" mis-renders rgba radial-gradients (blows them up to
# opaque blobs) — Chrome's headless renderer doesn't, so we use that instead.

set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
CHROME="$HOME/.cache/puppeteer/chrome/mac-148.0.7778.97/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"

if [ ! -x "$CHROME" ]; then
  echo "Chrome for Testing not found at:"
  echo "  $CHROME"
  echo "Install via: npx puppeteer browsers install chrome"
  exit 1
fi

"$CHROME" \
  --headless=new \
  --no-sandbox \
  --disable-gpu \
  --hide-scrollbars \
  --no-pdf-header-footer \
  --print-to-pdf-no-header \
  --print-to-pdf="$HERE/deck.pdf" \
  "file://$HERE/deck.html"

echo "→ wrote $HERE/deck.pdf"
