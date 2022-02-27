<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;


// ini_set('display_errors', "1");
// ini_set('display_startup_errors', "1");
// error_reporting(E_ALL);

require_once 'db/Db.php';

require_once 'db/entities/Poll.php';


final class DbTest extends TestCase
{
  private static $db;

  public static function setUpBeforeClass(): void
  {
    // echo "set up\n";
    self::$db = new Db('mjpolls_unittests');
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
    $poll = new Poll([
      'title' => 'test addVote'
    ]);
    $choices = ['testChoice1'];

    $insertedId = self::$db->insertPoll($poll, $choices);

    $this->assertIsInt($insertedId);

    return $insertedId;
  }



  /**
   * @testdox should not ignore constraints if ignoreConstraints is not given
   */
  public function testInsertPOllFollowsConstraints(): void
  {
    // echo "testInsertPOllFollowsConstraints\n";
    $this->expectExceptionMessage("Can't insert poll, constraint violated");

    self::$db->insertPoll(
      new Poll(
        [
          'title' => 'testPoll invalid reason',
          'maxVotes' => null,
          'max_datetime' => '2021-07-01 00:00:00', // constraint violation, max date on insert can't be earleir than now
          'duplicateCheckMethod' => null
        ]
      ),
      ['testChoice1']
    );
  }



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


  // /**
  //  * @testdox Throws error if choice is not a part of poll
  //  * @depends testInsert
  //  */
  // public function testAddVoteChoiceNotInPoll($pollId)
  // {
  //   $poll = self::$dbh->getPoll($pollId);

  //   // echo PHP_EOL . 'testAddVoteChoiceNotInPoll' . PHP_EOL;
  //   // echo PHP_EOL . 'poll' . PHP_EOL;
  //   // print_r($poll);

  //   $choices = $poll['choices'];


  //   echo PHP_EOL . 'choices' . PHP_EOL;
  //   print_r($choices);

  //   $fakeId = $choices[0]['id'] + 1;

  //   $this->expectExceptionMessage('choice ' . $fakeId . ' does not belong to poll ' . $pollId);


  //   // poll_choice_id : grade_id , ... 
  //   $vote = [];
  //   $vote[$fakeId] = 1;

  //   self::$dbh->addVote($pollId, $vote);
  // }
}
