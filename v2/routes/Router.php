

<?php
// Autoload files using composer
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../Common.php';

// Use this namespace
use Steampixel\Route;

class Router
{
    private static $basePath = '';

    static function use($expression, $filePath)
    {
        // Common::log('[' . $expression . ']', true);
        self::$basePath = $expression;

        include $filePath;
    }

    static function add(string $expression, Closure $function, string $method = 'get')
    {
        if (self::$basePath[-1] == '/') {
            $expression = ltrim($expression, '/');
        }
        if ($expression == '/')
            $expression = '';

        $fullPath = self::$basePath . $expression;

        Route::add($fullPath, $function, $method);
    }

    static function get(string $expression, Closure $handler)
    {
        self::add($expression, $handler);
    }

    static function post(string $expression, Closure $handler)
    {
        self::add($expression, $handler, 'post');
    }

    // static function get(string $expression, Closure ...$handlers)
    // {
    //     // Common::log('route add : ' . $expression, true);

    //     self::add($expression, function (...$args) use ($handlers) {

    //         function nextHandler()
    //         {
    //             array_shift($handlers)(...$args);
    //         }

    //         array_shift($handlers)(...$args);
    //     });
    // }
}

// Router::get('/route', 'b', 'c');
