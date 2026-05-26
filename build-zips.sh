#!/usr/bin/env bash
#
# build-zips.sh
# Builds upload-ready zips for Claude.ai and Claude Desktop.
# Each skill becomes a self-contained zip in dist/.
#
# Source of truth for voice rules: skills/cro-audit/references/voice.md
# This script copies that file into the other two skills' references/ folders
# so each zipped skill works standalone (Claude.ai uploads one skill at a time).
#
# Usage: ./build-zips.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="$ROOT/skills"
DIST="$ROOT/dist"
SOURCE_VOICE="$SKILLS_DIR/cro-audit/references/voice.md"

if [[ ! -f "$SOURCE_VOICE" ]]; then
  echo "ERROR: voice.md not found at $SOURCE_VOICE"
  exit 1
fi

mkdir -p "$DIST"
rm -f "$DIST"/*.zip

# Propagate canonical voice.md to the other two skills so each is self-contained
for skill in cro-site-audit cro-opportunities-memo; do
  mkdir -p "$SKILLS_DIR/$skill/references"
  cp "$SOURCE_VOICE" "$SKILLS_DIR/$skill/references/voice.md"
done

# Build one zip per skill
for skill in cro-audit cro-site-audit cro-opportunities-memo; do
  (cd "$SKILLS_DIR" && zip -rq "$DIST/$skill.zip" "$skill" -x "*.DS_Store")
  size=$(du -h "$DIST/$skill.zip" | cut -f1)
  echo "  built  $skill.zip  ($size)"
done

echo ""
echo "Three zips ready in dist/."
echo ""
echo "Upload paths:"
echo "  Claude.ai      Settings > Capabilities > Skills > Upload"
echo "  Claude Desktop Settings > Skills > Upload"
echo "  Claude Code    git push, then /plugin update cro-audit-kit"
echo ""
echo "Note: /cro slash command only works in Claude Code."
echo "In Claude.ai / Desktop, trigger the skill by description:"
echo "  'Run a CRO audit on https://...'"
