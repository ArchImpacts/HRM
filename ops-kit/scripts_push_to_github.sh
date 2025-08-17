#!/usr/bin/env bash
set -euo pipefail
REPO_URL="${1:-}"; [ -z "$REPO_URL" ] && echo 'Usage: ./scripts_push_to_github.sh <repo.git>' && exit 1
git init
git add .
git commit -m "Initial v4.2"
git branch -M main
git remote add origin "$REPO_URL"
git push -u origin main
