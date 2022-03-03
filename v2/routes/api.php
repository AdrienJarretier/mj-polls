<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<?php

require_once __DIR__ . '/../db/Db.php';

define('DB_NAME', 'mjpolls_unittests');

function asJson($data)
{
    header('Content-Type: application/json');
    echo json_encode($data);
}

self::add('/grades', function () {

    asJson((new Db(constant('DB_NAME')))->getGrades());
});

self::add('/((?:[a-z0-9]){8})', function ($pollIdentifier) {

    asJson((new Db(constant('DB_NAME')))->getPollFromIdentifier($pollIdentifier));
});


self::add('/', function () {

    $body = json_decode(file_get_contents('php://input'), true);
    $poll = new Poll($body);
    // Common::log($body);
    // Common::log($poll);

    $db = new Db(constant('DB_NAME'));

    try {
        $lastInsertRowid = $db->insertPoll($poll);

        $pollIdentifier = $db->dao->getIdentifierFromId($lastInsertRowid);

        asJson($pollIdentifier);
    } catch (Exception $e) {
        Common::log($e);
    }
}, 'post');
