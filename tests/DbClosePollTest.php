<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../db/Db.php';
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
                'title' => 'testPoll close with invalid reason',
                'choices' => ['testChoice1']
            ])
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
                'title' => 'testPoll close with invalid reason',
                'choices' => ['testChoice1']
            ])
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
                'title' => 'testPoll close with invalid reason',
                'choices' => ['testChoice1']
            ])
        );
        $this->expectExceptionMessage('Can\'t close poll, max_datetime is NULL');
        self::$db->closePoll($pollId, 2);
    }


    /**
     * @testdox if reason is 1 and max_voters is not null, should set datetime_closed to CURRENT_TIMESTAMP
     */
    function testClosePollWithReasonMaxVoters()
    {
        $pollId = self::$db->insertPoll(
            new Poll([
                'title' => 'testPoll valid reasons and opened poll',
                'max_voters' => 1,
                'max_datetime' => '2100-01-01 00:00:00',
                'choices' => ['testChoice1']
            ])
        );
        $dateBefore = microtime(true);
        self::$db->closePoll($pollId, 1);
        $dateAfter = microtime(true);
        $poll = self::$db->getPoll($pollId);
        $dateClosed = $poll->datetime_closed_microtime;
        $this->assertGreaterThanOrEqual($dateBefore, $dateClosed);
        $this->assertLessThanOrEqual($dateAfter, $dateClosed);

        return $poll;
    }


    /**
     * @testdox if reason is 2 and max_datetime is not null, should set datetime_closed to max_datetime
     */
    function testClosePollWithReasonMaxDatetimeExpired()
    {
        $max_datetimeString = '2100-01-01 00:00:00+01';
        $max_datetime = (new DateTime($max_datetimeString))->format('U.u');
        $pollId = self::$db->insertPoll(
            new Poll([
                'title' => 'testPoll valid reasons and opened poll',
                'max_voters' => 1,
                'max_datetime' => $max_datetimeString,
                'choices' => ['testChoice1']
            ])
        );
        self::$db->closePoll($pollId, 2);
        $poll = self::$db->getPoll($pollId);
        // print_r($poll);
        $dateClosed = $poll->datetime_closed_microtime;
        $this->assertEquals($max_datetime, $dateClosed);
    }


    /**
     * @testdox should throw an error if poll is already closed
     * @depends testClosePollWithReasonMaxVoters
     */
    function testClosePollReason1readyClosed($poll)
    {
        $this->expectExceptionMessage('poll is already closed');
        self::$db->closePoll($poll->id, 1);
    }


    /**
     * @testdox should throw an error if poll is already closed
     * @depends testClosePollWithReasonMaxVoters
     */
    function testClosePollReason2AlreadyClosed($poll)
    {
        $this->expectExceptionMessage('poll is already closed');
        self::$db->closePoll($poll->id, 2);
    }
}
