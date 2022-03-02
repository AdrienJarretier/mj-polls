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
    function __construct()
    {
        Common::log('Router construct');
    }

    function use($expression, $filePath)
    {
        echo 'using';
    }

    function add($expression, $function, $method = 'get')
    {
        Route::add($expression, $function, $method);
    }
}
