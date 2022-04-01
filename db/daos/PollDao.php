<?php

require_once 'DbUtils.php';
require_once 'daoCommon.php';
require_once 'entities/Poll.php';

class PollDao
{

    function __construct(DbUtils &$dbUtils)
    {
        $this->dbUtils = $dbUtils;
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
            'SELECT "id", "identifier","title","datetime_closed","max_datetime"
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
        $row = $this->dbUtils->prepareAndExecute(
            'SELECT id
            FROM polls
            WHERE identifier = ?',
            'get',
            [$identifier]
        );
        if (!$row)
            return false;
        else
            return $row->id;
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


    function someData($pollId)
    {
        $this->dbUtils->prepareAndExecute(
            'SELECT sum(count) as votes_count, max_voters
            FROM polls AS p
            INNER JOIN polls_choices AS pc
            ON p.id = pc.poll_id
            INNER JOIN polls_votes AS pv
            ON pc.id = pv.poll_choice_id
            WHERE p.id = ?
            GROUP BY pc.id
            LIMIT 1;',
            'get',
            [$pollId],
            'stdClass',
            true
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

    /**
     * @return int
     */
    function getPollsCount(): int
    {
        $count = $this->dbUtils->prepareAndExecute(
            'SELECT count(*)
            FROM polls',
            'get'
        );

        return $count->count;
    }
}
