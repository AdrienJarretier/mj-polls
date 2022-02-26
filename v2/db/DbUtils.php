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
        // echo PHP_EOL.PHP_EOL.PHP_EOL;
        // echo '_executePrepared'.PHP_EOL;
        // print_r($stmt);
        // print_r($executionMethod);
        // print_r($bindParameters);

        $rows = [];
        try {
            $stmt->execute($bindParameters);
            switch ($executionMethod) {

                case 'all':
                    // $stmt.expand(expand);
                    $rows = $stmt->fetchAll(PDO::FETCH_NAMED);
                    break;

                case 'get':
                    // $stmt.expand(expand);
                    $rows = $stmt->fetch();
                    // print_r($rows);
                    break;

                case 'run':

                    // $success = $stmt->execute($bindParameters);
                    break;
            }
        } finally {
            // $stmt->debugDumpParams();
        }

        return $rows;
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

    function executeStatement(
        $sqlString,
        $executionMethod,
        $bindParameters = []
    ) {
        $results = $this->prepareAndExecute(
            $sqlString,
            $executionMethod,
            $bindParameters
        );

        return $results;
    }
}
