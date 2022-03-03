<?php

class Common
{
    static $serverConfig;
    static $localesMsgs = [];

    static function init()
    {
        self::$serverConfig = json_decode(
            file_get_contents(
                self::joinPath(__DIR__, 'config.json')
            )
        );

        foreach (['fr-FR'] as $locale) {

            self::$localesMsgs[$locale] = [];

            foreach (['client', 'db'] as $part) {

                $filename = self::joinPath(__DIR__ . '/locales', $locale, $part . '.json');

                $fileContent = file_get_contents($filename);

                self::$localesMsgs[$locale][$part] = json_decode($fileContent, true);
            }
        }
    }

    static function log($data, bool $html = false, bool $return = false)
    {
        $type = gettype($data);
        // var_dump($type);
        switch ($type) {
            case 'array':
            case 'object':
                $out = print_r($data, true);
                break;
            default:
                $out = $data . PHP_EOL;
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

    static function error_log($data)
    {
        $stringToLog = self::log($data, false, true);
        error_log($stringToLog);
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
