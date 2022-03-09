<?php
require_once __DIR__ . '/Entity.php';
require_once __DIR__ . '/../../../Common.php';
require_once __DIR__ . '/../GradesDao.php';
require_once __DIR__ . '/../DbUtils.php';
class Grade extends Entity
{
    public int $id;
    public string $value;
    public int $order;

    function __construct(array $properties = [])
    {
        try {

            // Common::log('Grade const');
            parent::__construct($properties);

            if (isset($properties['id'])) {

                $dbUtils = new DbUtils();
                $g = (new GradesDao($dbUtils))->getGrade($properties['id']);

                foreach (get_object_vars($g) as $key => $value) {
                    $this->$key = $value;
                }
            }
        } catch (Exception $e) {
            Common::log($e);
        }
    }
}
