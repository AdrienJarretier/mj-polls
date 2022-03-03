<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<?php
// Autoload files using composer
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../common.php';

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

    static function add($expression, $function, $method = 'get')
    {
        if (self::$basePath[-1] == '/') {
            $expression = ltrim($expression, '/');
        }
        if ($expression == '/')
            $expression = '';

        $fullPath = self::$basePath . $expression;

        Route::add($fullPath, $function, $method);
    }
}
