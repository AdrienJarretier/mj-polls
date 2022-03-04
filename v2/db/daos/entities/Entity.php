<?php

class Entity
{
    /**
     * @param array $properties :
     * [
     *   'colName' => value,
     *   ...
     * ]
     */
    function __construct(array $properties = [])
    {
        foreach ($properties as $col => $value) {
            if (!property_exists('Poll', $col))
                throw new Exception('wrong col name : ' . $col);

            $this->$col = $value;
        }        
    }
}