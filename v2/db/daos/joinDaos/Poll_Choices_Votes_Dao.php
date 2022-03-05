<?php

require_once __DIR__ . '/../DbUtils.php';
require_once __DIR__ . '/../../../Common.php';

class Poll_Choices_Votes_Dao
{
    function __construct(DbUtils &$dbUtils)
    {
        $this->dbUtils = $dbUtils;
    }

    /**
     * @return object choices ids of the poll with the number of votes for each
     * the number of votes should be the same for each choice
     */
    function getNumberOfVotes(int $pollId)
    {
        $unpreparedQuery =
            'SELECT pc.id,sum(count)
        FROM polls AS p
        INNER JOIN polls_choices AS pc
        ON p.id = pc.poll_id
        INNER JOIN polls_votes AS pv
        ON pc.id = pv.poll_choice_id
        WHERE p.id = ?
        GROUP BY pc.id;';

        $votesCount = $this->dbUtils->prepareAndExecute(
            $unpreparedQuery,
            'all',
            [$pollId]
        );

        $firstChoiceVotesCount = $votesCount[0]->sum;
        for ($i = 1; $i < count($votesCount); ++$i) {
            if ($votesCount[$i]->sum != $firstChoiceVotesCount)
                throw new Exception('Choices have different number of votes in poll ' . $pollId);
        }

        return $votesCount;
    }
}

// $pcvDao = new Poll_Choices_Votes_Dao(new DbUtils());
// Common::log($pcvDao->getNumberOfVotes(279));
