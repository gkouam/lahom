#!/usr/bin/env bash
# Fails if any font size below 0.75rem (12px) is introduced.
# Matches 0.0rem-0.7499...rem in both CSS (font-size:) and TSX (fontSize:).
MATCHES=$(grep -rnE "font-?[sS]ize:?\s*['\"]?0\.(([0-6][0-9]*)|(7[0-4][0-9]*)|7)rem" styles app components 2>/dev/null || true)
if [ -n "$MATCHES" ]; then
  echo "Type-floor violation — font sizes below 0.75rem (12px) are not allowed:"
  echo "$MATCHES"
  exit 1
fi
