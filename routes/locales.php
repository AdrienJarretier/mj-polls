<?php

/**
 * 
 * @param string $part the part of the app to load messages for (or the page)
 * e.g : "header", "home"
 * @param string $locale e.g "fr-FR"
 * @return array array containing messages
 */
self::get('/([a-z]+(?:-[a-z]+)*)/([a-z]{2})', function ($part, $locale) {

    // echo 'requested : ' . $part . ' - ' . $locale;

    $parts = explode('-', $part);

    // Common::dlog(Common::$localesMsgs);
    $localeMsgs = Common::$localesMsgs[$locale];

    foreach ($parts as $part) {
        $localeMsgs = $localeMsgs[$part];
    }

    // Common::log($localeMsgs);

    echo json_encode($localeMsgs);
});
