<?php

require_once 'Entity.php';

class Poll extends Entity
{

    public string $title;
    public string $identifier;
    public array $choices;
    public $max_voters = null;
    public $max_datetime = null;
    public $datetime_opened = null;
    public $datetime_closed = null;

    private static function datetimeToMicrotime($datetime)
    {

        if ($datetime == null)
            return null;
        else
            return (new DateTime($datetime))->format('U.u');
    }

    /**
     * @param array $properties :
     * [
     *   'colName' => value,
     *   ...
     * ]
     */
    function __construct(array $properties = [])
    {
        parent::__construct($properties);
        $this->max_datetime_microtime = self::datetimeToMicrotime($this->max_datetime);
        $this->datetime_opened_microtime = self::datetimeToMicrotime($this->datetime_opened);
        $this->datetime_closed_microtime = self::datetimeToMicrotime($this->datetime_closed);
    }

    function addChoices(array $choices)
    {
        $this->choices = $choices;
        // foreach ($choices as $choice) {

        //     $this->choices[$choice->id] = $choice;
        // }
    }

    function setIdentifier(string $identifier)
    {

        $this->identifier = $identifier;
    }


    // function __construct(
    //     int $pollId,
    //     array $choices = null,
    //     string $identifier = null,
    //     string $title = null,
    //     int $max_votes = null,
    //     string $max_datetime = null,
    //     string $datetime_opened = null,
    //     string $datetime_closed = null,
    //     int $duplicate_vote_check_method_id = null
    // ) {
    //     $this->pollID = $pollId;

    //     $this->choices = $choices;
    //     $this->identifier = $identifier;
    //     $this->title = $title;
    //     $this->max_votes = $max_votes;
    //     $this->max_datetime = $max_datetime;
    //     $this->datetime_opened = $datetime_opened;
    //     $this->datetime_closed = $datetime_closed;
    //     $this->duplicate_vote_check_method_id = $duplicate_vote_check_method_id;
    // }
}

// $poll = new Poll([
//     'title' => 'test addVote'
// ]);

// echo "\n Poll \n";
// print_r($poll);
