if [ -z "$1" ]; then
  echo "❌ No branch name provided. Please specify a branch to merge from."
  exit 1
fi

BRANCH_TO_MERGE=$1 
FILES_TO_PRESERVE=(
  "src/assets/images/splash.png"
  "src/services/axios/eps.js"
  "android"
  "ios"
  "app.json"
)

BACKUP_DIR=".safe_merge_backup"
rm -rf "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

echo "📦 Backing up main-specific files..."
for path in "${FILES_TO_PRESERVE[@]}"; do
  if [ -e "$path" ]; then
    mkdir -p "$BACKUP_DIR/$(dirname "$path")"
    cp -r "$path" "$BACKUP_DIR/$path"
    echo "✔️  Backed up $path"
  else
    echo "⚠️  $path not found, skipping..."
  fi
done
echo "🔄 Fetching and merging origin/$BRANCH_TO_MERGE into current branch"
git fetch origin "$BRANCH_TO_MERGE"
git merge origin/"$BRANCH_TO_MERGE"

if [ $? -ne 0 ]; then
  echo "❌ Merge failed. Resolve conflicts before continuing."
  exit 1
fi

echo "♻️ Restoring preserved main files..."
for path in "${FILES_TO_PRESERVE[@]}"; do
  if [ -e "$BACKUP_DIR/$path" ]; then
    cp -rf "$BACKUP_DIR/$path" "$path"
    echo "✔️  Restored $path"
  fi
done

echo "✅ Merge complete. Please review and commit if needed."
git status
