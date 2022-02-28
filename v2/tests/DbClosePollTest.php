<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once 'db/Db.php';

final class DbClosePollTest extends TestCase
{
    private static Db $db;
    public static function setUpBeforeClass(): void
    {
        // echo "set up\n";
        self::$db = new Db('mjpolls_unittests');
    }

    function testClosePollFailsIfReasonInvalid()
    {
        $pollId = self::$db->insertPoll(
            new Poll([
                'title' => 'testPoll close with invalid reason'
            ]),
            ['testChoice1']
        );

        $possibleReasons = [1, 2];
        $this->expectExceptionMessage('arg : reason,  must be an integer with value in ' . implode(',', $possibleReasons));
        self::$db->closePoll($pollId, 3);
    }
    /**
     * @testdox should throw an error if reason is 1 and max_voters is null
     */
    function testClosePollFailsIfMaxVotersNull()
    {
        $pollId = self::$db->insertPoll(
            new Poll([
                'title' => 'testPoll close with invalid reason'
            ]),
            ['testChoice1']
        );

        $this->expectExceptionMessage('Can\'t close poll, max_voters is NULL');
        self::$db->closePoll($pollId, 1);
    }
    /**
     * @testdox should throw an error if reason is 2 and max_datetime is null
     */
    function testClosePollFailsIfMaxDatetimeNull()
    {
        $pollId = self::$db->insertPoll(
            new Poll([
                'title' => 'testPoll close with invalid reason'
            ]),
            ['testChoice1']
        );

        $this->expectExceptionMessage('Can\'t close poll, max_datetime is NULL');
        self::$db->closePoll($pollId, 2);
    }
}
