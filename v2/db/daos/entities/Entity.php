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
        // Common::log('Entity Constructor');
        foreach ($properties as $col => $value) {
            if (!property_exists(get_class($this), $col))
                throw new Exception('wrong col name : ' . $col);

            $this->$col = $value;
        }
    }
}
