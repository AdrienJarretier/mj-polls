<?php

namespace RoutesCommon;

use Common;

function sanitizePoll(\Poll &$poll)
{
    $keysToKeep = [
        'identifier', 'title', 'choices', 'datetime_closed',
        'max_voters',
        'max_datetime',
        'duplicate_vote_check_method_id'
    ];

    $poll = (object) array_filter(
        (array) $poll,
        function ($key) use ($keysToKeep) {

            return in_array($key, $keysToKeep);
        },
        ARRAY_FILTER_USE_KEY
    );

    // Common::log($poll->choices, true);

    array_map(
        function ($choiceObject) {
            unset($choiceObject->poll_id);
        },
        $poll->choices
    );
}
