<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;


// ini_set('display_errors', "1");
// ini_set('display_startup_errors', "1");
// error_reporting(E_ALL);

require_once 'db/Db.php';

require_once 'db/daos/entities/Poll.php';


final class DbTest extends TestCase
{
  private static Db $db;

  public static function setUpBeforeClass(): void
  {
    // echo "set up\n";
    self::$db = new Db('mjpolls_unittests');
  }



  public function testInsert()
  {
    $poll = new Poll([
      'title' => 'test addVote'
    ]);
    $choices = ['testChoice1'];

    $insertedId = self::$db->insertPoll($poll, $choices);

    $this->assertIsInt($insertedId);

    return $insertedId;
  }

  // /**
  //  * @testdox should ignore constraints if ignoreConstraints is true
  //  */
  // public function testInsertPOllIgnoreConstraints(): void
  // {
  //   // echo "testInsertPOllIgnoreConstraints\n";
  //   // $this->expect("Can't insert poll, constraint violated");

  //   self::$dbh->insertPoll(
  //     [
  //       'title' => 'testPoll invalid reason',
  //       'maxVotes' => null,
  //       'max_datetime' => '2021-07-01 00:00:00', // constraint violation, max date on insert can't be earleir than now
  //       'choices' => ['testChoice1'],
  //       'duplicateCheckMethod' => null,
  //     ],
  //     true
  //   );
  // }



  // /**
  //  * @testdox should not ignore constraints if ignoreConstraints is not given
  //  */
  // public function testInsertPOllFollowsConstraints(): void
  // {
  //   // echo "testInsertPOllFollowsConstraints\n";
  //   $this->expectExceptionMessage("Can't insert poll, constraint violated");

  //   self::$db->insertPoll(
  //     new Poll(
  //       [
  //         'title' => 'testPoll invalid reason',
  //         'maxVotes' => null,
  //         'max_datetime' => '2021-07-01 00:00:00', // constraint violation, max date on insert can't be earleir than now
  //         'duplicateCheckMethod' => null
  //       ]
  //     ),
  //     ['testChoice1']
  //   );
  // }



  /**
   * @testdox Throws error if number of votes is different than number of choices
   * @depends testInsert
   */
  public function testAddVoteWrongNbOfChoices($pollId)
  {
    $this->expectExceptionMessage('number of votes does not match number of choices in ' . $pollId);

    // echo PHP_EOL . 'testAddVoteWrongNbOfChoices' . PHP_EOL;
    // echo PHP_EOL . 'poll' . PHP_EOL;
    // print_r($poll);

    try {
      $poll = self::$db->getPoll($pollId);

      // poll_choice_id : grade_id , ... 
      $vote = [];

      for ($i = 0; $i < count($poll->choices) + 1; ++$i) {
        $vote[$i] = 1;
      }

      self::$db->addVote($pollId, $vote);
    } catch (Exception $e) {

      // echo $e;
      throw $e;
    }
  }


  /**
   * @testdox Throws error if choice is not a part of poll
   * @depends testInsert
   */
  public function testAddVoteChoiceNotInPoll($pollId)
  {
    $poll = self::$db->getPoll($pollId);

    // echo PHP_EOL . 'testAddVoteChoiceNotInPoll' . PHP_EOL;
    // echo PHP_EOL . 'poll' . PHP_EOL;
    // print_r($poll);

    $choices = $poll->choices;

    // echo PHP_EOL . 'choices' . PHP_EOL;
    // print_r($choices);

    $fakeId = $choices[0]->id + 1;

    $this->expectExceptionMessage('choice ' . $fakeId . ' does not belong to poll ' . $pollId);

    try {

      // poll_choice_id : grade_id , ... 
      $vote = [];
      $vote[$fakeId] = 1;

      self::$db->addVote($pollId, $vote);
    } catch (Exception $e) {

      // echo $e;
      throw $e;
    }
  }


  /**
   * @testdox should return false if date_closed is null
   */
  public function testIsClosedFalseIfDateClosedNull()
  {

    $pollId = self::$db->insertPoll(
      new Poll(
        [
          'title' => 'test isClosed, date_closed is null',
          'max_voters' => 1,
          'max_datetime' => null
        ]
      ),
      ['testChoice1']
    );

    $pollId2 = self::$db->insertPoll(
      new Poll(
        [
          'title' => 'test isClosed, date_closed is null, max_datetime not expired',
          'max_voters' => 1,
          'max_datetime' => '2100-01-01 00:00:00'
        ]
      ),
      ['testChoice1']
    );

    $this->assertFalse(self::$db->isClosed($pollId));
    $this->assertFalse(self::$db->isClosed($pollId2));
  }



  /**
   * @testdox should return true if date_closed is not null
   */
  function testIsClosedTrueIdDateClosedNotNull()
  {
    $poll = new Poll(
      [
        'title' => 'test isClosed, date_closed is not null',
        'max_voters' => 1,
        'max_datetime' => null
      ]
    );
    $pollId = self::$db->insertPoll(
      $poll,
      ['testChoice1']
    );
    self::$db->closePoll($pollId, 1);
    $this->assertTrue(self::$db->isClosed($pollId));
  }


  /**
   * @testdox should return true if max_datetime is expired
   */
  function testIsClosedTrueIfMaxDateExpired()
  {
    $poll = new Poll(
      [
        'title' => 'test isClosed, max_datetime is expired',
        'max_voters' => 1,
        'max_datetime' => date('c', time() - 3600)
      ]
    );
    $pollId = self::$db->insertPoll(
      $poll,
      ['testChoice1']
    );

    $this->assertTrue(self::$db->isClosed($pollId));
  }

  function testGetGrades()
  {
    $grades = self::$db->getGrades();

    $grade = new stdClass();
    $grade->id = 6;
    $grade->value = "To Reject";
    $grade->order = 0;

    $this->assertEquals($grade, $grades[0]);
  }

  function testGetPollFromIdentifier()
  {
    $expected = new Poll(
      [
        'identifier' => '00000000',
        'title' => 'title of poll 00000000',
        'max_voters' => null,
        'max_datetime' => null,
      ]
    );

    $poll = self::$db->dao->getPollFromIdentifier('00000000');

    $this->assertInstanceOf('Poll', $poll);
    $this->assertEquals('00000000', $poll->identifier);
    $this->assertEquals('title of poll 00000000', $poll->title);
    $this->assertNull($poll->max_voters);
    $this->assertNull($poll->max_datetime);
  }
}
