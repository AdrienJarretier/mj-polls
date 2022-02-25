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
    self::$dbh = new Db(
      'mjpolls_unittests',
      'mjpolls',
      'pass',
      [
        'verbose' => true
      ]
    );
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

  /**
   * @testdox should ignore constraints if ignoreConstraints is true
   */
  public function testInsertPOllIgnoreConstraints(): void
  {
    // echo "testInsertPOllIgnoreConstraints\n";
    // $this->expect("Can't insert poll, constraint violated");

    self::$dbh->insertPoll(
      [
        'title' => 'testPoll invalid reason',
        'maxVotes' => null,
        'max_datetime' => '2021-07-01 00:00:00', // constraint violation, max date on insert can't be earleir than now
        'choices' => ['testChoice1'],
        'duplicateCheckMethod' => null,
      ],
      true
    );
  }
}
