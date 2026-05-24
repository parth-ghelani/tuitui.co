<?php

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'success' => true,
        'data' => [
            ['id' => '1', 'name' => 'Jackets'],
            ['id' => '2', 'name' => 'Indo Western'],
            ['id' => '3', 'name' => 'Co-ord Sets'],
            ['id' => '4', 'name' => 'Tops'],
            ['id' => '5', 'name' => 'Dresses'],
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

