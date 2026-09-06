<?php
if (!defined('UJT_NEWS')) { http_response_code(403); exit('Forbidden'); }

/** Shared PDO handle. Throws nothing to the client — errors become a 500 JSON/HTML. */
function ujt_db()
{
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $c = ujt_news_config()['db'];
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s',
        $c['host'] ?? 'localhost', $c['name'], $c['charset'] ?? 'utf8mb4');
    try {
        $pdo = new PDO($dsn, $c['user'], $c['pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (Exception $e) {
        error_log('[ujt-news] DB connect failed: ' . $e->getMessage());
        ujt_fail(500, 'Database unavailable.');
    }
    return $pdo;
}

function ujt_q($sql, $params = [])
{
    $st = ujt_db()->prepare($sql);
    $st->execute($params);
    return $st;
}

function ujt_all($sql, $params = []) { return ujt_q($sql, $params)->fetchAll(); }

function ujt_one($sql, $params = [])
{
    $r = ujt_q($sql, $params)->fetch();
    return $r === false ? null : $r;
}
