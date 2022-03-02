<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<?php

require_once 'Router.php';

$router = new Router();

$router->add('/', function() {
    echo 'welcome to api';
});

// Common::log(Route::getAll(), true);

// foreach(Route::getAll() as $route) {

//     if($route['expression'] == '/api') {
//         Common::log($route, true);
//     }
// }