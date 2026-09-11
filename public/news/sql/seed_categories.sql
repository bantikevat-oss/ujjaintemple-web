-- 🪤 Without this the mysql CLI connects on its default charset and every
-- Devanagari name lands double-encoded (category pills render as mojibake).
SET NAMES utf8mb4;

-- Pilgrim-intent categories, NOT newsroom desks. The whole point of this section is
-- that the same story reads differently here than on Nirnayak/ShabdLok — see the
-- duplicate-content rule in SIMHASTHA-RANK-PLAN.md §1.3.
INSERT INTO ujt_news_categories (name, slug, description, sort_order) VALUES
  ('सिंहस्थ तैयारी',   'simhastha-taiyari',  'मेला क्षेत्र, निर्माण, प्रशासनिक व्यवस्था — और यात्री पर उसका असर', 1),
  ('स्नान और अखाड़े',  'snan-akhade',        'शाही स्नान, पर्व स्नान, 13 अखाड़ों की पेशवाई',                      2),
  ('यात्रा और ठहराव',  'yatra-thahrav',      'ट्रेन, बस, सड़क, होटल, धर्मशाला, कल्पवास कुटिया',                  3),
  ('मंदिर और दर्शन',   'mandir-darshan',     'महाकालेश्वर सहित उज्जैन के मंदिर, दर्शन व्यवस्था, कतार',            4),
  ('घाट और मार्ग',     'ghat-marg',          'रामघाट सहित शिप्रा के घाट, पार्किंग, पैदल मार्ग',                   5),
  -- Added 2026-09-11 for the मुख्यमंत्री block on the listing. The block also
  -- title/tag-matches, so it works before this row is synced into BNA — but an
  -- article filed here is the clean way in.
  ('मुख्यमंत्री और शासन', 'mukhyamantri-shasan', 'मुख्यमंत्री डॉ. मोहन यादव और शासन की सिंहस्थ 2028 घोषणाएँ',        6)
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), sort_order = VALUES(sort_order);
