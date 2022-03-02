<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<?php

require_once __DIR__ . '/../db/Db.php';

self::add('/', function () {

    echo 'welcome to api';
});

self::add('/grades', function () {

    echo json_encode((new Db('mjpolls_unittests'))->getGrades());
});
