<?php

class Common
{
    static $localesMsgs = [];

    static function log($data)
    {
        switch (gettype($data)) {
            case 'array':
                $out = print_r($data, true);
                break;
            default:
                $out = $data;
                break;
        }
        echo '<div style="white-space: pre-wrap;line-height: 8px;">' . PHP_EOL;
        // echo  nl2br(
        //     str_replace('  ', ' ', $out)
        // );
        echo '<br>' .
            preg_replace(
                '/(?:<br \/>\n?)+/',
                '<br>'.PHP_EOL,
                nl2br(
                    str_replace('  ', ' ', $out)
                )
            ) . '<br>' . PHP_EOL;
        echo '</div>' . PHP_EOL;
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
