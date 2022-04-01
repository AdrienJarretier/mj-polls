<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
?>

<?php

// Autoload files using composer
require_once __DIR__ . '/vendor/autoload.php';

// Use this namespace
use Steampixel\Route;

require_once 'routes/Router.php';

require_once 'Common.php';

// Add a 404 not found route
Route::pathNotFound(function ($path) {
  // Do not forget to send a status header back to the client
  // The router will not send any headers by default
  // So you will have the full flexibility to handle this case
  if (preg_match('/^\/fr|en/', $path)) {
    header('HTTP/1.0 404 Not Found');
    include('views/404.php');
  } else {
    header('Location: en' . $path);
    exit;
  }
});

Router::use('/(?:fr|en)', 'routes/index.php');
Router::use('/polls', 'routes/api.php');
Router::use('/locales', 'routes/locales.php');

// Run the router
Route::run('/');
