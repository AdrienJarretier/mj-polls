<?php

function randomIdentifier($length)
{
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    // $characters = 'AB';


    $out = '';

    for ($i = 0; $i < $length; ++$i) {
        $out .= $characters[random_int(0, strlen($characters) - 1)];
    }

    return $out;
}
