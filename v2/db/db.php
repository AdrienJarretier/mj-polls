<?php

class Db
{
    function __construct($user, $pass, $dbname)
    {
        try {
            $this->dbh = new PDO(
                'pgsql:host=localhost;dbname='.$dbname,
                $user,
                $pass,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
        } catch (PDOException $e) {

            print "Error!: " . $e->getMessage() . "<br/>";
            die();
        }
    }

    function insertPoll()
    {
    }
}
