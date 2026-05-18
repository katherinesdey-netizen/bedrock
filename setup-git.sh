#!/bin/bash
# Run this once from the Bedrock folder to wire up git.
# Usage: cd ~/Documents/Bedrock && bash setup-git.sh

set -e
REPO="https://github.com/katherinesdey-netizen/bedrock.git"

echo "→ Initializing git repo..."
git init -b main

echo "→ Adding remote..."
git remote add origin "$REPO" 2>/dev/null || git remote set-url origin "$REPO"

echo "→ Fetching from GitHub..."
git fetch origin

echo "→ Syncing local files with remote..."
git reset origin/main          # point HEAD at remote without touching files
git add -A
git commit -m "chore: sync local files" --allow-empty 2>/dev/null || true

echo "→ Setting upstream..."
git branch --set-upstream-to=origin/main main 2>/dev/null || true

echo ""
echo "✅ Done! Git is set up."
echo ""
echo "Daily workflow:"
echo "  Before working:  git pull"
echo "  After working:   git add index.html && git commit -m 'your message' && git push"
