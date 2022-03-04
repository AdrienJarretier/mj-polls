<?php

class GradeDao
{
    function __construct(DbUtils &$dbUtils)
    {
        $this->dbUtils = $dbUtils;
    }

    /**
     * @return array of int, list of gradesIds in db
     */
    function getIds()
    {
        $ids = $this->dbUtils->prepareAndExecute(
            'SELECT id FROM grades;',
            'all',
            []
        );
        // Common::log();
        // exit();
        return array_map(fn ($obj) => $obj->id, $ids);
    }
}
