# Simhastha 2028 news section — deploy runbook

The section is PHP-SSR at `/hi/simhastha-2028-news/`, published into by ByteFlow News
Agent (BNA) as a `phpsession` tenant. The rest of the site stays static SSG.

## Why this path
`.htaccess` 301s every `/simhastha-2028/<anything>/` to the landing except a whitelist,
so news could never live there — an article would 301 away and never rank.
`simhastha-2028-news/` does not match that rule.

## 🔴 Deploy excludes — read before any rsync

Three runtime paths exist only on the server and are NOT in `dist/`. A plain
`rsync --delete` destroys all three:

| Path | What it is |
|---|---|
| `api/leads.csv` | real captured leads (already cost us once) |
| `panel/` | image admin panel + its `secret.php` |
| `images/news/` | hero cards BNA uploaded through `/api/upload` |

```bash
# pass 1 — site, with --delete
rsync -az --delete -e ssh \
  --exclude 'panel/' --exclude 'api/leads.csv' --exclude 'api/newsletter.csv' \
  --exclude 'images/' --exclude '.vite/' \
  dist/ pukhta:domains/ujjaintemple.com/public_html/

# pass 2 — images, additive, NO --delete (keeps panel- and BNA-uploaded files)
rsync -az -e ssh dist/images/ pukhta:domains/ujjaintemple.com/public_html/images/
```

## One-time setup (needs hPanel — Aman)

1. **Create the database** in hPanel → Databases → MySQL:
   name `u937373134_ujt_news`, user `u937373134_ujtnews`, and a fresh password.
2. **Config above the webroot** — `~/domains/ujjaintemple.com/news-config.php`
   (NOT inside `public_html/`, so no rsync and no web request can ever reach it):
   ```php
   <?php
   return [
       'db' => ['host'=>'localhost','name'=>'u937373134_ujt_news',
                'user'=>'u937373134_ujtnews','pass'=>'<the password>','charset'=>'utf8mb4'],
   ];
   ```
   `chmod 600`.
3. **Load the schema**:
   ```bash
   mysql -u u937373134_ujtnews -p u937373134_ujt_news < public_html/news/sql/schema.sql
   mysql -u u937373134_ujtnews -p u937373134_ujt_news < public_html/news/sql/seed_categories.sql
   ```
4. **Create the agent user** (bcrypt; never store the plaintext in the repo):
   ```bash
   php -r '$p=getenv("P"); echo password_hash($p, PASSWORD_BCRYPT), "\n";'
   # then INSERT INTO ujt_news_users (username,password_hash,role)
   #      VALUES ("bna-agent","<hash>","editor");
   ```
5. **Register the tenant in BNA** — run
   `news-agent/_deploy/migrate_2026-09-05_ujjaintemple_tenant.sql` against
   `u937373134_bna_db`, then set the tenant password **through the BNA admin UI** so it
   is AES-256-GCM encrypted with the live key. Never paste plaintext into SQL.
6. **Sync categories** in BNA (`bna_sync_tenant_categories(4)`) — skipping this drifts
   category ids and articles get mis-filed.
7. **Deploy the BNA publisher patch** too — `public_article_path` is what makes the
   autopilot mail link to `/hi/simhastha-2028-news/<slug>/` instead of `/article/<slug>`.
   ⚠️ `news-agent/public/` and `news-agent/_deploy/public_html/` had **pre-existing
   drift** before this change; reconcile before uploading.

## Smoke test after deploy

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://ujjaintemple.com/hi/simhastha-2028-news/
curl -s https://ujjaintemple.com/api/news-categories.php?action=list | head -c 200
curl -s -o /dev/null -w "%{http_code}\n" https://ujjaintemple.com/llms.txt
curl -s -o /dev/null -w "%{http_code}\n" https://ujjaintemple.com/rss.xml
# these must NOT be readable:
curl -s -o /dev/null -w "%{http_code}\n" https://ujjaintemple.com/news/lib/db.php      # expect 403
curl -s -o /dev/null -w "%{http_code}\n" https://ujjaintemple.com/news-config.php      # expect 404
```

Then publish one article from BNA and confirm the mailed link opens.

## Editorial rule (non-negotiable)

The same wire story already goes to Nirnayak and ShabdLok. If this section reprints it,
Google gives the canonical to the news portal and UjjainTemple gets nothing — which is
the entire reason the engine exists. The tenant's `editorial_style` must enforce:

- Pilgrim/yatri angle, never a newsroom report.
- Headline and lede written fresh — verbatim reuse is banned.
- Every article carries an "इसका आपकी सिंहस्थ यात्रा पर क्या असर है?" block.
- Dates always stated as published-media-sourced, never as official notification.
- No VIP darshan / Bhasma Aarti booking claims, no guaranteed outcomes.
- Communally sensitive stories never auto-publish (BNA gate 2 — fail closed).
