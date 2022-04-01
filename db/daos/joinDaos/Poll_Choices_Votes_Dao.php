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
     * @return object choices ids of the poll with the number of voters for each
     * the number of voters should be the same for each choice
     */
    function getNumberOfVoters(int $pollId)
    {
        $unpreparedQuery =
            'SELECT pc.id as poll_choice_id,sum(count) as voters
        FROM polls AS p
        INNER JOIN polls_choices AS pc
        ON p.id = pc.poll_id
        INNER JOIN polls_votes AS pv
        ON pc.id = pv.poll_choice_id
        WHERE p.id = ?
        GROUP BY pc.id;';

        $votersCount = $this->dbUtils->prepareAndExecute(
            $unpreparedQuery,
            'all',
            [$pollId]
        );

        $firstChoiceVotersCount = $votersCount[0]->voters;
        for ($i = 1; $i < count($votersCount); ++$i) {
            if ($votersCount[$i]->voters != $firstChoiceVotersCount)
                throw new Exception('Choices have different number of votes in poll ' . $pollId);
        }

        return $votersCount;
    }
}

// $pcvDao = new Poll_Choices_Votes_Dao(new DbUtils());
// Common::log($pcvDao->getNumberOfVotes(279));
