<?php

require_once __DIR__ . '/entities/DuplicateVoteCheckMethod.php';

class DuplicateVoteCheckMethodDao
{
    function __construct(DbUtils &$dbUtils)
    {
        $this->dbUtils = $dbUtils;
    }

    /**
     * @return array of int, list of ids in db
     */
    function getIds()
    {
        $ids = $this->dbUtils->prepareAndExecute(
            'SELECT id FROM duplicate_vote_check_methods;',
            'all',
            []
        );
        // Common::log();
        // exit();
        return array_map(fn ($obj) => $obj->id, $ids);
    }

    function getMethods()
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT *
            FROM duplicate_vote_check_methods;
            ',
            'all'
        );
    }

    function getMethod($id)
    {
        return $this->dbUtils->prepareAndExecute(
            'SELECT *
            FROM duplicate_vote_check_methods
            WHERE id = ?;
            ',
            'get',
            [$id],
            'DuplicateVoteCheckMethod'
        );
    }
}
