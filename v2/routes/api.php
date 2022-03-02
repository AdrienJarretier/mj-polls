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


SubRouter::add('/', function() {
    echo 'welcome to api';
});

Common::log(Route::getAll(), true);

// foreach(Route::getAll() as $route) {

//     if($route['expression'] == '/api') {
//         Common::log($route, true);
//     }
// }