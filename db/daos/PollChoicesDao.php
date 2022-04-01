<?php

class PollChoicesDao
{
    function __construct(DbUtils &$dbUtils)
    {
        $this->dbUtils = $dbUtils;
    }

    function insert(int $pollId, array $choices)
    {
        // Common::log('insert PollChoices');
        // Common::log($pollId);
        $stmt = $this->dbUtils->prepare(
            'INSERT 
            INTO polls_choices(poll_id, name) 
            VALUES(?, ?);'
        );
        $pcs_insertsResults = [];
        foreach ($choices as $choiceName) {

            $re = '/^\s*(\S.*?\S?)\s*$/';
            $matches = [];
            $matched = preg_match($re, $choiceName, $matches);
            if ($matched) {
                $stmt->execute([$pollId, $matches[1]]);
                $pollChoice = new PollChoice();
                // $info->changes = $stmt->rowCount();
                $pollChoice->id = $this->dbUtils->lastInsertId();
                array_push(
                    $pcs_insertsResults,
                    $pollChoice
                );
            }
        }

        return $pcs_insertsResults;
    }
}
