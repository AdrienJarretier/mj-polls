<?php

function handleCreatePoll($viewName)
{
    return function () use ($viewName) {
        include("views/$viewName.php");
    };
}

self::add('/', handleCreatePoll('poll_display_create'));

self::add('/createPoll', handleCreatePoll('poll_display_create'));
