-- ============================================================
-- UjjainTemple.com — Simhastha 2028 news section
-- BNA `phpsession` tenant storage. MySQL 5.7+ / MariaDB 10.3+.
-- Idempotent: safe to re-run.
-- ============================================================
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS ujt_news_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(80)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'editor',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME     NULL,
  UNIQUE KEY uq_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ujt_news_categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(140) NOT NULL,
  description VARCHAR(400) NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cat_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ujt_news_articles (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  slug               VARCHAR(200) NOT NULL,
  title              VARCHAR(300) NOT NULL,
  summary            TEXT         NULL,
  content_html       MEDIUMTEXT   NOT NULL,
  meta_title         VARCHAR(300) NULL,
  meta_description   VARCHAR(400) NULL,
  og_description     VARCHAR(400) NULL,
  featured_image     VARCHAR(500) NULL,
  featured_image_alt VARCHAR(300) NULL,
  og_image           VARCHAR(500) NULL,
  category_id        INT          NULL,
  extra_category_ids VARCHAR(200) NULL,
  tags_json          TEXT         NULL,
  language           VARCHAR(2)   NOT NULL DEFAULT 'hi',
  status             VARCHAR(12)  NOT NULL DEFAULT 'published',
  view_count         INT          NOT NULL DEFAULT 0,
  published_at       DATETIME     NULL,
  created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_slug (slug),
  KEY idx_live (status, language, published_at),
  KEY idx_cat (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
