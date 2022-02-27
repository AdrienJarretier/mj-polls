<?php

require_once 'DbUtils.php';

class MjPollsDao
{

    function __construct(string $dbname)
    {
        $this->dbUtils = new DbUtils(
            $dbname,
            'mjpolls',
            'pass',
            [
                'verbose' => false
            ]
        );
    }

    function getPoll(int $pollId)
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT *
            FROM polls
            WHERE id = ?',
            'get',
            [$pollId],
            'Poll'
        );
    }

    function getChoicesOfPoll(int $pollId)
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT *
            FROM polls_choices
            WHERE poll_id = ?',
            'all',
            [$pollId],
            'PollChoice'
        );
    }

    /**
     * @return array choices' ids of the poll with id $pollId
     */
    function getChoicesIdOfPoll(int $pollId)
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT id
            FROM polls_choices AS pc
            WHERE pc.poll_id = ?;',
            'all',
            [$pollId]
        );
    }


    function incPollVote($voteEntries)
    {
        return $this->dbUtils->executeLoop(
            'UPDATE polls_votes
            SET count = count+1
            WHERE poll_choice_id = ?
            AND grade_id = ?
            ;',
            $voteEntries
        );
    }


    function insertPoll(Poll $poll)
    {
        $this->dbUtils->prepareAndExecute(
            'INSERT INTO polls(
                identifier, 
                title,
                max_voters,
                max_datetime)
            VALUES(?, ?, ?, ?);
            ',
            'run',
            [
                $poll->identifier,
                $poll->title,
                $poll->max_voters,
                $poll->max_datetime
            ]
        );
        return $this->dbUtils->lastInsertId();
    }

    function insertChoices(int $pollId, array $choices)
    {
        $stmt = $this->dbUtils->prepare(
            'INSERT 
            INTO polls_choices(poll_id, name) 
            VALUES(?, ?);'
        );
        $pcs_insertsResults = [];
        foreach ($choices as $choiceName) {

            $re = '/^\s*(\S.*?\S?)\s*$/';
            $matches = [];
            $matched = preg_match($re, $choiceName, $matches);
            if ($matched) {
                array_push(
                    $pcs_insertsResults,
                    $stmt->execute([$pollId, $matches[1]])
                );
            }
        }

        return $pcs_insertsResults;
    }
}
