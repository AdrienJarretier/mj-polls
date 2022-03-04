<?php

class GradeDao
{
    function __construct(DbUtils &$dbUtils)
    {
        $this->dbUtils = $dbUtils;
    }

    function getIds()
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT id FROM grades;',
            'all'
        );
    }
}
