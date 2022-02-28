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
    protected function setUp(): void
    {
        $this->pollId = self::$db->insertPoll(
            new Poll([
                'title' => 'testPoll close with invalid reason'
            ]),
            ['testChoice1']
        );
    }
    function testClosePollFailsIfReasonInvalid()
    {
        $possibleReasons = [1, 2];
        $this->expectExceptionMessage('arg : reason,  must be an integer with value in ' . implode(',', $possibleReasons));
        self::$db->closePoll($this->pollId, 3);
    }
    /**
     * @testdox should throw an error if reason is 1 and max_voters is null
     */
    function testClosePollFailsIfMaxVotersNull()
    {
        $this->expectExceptionMessage('Can\'t close poll, max_voters is NULL');
        self::$db->closePoll($this->pollId, 1);
    }
    /**
     * @testdox should throw an error if reason is 2 and max_datetime is null
     */
    function testClosePollFailsIfMaxDatetimeNull()
    {
        $this->expectExceptionMessage('Can\'t close poll, max_datetime is NULL');
        self::$db->closePoll($this->pollId, 2);
    }
}
