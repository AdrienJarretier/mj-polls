<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;


// ini_set('display_errors', "1");
// ini_set('display_startup_errors', "1");
// error_reporting(E_ALL);

require_once 'db/Db.php';


final class DbTest extends TestCase
{
  private static $dbh;

  public static function setUpBeforeClass(): void
  {
    // echo "set up\n";
    self::$dbh = new Db('mjpolls_unittests');
  }

  /**
   * @testdox should not ignore constraints if ignoreConstraints is not given
   */
  public function testInsertPOllFollowsConstraints(): void
  {
    // echo "testInsertPOllFollowsConstraints\n";
    $this->expectExceptionMessage("Can't insert poll, constraint violated");

    self::$dbh->insertPoll(
      [
        'title' => 'testPoll invalid reason',
        'maxVotes' => null,
        'max_datetime' => '2021-07-01 00:00:00', // constraint violation, max date on insert can't be earleir than now
        'choices' => ['testChoice1'],
        'duplicateCheckMethod' => null
      ]
    );
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

  public function testInsert()
  {
    $insertedId = self::$dbh->insertPoll([
      'title' => 'test addVote',
      'maxVotes' => null,
      'max_datetime' => null,
      'choices' => 'testChoice1',
      'duplicateCheckMethod' => null
    ]);

    $this->assertIsInt($insertedId);
    return $insertedId;
  }

  /**
   * @testdox Throws error if number of votes is different than number of choices
   * @depends testInsert
   */
  public function testAddVoteWrongNbOfChoices($pollId)
  {
    $this->expectExceptionMessage('number of votes does not match number of choices in ' . $pollId);

    $poll = self::$dbh->getPoll($pollId);

    // print_r($poll);

    // poll_choice_id : grade_id , ... 
    $vote = [];

    for ($i = 0; $i < $poll->choices->length + 1; ++$i) {
      $vote[$i] = 1;
    }

    self::$dbh->addVote($pollId, $vote);
  }
}
