<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<?php
// Autoload files using composer
require_once __DIR__ . '/vendor/autoload.php';

require_once 'common.php';

// Use this namespace
use Steampixel\Route;

function handleCreatePoll($viewName)
{
  return function () use ($viewName) {
    include("views/$viewName.php");
  };

  // return function ($req, $res) {

  //   $duplicateCheckMethods = $db->getDuplicateCheckMethods();

  //   res.render(viewName, pageOptions('Create Poll', {

  //     duplicateCheckMethods: prepareObjectForFrontend(db.getDuplicateCheckMethods())

  //   }));
  // }
}

Route::add('/', handleCreatePoll('poll_display_create'));

// Add a 404 not found route
Route::pathNotFound(function ($path) {
  // Do not forget to send a status header back to the client
  // The router will not send any headers by default
  // So you will have the full flexibility to handle this case
  header('HTTP/1.0 404 Not Found');
  include('views/404.php');
});


/**
 * 
 * @param string $part the part of the app to load messages for (or the page)
 * e.g : "header", "home"
 * @param string $locale e.g "fr-FR"
 * @return array array containing messages
 */
Route::add('/locales/([a-z]+(?:-[a-z]+)*)/([a-z]{2}-[A-Z]{2})', function ($part, $locale) {

  // echo 'requested : ' . $part . ' - ' . $locale;

  $parts = explode('-', $part);

  // Common::dlog(Common::$localesMsgs);
  $localeMsgs = Common::$localesMsgs[$locale];

  foreach ($parts as $part) {
    $localeMsgs = $localeMsgs[$part];
  }

  // Common::log($localeMsgs);

  echo json_encode($localeMsgs);
});

// Run the router
Route::run('/');
