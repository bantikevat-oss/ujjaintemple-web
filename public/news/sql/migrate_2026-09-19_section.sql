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
