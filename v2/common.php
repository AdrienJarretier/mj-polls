<?php

class Common
{
    static $localesMsgs = [];

    static function log($data, bool $html = false, bool $return = false)
    {
        switch (gettype($data)) {
            case 'array':
                $out = print_r($data, true);
                break;
            default:
                $out = $data;
                break;
        }
        if ($html)
            $finalString = '<div style="white-space: pre-wrap;line-height: 8px;">'
                . '<br>'
                . preg_replace(
                    '/(?:<br \/>\n?)+/',
                    '<br><br>',
                    nl2br(
                        str_replace('  ', ' ', $out)
                    )
                ) . '<br>'
                . '</div>';
        else
            $finalString = $out;

        if ($return)
            return $finalString;
        else
            echo $finalString;
    }

    static function init()
    {
        foreach (['fr-FR'] as $locale) {

            self::$localesMsgs[$locale] = [];

            foreach (['client', 'db'] as $part) {

                $filename = self::joinPath('locales', $locale, $part . '.json');

                $fileContent = file_get_contents($filename);

                self::$localesMsgs[$locale][$part] = json_decode($fileContent, true);
            }
        }
    }

    static function randomIdentifier($length)
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        // $characters = 'AB';


        $out = '';

        for ($i = 0; $i < $length; ++$i) {
            $out .= $characters[random_int(0, strlen($characters) - 1)];
        }

        return $out;
    }

    static function joinPath(...$args)
    {

        // echo implode(' - ', $args).'<br>';

        return implode('/', $args);
    }
}

Common::init();
