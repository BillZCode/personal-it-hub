<?php
declare(strict_types=1);

namespace App;

class App
{
    public function run(string $appName): void
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status' => 'success',
            'message' => "Welcome to {$appName}!",
            'runtime' => 'PHP ' . PHP_VERSION,
            'timestamp' => time()
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}
