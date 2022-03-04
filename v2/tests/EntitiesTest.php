<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once 'db/daos/entities/Poll.php';

final class EntitiesTest extends TestCase
{

    /**
     * @testdox throws exception if properties contains undeclared attribute in class Poll
     */
    function testPoll()
    {
        $wrongColName = 'wrongCol';
        $this->expectExceptionMessage('wrong col name : ' . $wrongColName);
        new Poll([$wrongColName => 'value']);
    }
}
