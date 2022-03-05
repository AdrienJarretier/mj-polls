<?php

require_once 'GradeDao.php';

class PollsVotesDao
{
    function __construct(DbUtils &$dbUtils)
    {
        $this->dbUtils = $dbUtils;
    }

    function get($pollId)
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT pv.*
            FROM polls_votes AS pv
            INNER JOIN polls_choices AS pc
            ON pv.poll_choice_id=pc.id
            WHERE pc.poll_id = ?;
            ',
            'all',
            [$pollId]
        );
    }

    /**
     * @param array $pollChoices array of PollChoice
     */
    function insert(array $pollChoices)
    {

        $gradesIds = (new GradeDao($this->dbUtils))->getIds();

        // Common::log($pollChoices);
        // Common::log('-------');
        // Common::log($gradesIds);

        foreach ($pollChoices as $pollChoice) {
            $pcId = $pollChoice->id;
            foreach ($gradesIds as $gradeId) {
                $this->dbUtils->prepareAndExecute(
                    'INSERT INTO polls_votes(poll_choice_id, grade_id)
                VALUES(?, ?);',
                    'run',
                    [$pcId, $gradeId]
                );
            }
        }
    }

    /**
     * @return array
     */
    function increment($voteEntries)
    {
        // Common::log('--increment--');
        // Common::log($voteEntries);
        return $this->dbUtils->executeLoop(
            'UPDATE polls_votes
            SET count = count+1
            WHERE poll_choice_id = ?
            AND grade_id = ?
            ;',
            $voteEntries
        );
    }
}
