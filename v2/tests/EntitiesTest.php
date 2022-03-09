<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once __DIR__.'/../db/daos/entities/Poll.php';

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

    function testGrade()
    {
        $g = new Grade([
            'id' => 1
        ]);

        $this->assertEquals('Excellent', $g->value);
        $this->assertEquals(50, $g->order);
    }
}
