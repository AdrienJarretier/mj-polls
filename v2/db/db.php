<?php

require 'DbUtils.php';
require 'common.php';

class Db
{
    function __construct($user, $pass, $dbname, $opts = [
        'verbose' => false
    ])
    {
        $dbUtils = new DbUtils(
            ['verbose' => $opts['verbose']]
        );

        try {
            $this->dbh = new PDO(
                'pgsql:host=localhost;dbname=' . $dbname,
                $user,
                $pass,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
        } catch (PDOException $e) {

            print "Error!: " . $e->getMessage() . "<br/>";
            die();
        }
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

        $this->dbh->beginTransaction();

        // try {

        if ($ignoreConstraints)
            $this->dbh->pragma('ignore_check_constraints = 1');

        $resourceIdentifier = randomIdentifier(8);

        //     // if title is not only whitespaces
        //     const re = /^\s*(\S.*?\S?)\s*$/;
        //     const matched = data.title.match(re);

        //     if(!matched) {
        //         throw 'db.insertPoll() : title is only whitespaces';
        //     }

        //     let pollsInsertResult = prepareAndExecute(db, `
        //     INSERT INTO polls(uuid, title, max_voters, max_datetime)
        //     VALUES(?, ?, ?, datetime(?));
        //     `, 'run', [uuid, data.title, data.maxVotes, data.max_datetime]);

        //     pollId = pollsInsertResult.lastInsertRowid;

        // }
        // catch (e) {
        //     if (e.code == 'SQLITE_CONSTRAINT_CHECK')
        //         throw "Can't insert poll, constraint violated";
        //     else
        //         throw e;
        // }
    }
}
