<?php

require_once 'Entity.php';
require_once __DIR__ . '/../DuplicateVoteCheckMethodDao.php';
require_once __DIR__ . '/../DbUtils.php';

class DuplicateVoteCheckMethod extends Entity
{
    public int $id;
    public string $name;

    function __construct(array $properties = [])
    {
        try {

            parent::__construct($properties);

            if (isset($properties['id'])) {

                $dbUtils = new DbUtils();
                $m = (new DuplicateVoteCheckMethodDao($dbUtils))->getMethod($properties['id']);

                foreach (get_object_vars($m) as $key => $value) {
                    $this->$key = $value;
                }
            }
        } catch (Exception $e) {
            Common::log($e);
        }
    }
}
