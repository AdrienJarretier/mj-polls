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

self::get('/count', function () {

    asJson(
        (new Db(Common::$serverConfig->db->database))->getPollsCount()
    );
});


self::post('/', function () {

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
});


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
        // $responseObject->cause = $e->getMessage();
        Common::error_log(
            "####################################",
            "error in api.post('/" .
                $identifier
                . "/vote') :",
            $e->getMessage(),
            $e->getTraceAsString(),
            '####################################'
        );
    } finally {
        asJson($responseObject);
    }
});
