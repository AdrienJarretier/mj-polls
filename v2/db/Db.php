<?php

// ini_set('display_errors', "1");
// ini_set('display_startup_errors', "1");
// error_reporting(E_ALL);

require_once 'daos/PollDao.php';
require_once 'daos/PollChoicesDao.php';
require_once 'daos/PollsVotesDao.php';
require_once 'daos/joinDaos/Poll_Choices_Votes_Dao.php';
require_once __DIR__ . '/../Common.php';
// require 'entities/Poll.php';
// require 'entities/PollChoice.php';

class Db
{
    function __construct()
    {
        $this->dbUtils = new DbUtils();

        $this->pollDao = new PollDao($this->dbUtils);
        $this->dao = &$this->pollDao;

        $this->pollChoicesDao = new PollChoicesDao($this->dbUtils);
        $this->pollsVotesDao = new PollsVotesDao($this->dbUtils);
        $this->pcvDao = new Poll_Choices_Votes_Dao($this->dbUtils);
        $this->gradesDao = new GradesDao($this->dbUtils);
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

        $voteEntries = [];
        foreach ($vote as $choice_id => $voteValue) {
            array_push($voteEntries, [$choice_id, $voteValue]);
        }

        $voteEntriesCount = count($voteEntries);
        if ($voteEntriesCount != count($choices_ids)) {
            $this->dao->dbUtils->rollBack();
            throw new Exception(
                'number of votes does not match number of choices in ' . $pollId
            );
        }

        foreach ($voteEntries as $voteEntry) {
            $choice_id = intval($voteEntry[0]);
            if (!in_array($choice_id, $choices_ids)) {
                $this->dao->dbUtils->rollBack();
                throw new Exception(
                    'choice ' . $choice_id . ' does not belong to poll ' . $pollId
                );
            }
        }
        $updatesResults = $this->pollsVotesDao->increment($voteEntries);

        // update unsuccessfull
        if (count($updatesResults) < $voteEntriesCount) {
            $this->dao->dbUtils->rollBack();
            return false;
        }
        foreach ($updatesResults as $updateResult) {
            // update unsuccessfull
            if ($updateResult->changes != 1) {
                $this->dao->dbUtils->rollBack();
                return false;
            }
        }
        $updateSuccess = true;


        // count the total number of votes
        $votersCount = $this->pcvDao->getNumberOfVoters($pollId);

        if (count($votersCount) != $voteEntriesCount)
            throw new Exception('number of choices in votersCount does not match number of voteEntries');


        $max_voters = $this->pollDao->getPoll($pollId)->max_voters;
        $votes_count = $votersCount[0]->voters;

        // Compare the total number of votes to the max allowed votes
        if ($max_voters !== null && $votes_count >= $max_voters) {
            $this->closePoll($pollId, 1);
        }

        $this->dao->dbUtils->commit();
        return $updateSuccess;
    }

    /**
     * 
     * @param int $id - poll id
     * @return Poll
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
    }

    /**
     * @return Poll
     */
    function getPollFromIdentifier(string $pollIdentifier)
    {
        $poll = $this->dao->getPollFromIdentifier($pollIdentifier);
        $choices = $this->dao->getChoicesOfPoll($poll->id);
        $poll->addChoices($choices);
        return $poll;
    }

    // {
    //     uuid: '5e1b5e2a-1299-4129-824e-8024401ab93f',
    //     title: 'test',
    //     max_voters: 100,
    //     max_datetime: null,
    //     datetime_opened: '2022-03-04 10:23:29',
    //     datetime_closed: null,
    //     duplicate_vote_check_method_id: null,
    //     choices: [ { id: 1, name: 'cho1', votes: [Object] } ]
    //   }
    //   choices :
    //   [
    //     {
    //       id: 1,
    //       name: 'cho1',
    //         votes: {
    //             '1': { id: 1, value: 'Excellent', order: 50, count: 0 },
    //             '2': { id: 2, value: 'Very Good', order: 40, count: 0 },
    //             '3': { id: 3, value: 'Good', order: 30, count: 0 },
    //             '4': { id: 4, value: 'Acceptable', order: 20, count: 0 },
    //             '5': { id: 5, value: 'Poor', order: 10, count: 0 },
    //             '6': { id: 6, value: 'To Reject', order: 0, count: 0 }
    //         }
    //     }
    //   ]

    /**
     * @return Poll
     */
    function getFullPoll($pollId)
    {
        $poll = $this->getPoll($pollId);
        $polls_votes = $this->pollsVotesDao->get($pollId);

        $poll->addVotes($polls_votes);

        // Common::log($poll);
        // Common::log($polls_votes);
        // exit;

        return $poll;
    }

    // function getFullPoll(poll_id) {
    //     let poll = getPoll(poll_id);

    //     let polls_votes = executeStatement(`
    // SELECT pv.* FROM polls_votes AS pv
    // INNER JOIN polls_choices AS pc ON pv.poll_choice_id=pc.id
    // WHERE pc.poll_id = ?;
    // `, 'all', [poll_id]);

