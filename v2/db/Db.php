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
    function insertPoll($data, $ignoreConstraints = false)
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

            $pollsInsertResult = $this->dbUtils->prepareAndExecute(
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

        $this->dbUtils->commit();
    }
}
