<?php

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
