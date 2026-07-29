#!/usr/bin/env bash
# Deploy UjjainTemple image panel to Hostinger (run from Mac; needs SSH to 'pukhta').
set -e
DEST="domains/ujjaintemple.com/public_html/panel/"
echo "→ Uploading panel to $DEST"
rsync -az -e "ssh" ./panel/index.php ./panel/config.php ./panel/secret.php ./panel/.htaccess ./panel/usage-map.json pukhta:"$DEST"
echo "✓ Panel live: https://ujjaintemple.com/panel/"
