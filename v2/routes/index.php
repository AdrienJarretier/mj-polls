<?php

require_once __DIR__ . '/../db/Db.php';
require_once __DIR__ . '/RoutesCommon.php';

// function prepareObjectForFrontend($object)
// {

//     return
//         preg_replace(
//             '/"/',
//             "\\\"",
//             preg_replace(
//                 "/'/",
//                 "\\'",
//                 preg_replace(
//                     '/\\\/',
//                     '\\\\\\',
//                     json_encode($object)
//                 )
//             )
//         );

//     // return json_encode($object)
//     //   .replace(/\\/g, "\\\\")
//     //   .replace(/'/g, "\\'")
//     //   .replace(/"/g, "\\\"");

// }


function pageOptions($pageTitle, $otherOptions)
{
    $options = [];

    if (isset($pageTitle))
        $options['pageTitle'] = $pageTitle;

    if (isset($otherOptions)) {
        $options = array_merge($options, $otherOptions);

        if (isset($options['poll']))
            RoutesCommon\sanitizePoll($options['poll']);
    }

    // $options = array_merge($options, $GLOBAL_OPTIONS);

    return $options;
}

function renderPollResults($pollId)
{

    try {

        $db = new Db();

        $poll = $db->getFullPoll($pollId);

        // $pollJSONstr = prepareObjectForFrontend($poll);

        $pageOptions = pageOptions('results ' . $poll->title, [
            'poll' => $poll
        ]);
        include 'views/poll_results.php';
    } catch (Exception $e) {
        Common::error_log($e);
    }
}

function handleCreatePoll($viewName)
{
    return function () use ($viewName) {
        include("views/$viewName.php");
    };
}

function handlePollView($viewName)
{
    return function ($identifier) use ($viewName) {
        try {

            $db = new Db(Common::$serverConfig->db->database);

            $pollId = $db->getIdFromIdentifier($identifier);

            // if poll is closed, send results, else send poll choices;
            if ($db->isClosed($pollId)) {
                renderPollResults($pollId);
            } else {

                $poll = $db->getPoll($pollId);

                // $pollJSONstr = prepareObjectForFrontend($poll);

                $pageOptions = pageOptions(
                    $poll->title,
                    [
                        'poll' => $poll,
                        'infiniteVoteEnabled' => Common::$serverConfig->testConfig->infiniteVoteEnabled
                    ]
                );
                include $viewName;
            }
        } catch (Exception $e) {
            Common::error_log($e);
        }
    };
}

self::add('/', handleCreatePoll('poll_display_create'));

self::add('/createPoll', handleCreatePoll('poll_display_create'));

self::get(
    '/poll/(' . Common::$serverConfig->pollIdentifierPattern . ')',
    handlePollView(Common::joinPath(__DIR__, '../views/poll_display_create.php'))
);



self::get(
    '/poll_results/(' . Common::$serverConfig->pollIdentifierPattern . ')',
    function ($identifier) {

        $poll = (new Db(Common::$serverConfig->db->database))->getPollFromIdentifier($identifier);
        // Common::log($poll, true);

        if (
            Common::$serverConfig->testConfig->testApiEnabled ||
            ($poll->max_voters === null && $poll->max_datetime === null)
        ) {
            renderPollResults($poll->id);
        } else {
            handlePollView(Common::joinPath(__DIR__, '../views/poll_display_create.php'))($identifier);
        }
    }
);

self::get(
    '/context',
    function () {
        include 'views/context.php';
    }
);
