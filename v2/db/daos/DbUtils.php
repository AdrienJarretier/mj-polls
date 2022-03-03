<?php

require_once 'entities/PollChoice.php';

class DbUtils extends PDO
{
    static function debug_sql(string $string, array $data)
    {
        $unpreparedString = $string;
        // copy($string, $unpreparedString);
        $indexed = $data == array_values($data);
        foreach ($data as $k => $v) {
            if (is_string($v)) $v = "'$v'";
            if ($indexed) $string = preg_replace('/\?/', $v, $string, 1);
            else $string = str_replace(":$k", $v, $string);
        }
        return $unpreparedString
            . PHP_EOL . PHP_EOL .
            implode(', ', $data)
            . PHP_EOL . PHP_EOL .
            $string;
    }

    function __construct($opts = [
        'verbose' => false
    ])
    {
        $this->options = $opts;
        try {
            parent::__construct(
                'pgsql:host=localhost;dbname=' . Common::$serverConfig->db->database,
                Common::$serverConfig->db->user,
                Common::$serverConfig->db->pass,
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
        $className,
        $verbose
        // , $expand
    ) {
        // echo PHP_EOL.PHP_EOL.PHP_EOL;
        // echo '_executePrepared'.PHP_EOL;
        // print_r($stmt);
        // print_r($executionMethod);
        // print_r($bindParameters);

        $rows = [];
        try {
            if ($verbose)
                print self::debug_sql($stmt->queryString, $bindParameters);
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
            // if ($verbose)
            //     print self::debug_sql($stmt->queryString, $bindParameters);
        }

        return $rows;
    }



    function executeLoop($sqlString, $arrayOfBindParameters)
    {
        $arrayOfResults = [];
        $stmt = $this->prepare($sqlString);
        $this->beginTransaction();
        foreach ($arrayOfBindParameters as $bindParameters) {
            $bindParameters = $bindParameters;
            array_push($arrayOfResults, $stmt->execute($bindParameters));
        }
        $this->commit();
        return $arrayOfResults;
    }



    function prepareAndExecute(
        $sqlString,
        $executionMethod,
        $bindParameters = [],
        $className = 'stdClass',
        $verbose = null
    ) {
        if ($verbose == null)
            $verbose = $this->options['verbose'];

        $stmt = $this->dbh->prepare($sqlString);

        $returnValue = $this->_executePrepared(
            $stmt,
            $executionMethod,
            $bindParameters,
            $className,
            $verbose
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
