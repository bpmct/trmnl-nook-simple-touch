#!/bin/bash
# Setup script for git worktrees - symlinks untracked files from main repo
# Run this after creating a new worktree

MAIN_REPO="/home/benpotter/workspace/trmnl-nook-simple-touch"

# local.properties (SDK path)
ln -sf "$MAIN_REPO/local.properties" local.properties

# SpongyCastle JARs
for jar in "$MAIN_REPO"/libs/*.jar; do
    ln -sf "$jar" libs/
done

echo "Worktree setup complete"
