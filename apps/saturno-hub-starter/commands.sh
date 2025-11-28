#!/usr/bin/env bash
set -e
case "$1" in
  deploy-hub) npm run deploy-hub ;;
  hub-live) echo "Open: https://gabosaturno11.github.io/AI-Hub/";;
  hub-github) echo "Repo: https://github.com/gabosaturno11/AI-Hub";;
  *) echo "Usage: ./commands.sh [deploy-hub|hub-live|hub-github]";;
esac
