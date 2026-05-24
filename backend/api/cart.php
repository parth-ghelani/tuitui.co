<?php

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode([
        'success' => true,
        'data' => [],
        'error' => null,
        'meta' => ['source' => 'stub'],
    ]);
    exit;
}

if ($method === 'POST') {
    echo json_encode([
        'success' => true,
        'data' => ['message' => 'Item added to cart'],
        'error' => null,
        'meta' => ['source' => 'stub'],
    ]);
    exit;
}

http_response_code(405);
echo json_encode([
    'success' => false,
    'data' => null,
    'error' => 'Method not allowed',
    'meta' => [],
]);

