<?php

require_once 'Entity.php';

class PollChoice extends Entity
{
    public int $id;
    public string $name;
    public array $votes;
}
