<?php

require_once 'entities/PollChoice.php';

class DbUtils extends PDO
{
    static function debug_sql($string, $data)
    {
        $indexed = $data == array_values($data);
        foreach ($data as $k => $v) {
            if (is_string($v)) $v = "'$v'";
            if ($indexed) $string = preg_replace('/\?/', $v, $string, 1);
            else $string = str_replace(":$k", $v, $string);
        }
        return $string;
    }

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
        $bindParameters,
        $className
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
                    $rows = $stmt->fetchAll(PDO::FETCH_CLASS, $className);
                    break;

                case 'get':
                    // $stmt.expand(expand);
                    $rows = $stmt->fetchObject($className);
                    // print_r($rows);
                    break;

                case 'run':

                    // $success = $stmt->execute($bindParameters);
                    break;
            }
        } finally {
            // print self::debug_sql($stmt->queryString, $bindParameters);
        }

        return $rows;
    }

    function prepareAndExecute(
        $sqlString,
        $executionMethod,
        $bindParameters = [],
        $className = 'stdClass'
    ) {

        $stmt = $this->dbh->prepare($sqlString);

        $returnValue = $this->_executePrepared(
            $stmt,
            $executionMethod,
            $bindParameters,
            $className
        );


        return $returnValue;
    }

    /**
     * @deprecated use prepareAndExecute
     */
    function executeStatement(...$args)
    {
        return $this->prepareAndExecute(...$args);
    }

    // function executeStatement(
    //     $sqlString,
    //     $executionMethod,
    //     $bindParameters = [],
    //     $className = null
    // ) {
    //     $results = $this->prepareAndExecute(
    //         $sqlString,
    //         $executionMethod,
    //         $bindParameters,
    //         $className
    //     );

    //     return $results;
    // }
}
