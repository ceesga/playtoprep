#!/bin/bash
# build.sh — Regenereer js/bundle.min.js na het aanpassen van een JS-bestand.
# Gebruik: ./build.sh
# Vereist: npx (Node.js) en terser (wordt automatisch gedownload via npx).

set -e
BASE="$(cd "$(dirname "$0")" && pwd)"

echo "PlayToPrep — JS bundelen..."

npx terser \
  "$BASE/js/icons-data.js" \
  "$BASE/js/data-state.js" \
  "$BASE/js/data-scenarios-stroom.js" \
  "$BASE/js/data-scenarios-bosbrand.js" \
  "$BASE/js/data-scenarios-overstroming.js" \
  "$BASE/js/data-scenarios-thuiskomen.js" \
  "$BASE/js/data-scenarios-drinkwater.js" \
  "$BASE/js/data-scenarios-nachtalarm.js" \
  "$BASE/js/scenario-registry.js" \
  "$BASE/js/avatar-picker.js" \
  "$BASE/js/intake-steps.js" \
  "$BASE/js/intake.js" \
  "$BASE/js/prep.js" \
  "$BASE/js/inventory.js" \
  "$BASE/js/audio.js" \
  "$BASE/js/scene-renderer.js" \
  "$BASE/js/channel-manager.js" \
  "$BASE/js/phone-handler.js" \
  "$BASE/js/choice-handler.js" \
  "$BASE/js/engine.js" \
  "$BASE/js/report.js" \
  "$BASE/js/ui.js" \
  "$BASE/js/users.js" \
  "$BASE/js/login.js" \
  --compress --mangle \
  --output "$BASE/js/bundle.min.js"

SIZE=$(wc -c < "$BASE/js/bundle.min.js" | tr -d ' ')
echo "Klaar: js/bundle.min.js (${SIZE} bytes)"
