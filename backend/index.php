<?php

require_once __DIR__ . '/middleware/cors.php';

header('Content-Type: application/json');

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$routes = [
    '/api/products' => __DIR__ . '/api/products.php',
    '/api/categories' => __DIR__ . '/api/categories.php',
    '/api/orders' => __DIR__ . '/api/orders.php',
    '/api/auth' => __DIR__ . '/api/auth.php',
    '/api/cart' => __DIR__ . '/api/cart.php',
    '/api/wishlist' => __DIR__ . '/api/wishlist.php',
    '/api/users' => __DIR__ . '/api/users.php',
];

foreach ($routes as $prefix => $file) {
    if (str_starts_with($path, $prefix)) {
        require $file;
        exit;
    }
}

http_response_code(404);
echo json_encode([
    'success' => false,
    'data' => null,
    'error' => 'Route not found',
    'meta' => [],
]);

