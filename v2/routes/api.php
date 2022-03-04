<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<?php

require_once __DIR__ . '/../db/Db.php';
require_once __DIR__ . '/RoutesCommon.php';

function asJson($data)
{
    header('Content-Type: application/json');
    echo json_encode($data);
}

function sendPoll(Poll $poll)
{
    RoutesCommon\sanitizePoll($poll);
    asJson($poll);
}

self::get('/grades', function () {

    asJson((new Db(Common::$serverConfig->db->database))->getGrades());
});

self::get('/(' . Common::$serverConfig->pollIdentifierPattern . ')', function ($pollIdentifier) {

    $poll = (new Db(Common::$serverConfig->db->database))->getPollFromIdentifier($pollIdentifier);
    sendPoll($poll);
});


self::add('/', function () {

    $body = json_decode(file_get_contents('php://input'), true);
    $poll = new Poll($body);
    // Common::log($body);
    // Common::log($poll);

    $db = new Db(Common::$serverConfig->db->database);

    try {
        $lastInsertRowid = $db->insertPoll($poll);

        $pollIdentifier = $db->dao->getIdentifierFromId($lastInsertRowid);

        asJson($pollIdentifier);
    } catch (Exception $e) {
        Common::log($e);
    }
}, 'post');


self::post('/(' . Common::$serverConfig->pollIdentifierPattern . ')/vote', function ($identifier) {

    $db = new Db();

    $pollId = $db->getIdFromIdentifier($identifier);



    $responseObject = (object)[
        'voteSuccessfull' => false,
        'cause' => 'unknown'
    ];

    try {

        $body = json_decode(file_get_contents('php://input'), true);

        if ($db->isClosed($pollId)) {
            Common::error_log('vote on closed poll');
            Common::error_log($body);
            $responseObject->voteSuccessfull = false;
            $responseObject->cause = 'poll closed';
        } else {
            $responseObject->voteSuccessfull = $db->addVote($pollId, $body);
            if ($responseObject->voteSuccessfull)
                unset($responseObject->cause);
        }
    } catch (Exception $e) {
        Common::error_log(
            "####################################",
            "error in api.post('/:id/vote') :",
            $e->getMessage(),
            $e->getTraceAsString(),
            '####################################'
        );
    } finally {
        asJson($responseObject);
    }
});
