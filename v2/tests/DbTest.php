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
      'title' => 'test addVote',
      'choices' => ['testChoice1', 'testChoice2']
    ]);

    $insertedId = self::$db->insertPoll($poll);

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
   * @depends testInsert
   */
  public function testAddVote($pollId)
  {
    $poll = self::$db->getPoll($pollId);
    $vote = [];

    foreach ($poll->choices as $choice) {
      $vote[$choice->id] = 1;
    }

    $this->assertTrue(self::$db->addVote($pollId, $vote));
  }


  /**
   * @testdox Throws if number of votes is different than number of choices
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
   * @testdox Throws if choice is not a part of poll
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

    $fakeId = $choices[0]->id + count($choices);

    $this->expectExceptionMessage('choice ' . $fakeId . ' does not belong to poll ' . $pollId);

    try {

      // poll_choice_id : grade_id , ... 
      $vote = [];
      for ($i = 0; $i < count($choices); ++$i)
        $vote[$fakeId + $i] = 1;

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
          'max_datetime' => null,
          'choices' => ['testChoice1']
        ]
      )

    );

    $pollId2 = self::$db->insertPoll(
      new Poll(
        [
          'title' => 'test isClosed, date_closed is null, max_datetime not expired',
          'max_voters' => 1,
          'max_datetime' => '2100-01-01 00:00:00',
          'choices' => ['testChoice1']
        ]
      )
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
        'max_datetime' => null,
        'choices' => ['testChoice1']
      ]
    );
    $pollId = self::$db->insertPoll(
      $poll
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
        'max_datetime' => date('c', time() - 3600),
        'choices' => ['testChoice1']
      ]
    );
    $pollId = self::$db->insertPoll(
      $poll
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

  /**
   * @depends testInsert
   */
  function testGetPollFromIdentifier($pollId)
  {
    $identifier = '00000000';

    $expected = new Poll(
      [
        'identifier' => $identifier,
        'title' => 'title of poll ' . $identifier
      ]
    );

    $poll = self::$db->getPollFromIdentifier($identifier);

    $this->assertInstanceOf('Poll', $poll);
    $this->assertEquals($identifier, $poll->identifier);
    $this->assertEquals($expected->title, $poll->title);



    // $expected = self::$db->getPoll($pollId);

    // $poll = self::$db->getPollFromIdentifier($expected->identifier);

    // $this->assertInstanceOf('Poll', $poll);
    // $this->assertEquals($expected->id, $poll->id);
    // $this->assertEquals($expected->title, $poll->title);
    // $this->assertNull($poll->max_voters);
    // $this->assertNull($poll->max_datetime);
  }
}
