<?php

class GradeDao
{
    function __construct()
    {
        $this->dbUtils = new DbUtils();
    }

    function getIds()
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT id FROM grades;',
            'all'
        );
    }
}
