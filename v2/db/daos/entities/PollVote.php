<?php
// ini_set('display_errors', "1");
// ini_set('display_startup_errors', "1");
// error_reporting(E_ALL);

require_once __DIR__ . '/Grade.php';
require_once __DIR__ . '/Entity.php';
require_once __DIR__ . '/../../../Common.php';

class PollVote extends Entity
{
    public int $id;
    public Grade $grade;
    public int $count;
    public int $grade_id;

    function __construct()
    {
        parent::__construct();
        // Common::log('PollVote constructor');

        if (
            isset($this->poll_choice_id) &&
            !is_null($this->poll_choice_id)
        ) {
            $this->id = &$this->poll_choice_id;
            unset($this->poll_choice_id);
        }

        try {
            // Common::log('-------new Grade after this--------');

            if (isset($this->grade_id)) {
                $this->grade = new Grade([
                    'id' => $this->grade_id
                ]);
                unset($this->grade_id);
            }
        } catch (Exception $e) {
            Common::log($e);
        } finally {
            // Common::log(PHP_EOL);
        }
    }
}

// Common::log(new PollVote());