    //     let grades = getGrades();
    //     for (let choice of poll.choices) {
    //         choice['votes'] = {};
    //         for (let grade of grades) {
    //             choice['votes'][grade.id] = Object.assign({}, grade);
    //         }
    //         // console.log(choice['votes']);
    //         for (let vote of polls_votes) {
    //             if (vote.poll_choice_id == choice.id) {
    //                 // console.log(vote.grade_id, vote.count);
    //                 choice['votes'][vote.grade_id].count = vote.count;
    //                 // console.log(choice);
    //             }
    //         }
    //     }
    //     return poll;
    // }





    /**
     * @return int the id of the poll
     */
    function getIdFromIdentifier(string $identifier)
    {
        return $this->dao->getIdFromIdentifier($identifier);
    }

    function getGrades()
    {
        return $this->gradesDao->getGrades();
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
    function insertPoll(Poll $poll, bool $ignoreConstraints = false)
    {
        $pollId = null;

        $this->dao->dbUtils->beginTransaction();

        try {

            if ($ignoreConstraints)
                $this->dao->dropConstraintMaxDatetime();

            $matches = [];
            preg_match(
                '/{([0-9]+)}$/',
                Common::$serverConfig->pollIdentifierPattern,
                $matches
            );
            $poll->setIdentifier(Common::randomIdentifier(
                $matches[1]
            ));

            // if title is not only whitespaces
            $re = '/^\s*(\S.*?\S?)\s*$/';
            $matched = preg_match($re, $poll->title);

            if (!$matched) {
                throw new Exception('db.insertPoll() : title is only whitespaces');
            }

            $pollId = $this->dao->insertPoll($poll);
        } catch (Exception $e) {
            // echo $e;
            $this->dao->dbUtils->rollBack();
            if ($e->getCode() == 23514) {
                throw new Exception("Can't insert poll, constraint violated");
            } else
                throw $e;
        } finally {

            if ($ignoreConstraints)
                $this->dao->addConstraintMaxDatetime();
        }

        // ------------------------ INSERT choices ------------------------

        try {
            $pcs_insertsResults = $this->pollChoicesDao->insert($pollId, $poll->choices);

            if (count($pcs_insertsResults) == 0) {

                throw new Exception('Db::insertPoll() : no choices inserted, aborting poll insertion');
            }
        } catch (Exception $e) {

            $this->dao->dbUtils->rollBack();
            throw $e;
        }



        // ----------------------------------------------------------------
        // ---------------------- INSERT polls_votes ----------------------
        try {
            // Common::log('pcs_insertsResults');
            // Common::log($pcs_insertsResults);

            $this->pollsVotesDao->insert($pcs_insertsResults);
        } catch (Exception $e) {
            Common::error_log('error inserting into polls_votes', $e);
        }


        // ----------------------------------------------------------------



        $this->dao->dbUtils->commit();

        return intval($pollId);
    }


    function isClosed(int $pollId)
    {

        if ($pollId < 1)
            throw 'db.isClosed() : argError : pollId';


        $row = $this->dao->getPollClosingTime($pollId);

        // echo PHP_EOL . 'isClosed' . PHP_EOL;
        // echo PHP_EOL . 'row' . PHP_EOL;
        // print_r($row);

        $datetime_closed = $row->datetime_closed;
        $maxDatetime = strtotime($row->max_datetime . 'Z');

        if ($maxDatetime < time()) {
            $this->dao->_closePoll($pollId, 2);
            $datetime_closed = $maxDatetime;
        }

        return $datetime_closed != null;
    }


    /*
        There are only 2 instances when a poll will close
        1 - the number of votes exceed max_voters   =>  datetime_closed <- CURRENT_TIMESTAMP
        2 - the max_datetime has expired            =>  datetime_closed <- max_datetime 

        @ 
        reason : in, value of 1 or 2 as stated above.

        errors throwns :
            - no reason given
            - reason 1, if max_voters is null
            - reason 2, if max_datetime is null
    */
    function closePoll($pollId, $reason)
    {
        $possibleReasons = [1, 2];
        if (in_array($reason, $possibleReasons)) {
            if ($this->isClosed($pollId))
                throw new Exception('poll is already closed');
        } else {
            throw new Exception('arg : reason,  must be an integer with value in ' . implode(',', $possibleReasons));
        }
        switch ($reason) {
            case 1:
                $max_voters = $this->dao->getPollMaxVoters($pollId);
                if ($max_voters === null)
                    throw new Exception('Can\'t close poll, max_voters is NULL');
                break;
            case 2:
                $max_datetime = $this->dao->getPollClosingTime($pollId)->max_datetime;
                if ($max_datetime === null)
                    throw new Exception('Can\'t close poll, max_datetime is NULL');
                break;
        }
        $results = $this->dao->_closePoll($pollId, $reason);
        return $results;
    }
}






// $db = new Db('mjpolls_unittests');

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
