<?php

// ini_set('display_errors', "1");
// ini_set('display_startup_errors', "1");
// error_reporting(E_ALL);

require 'DbUtils.php';
require 'common.php';

class Db
{
    function __construct($dbname)
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

    // for a list of results with polls and their choices
    // returns an object with polls ids as keys
    // values are the polls with an array of their choices
    function _aggregateChoices($resultRows)
    {
        $polls = $resultRows;

        $polls = [];

        foreach ($resultRows as $row) {

            $id = $row['id'][0];

            if (!array_key_exists($id, $polls)) {

                $polls[$id] = [];

                foreach ($row as $key => $value) {

                    if (!in_array($key, ['id', 'name', 'poll_id']))
                        $polls[$id][$key] = $value;
                }

                $polls[$id]['choices'] = [];
            }

            array_push($polls[$id]['choices'], $row['name']);
        }

        // print_r($polls);
        return $polls;
    }

    // function addVote($pollId, $vote) {

    // }

    function getPoll($id)
    {

        $rows = $this->dbUtils->executeStatement(
            '
        SELECT *
        FROM polls
        INNER JOIN polls_choices
        ON polls.id=polls_choices.poll_id
        WHERE polls.id = ?;
        ',
            'all',
            [$id]
        );

        // $poll = _removePollId(_aggregateChoices($rows)[$id]);

        $poll = $this->_aggregateChoices($rows)[$id];

        return $poll;
    }


    function getGrades()
    {

        return $this->dbUtils->executeStatement('
    SELECT * FROM grades ORDER BY "order";
    ', 'all');
    }

    /*
        data should be an array with at least those params :
        {
            title: string
            maxVotes: null or int
            max_datetime: null or string 'YYYY-MM-DD HH:MM:SS'
            choices: array of strings : [choiceName1, ...]
            duplicateCheckMethod: null or int (id of method)
        }

        Returns the id of the inserted poll
    */
    function insertPoll($data)
    {

        // ------------------------- prepare Data -------------------------

        if ($data['maxVotes'] == '')
            $data['maxVotes'] = null;

        // ----------------------------------------------------------------


        $pollId = null;

        $this->dbUtils->beginTransaction();

        try {

            // if ($ignoreConstraints)
            //     $this->dbUtils->exec('SET CONSTRAINTS ALL DEFERRED;');

            $identifier = randomIdentifier(8);

            // if title is not only whitespaces
            $re = '/^\s*(\S.*?\S?)\s*$/';
            $matched = preg_match($re, $data['title']);

            if (!$matched) {
                throw new Exception('db.insertPoll() : title is only whitespaces');
            }

            $this->dbUtils->prepareAndExecute(
                '
            INSERT INTO polls(identifier, title, max_voters, max_datetime)
            VALUES(?, ?, ?, ?);
            ',
                'run',
                [
                    $identifier,
                    $data['title'],
                    $data['maxVotes'],
                    $data['max_datetime']
                ]
            );

            $pollId = $this->dbUtils->lastInsertId();
        } catch (Exception $e) {
            $this->dbUtils->rollBack();
            if ($e->getCode() == 23514)
                throw new Exception("Can't insert poll, constraint violated");
            else
                throw $e;
        }

        // ------------------------ INSERT choices ------------------------

        // $gradesIds = $this->getGrades();

        // print_r($gradesIds);

        $stmt = $this->dbUtils->prepare(
            'INSERT 
INTO polls_choices(poll_id, name) 
VALUES(?, ?);'
        );
        $pcs_insertsResults = [];

        try {
            foreach ($data['choices'] as $choiceName) {

                $re = '/^\s*(\S.*?\S?)\s*$/';
                $matches = [];
                $matched = preg_match($re, $choiceName, $matches);
                if ($matched) {
                    array_push($pcs_insertsResults, $stmt->execute([$pollId, $matches[1]]));
                }
            }
            if (count($pcs_insertsResults) == 0) {
                throw new Exception('Db::insertPoll() : no choices inserted, aborting poll insertion');
            }
        } catch (Exception $e) {
            throw $e;
        }

        // ----------------------------------------------------------------


        $this->dbUtils->commit();

        return intval($pollId);
    }
}

// print_r((new Db('mjpolls_unittests'))->getGrades());
