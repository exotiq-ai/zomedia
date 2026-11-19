<?php
// Temporary main-host bridge for clients retaining pre-cutover DNS records.
// The WooCommerce hostname never enters this handler. No credentials are copied.
function zomedia_transition_plan(array $server): array {
    $host = strtolower($server['HTTP_HOST'] ?? '');
    if (!in_array($host, ['zomediaproductions.com', 'www.zomediaproductions.com'], true)) {
        return ['status' => 404];
    }
    $method = $server['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, ['GET', 'HEAD', 'POST'], true)) {
        return ['status' => 405];
    }
    $uri = $server['REQUEST_URI'] ?? '/';
    if (!preg_match('~^/(?!/)[^\x00-\x20\x7f]*$~D', $uri)) {
        return ['status' => 400];
    }
    if ((int)($server['CONTENT_LENGTH'] ?? 0) > 1048576) {
        return ['status' => 413];
    }
    if ($host === 'www.zomediaproductions.com') {
        return ['status' => $method === 'POST' ? 307 : 301, 'location' => 'https://zomediaproductions.com' . $uri];
    }
    return ['status' => 200, 'url' => 'https://zomediaproductions.com' . $uri, 'method' => $method];
}

function zomedia_transition_cookie(string $cookies): string {
    if (preg_match('/(?:^|;\s*)__Host-zo-preview=(\d+\.[A-Za-z0-9_-]{43})(?:;|$)/', $cookies, $match)) {
        return '__Host-zo-preview=' . $match[1];
    }
    return '';
}
if (defined('ZOMEDIA_TRANSITION_TEST')) { return; }
$plan = zomedia_transition_plan($_SERVER);
if ($plan['status'] !== 200) {
    http_response_code($plan['status']);
    if (isset($plan['location'])) { header('Location: ' . $plan['location']); }
    header('Cache-Control: no-store');
    exit;
}
$body = file_get_contents('php://input', false, null, 0, 1048577);
if ($body === false || strlen($body) > 1048576) {
    http_response_code(413);
    exit;
}
$responseHeaders = [];
$curl = curl_init($plan['url']);
$options = [
    // Fixed Netlify origin, independent of HostGator's DNS cache. TLS stays verified.
    CURLOPT_RESOLVE => ['zomediaproductions.com:443:75.2.60.5'],
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_ENCODING => '',
    CURLOPT_CUSTOMREQUEST => $plan['method'],
    CURLOPT_HTTPHEADER => ['Accept: ' . ($_SERVER['HTTP_ACCEPT'] ?? '*/*')],
    CURLOPT_HEADERFUNCTION => function ($curl, $line) use (&$responseHeaders) {
        if (preg_match('~^HTTP/~i', $line)) { $responseHeaders = []; }
        else {
            $parts = explode(':', $line, 2);
            if (count($parts) === 2) { $responseHeaders[strtolower(trim($parts[0]))][] = trim($parts[1]); }
        }
        return strlen($line);
    },
];
$previewCookie = zomedia_transition_cookie($_SERVER['HTTP_COOKIE'] ?? '');
if ($previewCookie !== '') { $options[CURLOPT_HTTPHEADER][] = 'Cookie: ' . $previewCookie; }
if (($_SERVER['HTTP_ORIGIN'] ?? '') === 'https://zomediaproductions.com') {
    $options[CURLOPT_HTTPHEADER][] = 'Origin: https://zomediaproductions.com';
}
if ($plan['method'] === 'HEAD') { $options[CURLOPT_NOBODY] = true; }
if ($plan['method'] === 'POST') {
    $options[CURLOPT_POSTFIELDS] = $body;
    $options[CURLOPT_HTTPHEADER][] = 'Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'application/x-www-form-urlencoded');
}
curl_setopt_array($curl, $options);
$response = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);
if ($response === false || $status < 100) {
    http_response_code(502);
    header('Cache-Control: no-store');
    echo 'The website is temporarily unavailable. Please try again shortly.';
    exit;
}
http_response_code($status);
foreach (['content-type', 'location', 'etag', 'last-modified', 'vary', 'content-disposition', 'content-range', 'accept-ranges', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'permissions-policy', 'strict-transport-security', 'x-robots-tag'] as $name) {
    foreach ($responseHeaders[$name] ?? [] as $value) { header($name . ': ' . $value, false); }
}
foreach ($responseHeaders['set-cookie'] ?? [] as $cookie) {
    if (str_starts_with($cookie, '__Host-zo-preview=')) { header('Set-Cookie: ' . $cookie, false); }
}
// Avoid retaining a temporary response after resolver caches expire.
header('Cache-Control: no-store');
header('X-ZoMedia-Origin: Netlify-transition');
// Remove the old permanent WordPress redirect from this origin's HTTP cache.
// Cookies and local storage are retained.
if ($plan['method'] === 'GET' && parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) === '/') {
    header('Clear-Site-Data: "cache"');
}
if ($plan['method'] !== 'HEAD') { echo $response; }
