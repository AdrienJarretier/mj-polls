<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertTrue;

require_once __DIR__ . '/../common.php';

final class CommonTest extends TestCase
{
    function testLogHtml()
    {
        $data = [1];
        assertEquals(
            '<div style="white-space: pre-wrap;line-height: 8px;"><br>Array<br><br>(<br><br>  [0] => 1<br><br>)<br><br><br></div>',
            Common::log($data, true, true)
        );
    }

    function testLogArrayTerminal()
    {
        $data = [1];
        assertEquals(
            'Array
(
    [0] => 1
)' . PHP_EOL,
            Common::log($data, false, true)
        );
    }

    function testLogStringTerminal()
    {
        $data = 'string to output';
        assertEquals(
            'string to output' . PHP_EOL,
            Common::log($data, false, true)
        );
    }
}
