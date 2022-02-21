<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<?php
// Autoload files using composer
require_once __DIR__ . '/vendor/autoload.php';

// Use this namespace
use Steampixel\Route;

Route::add('/', function () {
  include('views/index.php');
});

// Add a 404 not found route
Route::pathNotFound(function ($path) {
  // Do not forget to send a status header back to the client
  // The router will not send any headers by default
  // So you will have the full flexibility to handle this case
  header('HTTP/1.0 404 Not Found');
  include('views/404.php');
});

// Run the router
Route::run('/sondage');
