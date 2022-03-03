<?php

require_once 'DbUtils.php';
require_once 'daoCommon.php';
require_once 'entities/Poll.php';

class PollDao
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

    /**
     * @return Poll
     */
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

    /**
     * @return Poll
     */
    function getPollFromIdentifier(string $pollIdentifier)
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT *
            FROM polls
            WHERE identifier = ?',
            'get',
            [$pollIdentifier],
            'Poll'
        );
    }

    /**
     * @return string the randomly generated identifier of the poll
     */
    function getIdentifierFromId(int $pollId)
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT identifier
            FROM polls
            WHERE id = ?',
            'get',
            [$pollId]
        )->identifier;
    }

    /**
     * @return int the id of the poll
     */
    function getIdFromIdentifier(string $identifier)
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT id
            FROM polls
            WHERE identifier = ?',
            'get',
            [$identifier]
        )->id;
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
     * @return array of choices ids of the poll with id $pollId
     */
    function getChoicesIdOfPoll(int $pollId)
    {
        $choicesRaw = $this->dbUtils->prepareAndExecute(
            'SELECT id
            FROM polls_choices AS pc
            WHERE pc.poll_id = ?;',
            'all',
            [$pollId]
        );

        $choices = [];

        foreach ($choicesRaw as $choiceObj) {
            array_push($choices, $choiceObj->id);
        }

        // echo PHP_EOL . 'getChoicesIdOfPoll' . PHP_EOL;
        // print_r($choicesObj);

        return $choices;
    }

    function getGrades()
    {
        return $this->dbUtils->executeStatement(
            'SELECT *
            FROM grades
            ORDER BY "order";
            ',
            'all'
        );
    }

    function getPollClosingTime(int $pollId)
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT max_datetime, datetime_closed
            FROM polls
            WHERE id=?;
            ',
            'get',
            [$pollId]
        );
    }

    function getPollMaxVoters(int $pollId)
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT max_voters
            FROM polls
            WHERE id=?;
            ',
            'get',
            [$pollId]
        )->max_voters;
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

    /**
     * 
     * @param int pollId 
     * @param int {(1|2)} reason - 1, number of votes exceed max_voters <br>
     * - 2, max_datetime expired
     */
    function _closePoll($pollId, $reason)
    {
        switch ($reason) {
            case 1:
                return $this->dbUtils->prepareAndExecute(
                    'UPDATE polls
                    SET datetime_closed=CURRENT_TIMESTAMP
                    WHERE id=?;
                    ',
                    'run',
                    [$pollId]
                );

            case 2:
                return $this->dbUtils->prepareAndExecute(
                    'UPDATE polls
                    SET datetime_closed=max_datetime
                    WHERE id=?;
                    ',
                    'run',
                    [$pollId]
                );
        }
    }

    function dropConstraintMaxDatetime()
    {
        dropConstraint($this->dbUtils, 'polls', 'polls_max_datetime_check');
    }

    function addConstraintMaxDatetime()
    {
        addConstraint($this->dbUtils, 'polls', 'polls_max_datetime_check', '(max_datetime > CURRENT_TIMESTAMP)');
    }
}
