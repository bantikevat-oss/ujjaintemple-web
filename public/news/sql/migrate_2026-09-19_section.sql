-- ============================================================
-- 2026-09-19 — one table, two public sections (news + blog).
-- Run ONCE on prod via phpMyAdmin before deploying the code that reads `section`.
-- Existing rows become 'news' through the DEFAULT, so nothing already live moves.
-- Not idempotent (plain ALTER): if it errors with "Duplicate column", it already ran.
-- ============================================================
SET NAMES utf8mb4;
ALTER TABLE ujt_news_articles
  ADD COLUMN section VARCHAR(10) NOT NULL DEFAULT 'news' AFTER language,
  ADD KEY idx_section_live (section, status, language, published_at);

-- Blog desks. "blog-" slug prefix is the section boundary (boot.php ujt_cat_cond):
-- tenant 4 never sees these, the blog tenant sees only these. Idempotent.
INSERT INTO ujt_news_categories (name, slug, description, sort_order) VALUES
  ('मंदिर और दर्शन समय', 'blog-mandir-darshan', 'उज्जैन के मंदिर — दर्शन और आरती का समय, कैसे पहुँचें', 101),
  ('यात्रा मार्ग और दूरी', 'blog-yatra-marg',     'उज्जैन से ओंकारेश्वर सहित आसपास के तीर्थ — दूरी, मार्ग, कैब',   102),
  ('ठहरना और यात्रा योजना', 'blog-yatra-yojana', 'होटल, धर्मशाला, 1-3 दिन की उज्जैन यात्रा योजना',             103),
  ('पर्व और त्योहार',      'blog-parv',           'उज्जैन के पर्व — तिथि और यात्रियों के लिए जानकारी',            104)
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), sort_order = VALUES(sort_order);
