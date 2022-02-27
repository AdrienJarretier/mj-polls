<?php

// ini_set('display_errors', "1");
// ini_set('display_startup_errors', "1");
// error_reporting(E_ALL);

require_once 'MjPollsDao.php';
require_once 'common.php';
// require 'entities/Poll.php';
// require 'entities/PollChoice.php';

class Db
{
    function __construct($dbname)
    {
        $this->dao = new MjPollsDao($dbname);
    }

    // for a list of results with polls and their choices
    // returns an array with polls ids as keys
    // values are the polls with an array of their choices
    function _aggregateChoices($resultRows)
    {
        $excludedColumns = ['poll_id', 'choice_id'];

        $polls = $resultRows;

        $polls = [];

        // echo PHP_EOL . '_aggregateChoices' . PHP_EOL;
        // echo PHP_EOL . 'resultRows' . PHP_EOL;
        // print_r($resultRows);

        foreach ($resultRows as $row) {

            $id = $row['poll_id'];

            if (!array_key_exists($id, $polls)) {

                $polls[$id] = [];

                foreach ($row as $key => $value) {

                    if (!in_array($key, $excludedColumns))
                        $polls[$id][$key] = $value;
                }

                $polls[$id]['choices'] = [];
            }

            $polls[$id]['choices'][$row['choice_id']] = $row['choice_id'];
        }

        // echo PHP_EOL . 'polls' . PHP_EOL;
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

        $this->dao->dbUtils->beginTransaction();

        $choices_ids = $this->dao->getChoicesIdOfPoll($pollId);





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

        $updatesResults = $this->dao->incPollVote($voteEntries);

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





        $this->dao->dbUtils->commit();

        return $updateSuccess;
    }

    /**
     * 
     * @param int $id - poll id
     * @return array {{seeBelow}}
     * [
     * - uuid: string
     * - title: string
     * - max_voters: integer | null
     * - max_datetime: string | null
     * - datetime_opened: string
     * - datetime_closed: string | null
     * - duplicate_vote_check_method_id: integer | null
     * - choices: Array
     * - [ 
     * - - {id: integer, name: string}
     * - ]
     * ]
     */
    function getPoll($id)
    {
        $poll = $this->dao->getPoll($id);
        $choices = $this->dao->getChoicesOfPoll($id);

        $poll->addChoices($choices);

        // echo PHP_EOL . 'getPoll' . PHP_EOL;
        // echo PHP_EOL . 'poll' . PHP_EOL;
        // print_r($poll);

        return $poll;

        // $rows = $this->dbUtils->executeStatement(
        //     'SELECT
        //     polls.id AS poll_id,
        //     polls_choices.id AS choice_id,
        //     title
        // FROM polls
        // INNER JOIN polls_choices
        // ON polls.id=polls_choices.poll_id
        // WHERE polls.id = ?;
        // ',
        //     'all',
        //     [$id],
        //     'PollPollChoices'
        // );

        // // $poll = _removePollId(_aggregateChoices($rows)[$id]);

        // echo PHP_EOL . 'getPoll' . PHP_EOL;
        // echo PHP_EOL . 'rows' . PHP_EOL;
        // print_r($rows);

        // $poll = $this->_aggregateChoices($rows)[$id];

        // return new Poll(
        //     $poll['id'],
        // );
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
    function insertPoll(Poll $poll, array $choices)
    {
        $pollId = null;

        $this->dao->dbUtils->beginTransaction();

        try {

            // if ($ignoreConstraints)
            //     $this->dbUtils->exec('SET CONSTRAINTS ALL DEFERRED;');

            $poll->setIdentifier(randomIdentifier(8));

            // if title is not only whitespaces
            $re = '/^\s*(\S.*?\S?)\s*$/';
            $matched = preg_match($re, $poll->title);

            if (!$matched) {
                throw new Exception('db.insertPoll() : title is only whitespaces');
            }

            $pollId = $this->dao->insertPoll($poll);
        } catch (Exception $e) {
            $this->dao->dbUtils->rollBack();
            if ($e->getCode() == 23514)
                throw new Exception("Can't insert poll, constraint violated");
            else
                throw $e;
        }

        // ------------------------ INSERT choices ------------------------

        // $gradesIds = $this->getGrades();

        // print_r($gradesIds);

        try {
            $pcs_insertsResults =
                $this->dao->insertChoices($pollId, $choices);

            if (count($pcs_insertsResults) == 0) {

                throw new Exception('Db::insertPoll() : no choices inserted, aborting poll insertion');
            }
        } catch (Exception $e) {

            $this->dao->dbUtils->rollBack();
            throw $e;
        }

        // ----------------------------------------------------------------


        $this->dao->dbUtils->commit();

        return intval($pollId);
    }
}



$db = new Db('mjpolls_unittests');

// $insertedId = $db->insertPoll([
//     'title' => 'test class Poll',
//     'maxVotes' => null,
//     'max_datetime' => null,
//     'choices' => ['testChoice1', 'testChoice2'],
//     'duplicateCheckMethod' => null
// ]);

// print_r($db->getPoll($insertedId));

// print_r($db->getGrades());

// require_once 'entities/Poll.php';

// $poll = new Poll([
//     'title' => 'test the new dao'
// ]);
// $choices = ['testdao choice 1'];

// $insertedId = $db->insertPoll($poll, $choices);
