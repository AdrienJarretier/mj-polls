<?php

class Poll
{

    public $title;
    public $max_voters = null;
    public $max_datetime = null;

    function __construct(array $properties = [])
    {
        foreach ($properties as $col => $value) {
            if (!property_exists('Poll', $col))
                throw new Exception('wrong col name ' . $col);

            $this->$col = $value;
        }
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
