<?php
/**
 * API Router
 * Routes API requests to appropriate endpoints
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Parse the request URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/api', '', $uri);
$parts = array_filter(explode('/', $uri));

// Route the request
if (empty($parts)) {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

$endpoint = array_shift($parts);

// Route to appropriate endpoint
switch ($endpoint) {
    case 'releases':
        require __DIR__ . '/releases/index.php';
        break;
    case 'tracks':
        require __DIR__ . '/tracks/index.php';
        break;
    case 'news':
        require __DIR__ . '/news/index.php';
        break;
    case 'upload':
        require __DIR__ . '/upload/index.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        exit;
}
?>
