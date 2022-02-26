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

    /**
     * @param int $pollId the id of the poll on which to vote 
     * @param array $vote [poll_choice_id : grade_id , ...]
     * @return boolean true if vote successfull | false otherwise
     */
    function addVote($pollId, $vote)
    {
        $updateSuccess = false;

        $this->dbUtils->beginTransaction();

        $choices_ids = $this->dbUtils->prepareAndExecute(
            'SELECT id
            FROM polls_choices AS pc
            WHERE pc.poll_id = ?;',
            'all',
            [$pollId]
        );



        // echo PHP_EOL . 'addVote : vote' . PHP_EOL;
        // print_r($vote);

        $voteEntries = [];
        foreach ($vote as $choice_id => $voteValue) {
            array_push($voteEntries, [$choice_id, $voteValue]);
        }

        // echo PHP_EOL . 'addVote : voteEntries' . PHP_EOL;
        // print_r($voteEntries);

        if (count($voteEntries) != count($choices_ids))
            throw new Exception(
                'number of votes does not match number of choices in ' . $pollId
            );

        foreach ($voteEntries as $voteEntry) {
            $choice_id = intval($voteEntry[0]);
            if (!in_array($choice_id, $choices_ids)) {
                new Exception(
                    'choice ' . $choice_id . ' does not belong to poll ' . $pollId
                );
            }
        }

        $updatesResults = $this->dbUtils->executeLoop(
            'UPDATE polls_votes
        SET count = count+1
        WHERE poll_choice_id = ?
        AND grade_id = ?
        ;',
            $voteEntries
        );

        //     // update unsuccessfull
        //     if(count($updatesResults) < count($voteEntries))
        //         return false;

        //         foreach($updatesResults as $updatesResult)
        //    {
        //         // update unsuccessfull
        //         if ($updateResult.changes != 1)
        //             return false;
        //     }

        //     updateSuccess = true;

        //     let { votes_count, max_voters } = dbUtils.prepareAndExecute(db,
        //         `SELECT sum(count) as votes_count, max_voters
        //     FROM polls AS p
        //     INNER JOIN polls_choices AS pc
        //     ON p.id = pc.poll_id
        //     INNER JOIN polls_votes AS pv
        //     ON pc.id = pv.poll_choice_id
        //     WHERE p.id = ?
        //     GROUP BY pc.id
        //     LIMIT 1;`,
        //         'get', [pollId]);

        //     if (max_voters !== null && votes_count >= max_voters) {
        //         closePoll(pollId, 1, db);
        //     }





        $this->dbUtils->commit();

        return $updateSuccess;
    }

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
