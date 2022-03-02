<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<?php
// Autoload files using composer
require_once __DIR__ . '/../vendor/autoload.php';

// Use this namespace
use Steampixel\Route;

echo Common::log(Route::getAll());

// Route::add('/', function () {
//     echo 'api welcome';
// });

// // Run the router
// Route::run('/api');
