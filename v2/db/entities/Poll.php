<?php

class Poll
{

    public $choices = [];

    function addChoices(array $choices)
    {

        foreach ($choices as $choice) {

            $this->choices[$choice->id] = $choice;
        }
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
