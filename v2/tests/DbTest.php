<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;


// ini_set('display_errors', "1");
// ini_set('display_startup_errors', "1");
// error_reporting(E_ALL);

require_once 'db/db.php';


final class DbTest extends TestCase
{
  protected function setUp(): void
  {
    $this->db = new Db('mjpolls', 'pass', 'mjpolls_unittests');
  }

  /**
   * @testdox should not ignore constraints if ignoreConstraints is not given
   */
  public function testCanInsertPoll(): void
  {
    $this->expectExceptionMessage("Can't insert poll, constraint violated");

    $this->db->insertPoll(
      [
        'title' => 'testPoll invalid reason',
        'maxVotes' => null,
        'max_datetime' => '2021-07-01 00=>00=>00', // constraint violation, max date on insert can't be earleir than now
        'choices' => ['testChoice1'],
        'duplicateCheckMethod' => null
      ]
    );
  }
}
