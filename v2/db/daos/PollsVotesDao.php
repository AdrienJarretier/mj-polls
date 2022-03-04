<?php

class PollsVotesDao
{
    function __construct(DbUtils &$dbUtils)
    {
        $this->dbUtils = $dbUtils;
    }

    function get($pollId)
    {
        return $this->dbUtils->executeStatement(
            'SELECT pv.*
            FROM polls_votes AS pv
            INNER JOIN polls_choices AS pc
            ON pv.poll_choice_id=pc.id
            WHERE pc.poll_id = ?;
            ',
            'all',
            [$pollId]
        );
    }

    function insert(array $pollChoicesIds)
    {
        $gradesIds = (new GradeDao())->getIds();
    }
}
