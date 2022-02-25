<?php

function _executePrepared(
    $stmt,
    $executionMethod,
    $bindParameters
    // , $expand
) {

    switch ($executionMethod) {

        case 'all':
            // $stmt.expand(expand);
            return $stmt->fetchAll($bindParameters);

        case 'get':
            // $stmt.expand(expand);
            return $stmt->fetch($bindParameters);

        case 'run':

            $success = $stmt->execute($bindParameters);
            return $success;
    }
}

function prepareAndExecute(
    $dbh,
    $sqlString,
    $executionMethod,
    $bindParameters = []
) {

    $stmt = $dbh->prepare($sqlString);

    $returnValue = _executePrepared(
        $stmt,
        $executionMethod,
        $bindParameters
    );


    return $returnValue;
}
