<?php

class DbUtils extends PDO
{
    function __construct($dbname, $user, $pass, $opts = [
        'verbose' => false
    ])
    {
        try {
            parent::__construct(
                'pgsql:host=localhost;dbname=' . $dbname,
                $user,
                $pass,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
        } catch (PDOException $e) {

            print "Error!: " . $e->getMessage() . "<br/>";
            die();
        }
        $this->dbh = $this;
    }

    function _executePrepared(
        $stmt,
        $executionMethod,
        $bindParameters
        // , $expand
    ) {
        $success = false;
        try {
            switch ($executionMethod) {

                case 'all':
                    // $stmt.expand(expand);
                    $success = $stmt->fetchAll($bindParameters);

                case 'get':
                    // $stmt.expand(expand);
                    $success = $stmt->fetch($bindParameters);

                case 'run':

                    $success = $stmt->execute($bindParameters);
            }
        } finally {
            // $stmt->debugDumpParams();
        }
        return $success;
    }

    function prepareAndExecute(
        $sqlString,
        $executionMethod,
        $bindParameters = []
    ) {

        $stmt = $this->dbh->prepare($sqlString);

        $returnValue = $this->_executePrepared(
            $stmt,
            $executionMethod,
            $bindParameters
        );


        return $returnValue;
    }
}
