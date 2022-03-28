<?php

function dropConstraint(DbUtils $dbUtils, string $table, string $constraintName)
{
    $dbUtils->prepareAndExecute(
        "ALTER TABLE $table
        DROP CONSTRAINT $constraintName;",
        'run',
        []
    );
}

function addConstraint(DbUtils $dbUtils, $table, string $constraintName, string $checkExpression)
{
    $dbUtils->prepareAndExecute(
        "ALTER TABLE $table
    ADD CONSTRAINT $constraintName
    CHECK $checkExpression
    NOT VALID;",
        'run',
        [],
        'stdClass',
        true
    );
}
