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

self::add('/', function () {

    echo 'welcome to api';
});

self::add('/grades', function () {

    asJson((new Db(constant('DB_NAME')))->getGrades());
});

self::add('/((?:[a-z0-9]){8})', function ($pollIdentifier) {

    asJson((new Db(constant('DB_NAME')))->dao->getPollFromIdentifier($pollIdentifier));
});
