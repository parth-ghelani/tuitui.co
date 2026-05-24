<?php

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode([
        'success' => true,
        'data' => [
            [
                'id' => '1',
                'name' => 'Satin Wrap Top',
                'price' => 3900,
                'category' => 'Tops',
            ],
            [
                'id' => '2',
                'name' => 'Velvet Co-ord Set',
                'price' => 6800,
                'category' => 'Co-ord Sets',
            ],
        ],
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

