<?php
require_once __DIR__ . '/Entity.php';
class Grade extends Entity
{
    public int $id;
    public int $value;
    public int $order;

    function __construct(array $properties = [])
    {
        parent::__construct($properties);
        // Common::log('Grade Constructor');
    }
}
