<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class DbTest extends TestCase
{

    public function (){

        // common.serverConfig.db.database = path.resolve(__dirname, 'test.db');
        common.serverConfig.db.database = ':memory:';
    
        if (common.serverConfig.db.database != ':memory:') {
          try {
            fs.rmSync(common.serverConfig.db.database);
          } finally { }
        }
    
        require('../db/createDb.js');
    
    }

    // public function testCanBeCreatedFromValidEmailAddress(): void
    // {
    //     $this->assertInstanceOf(
    //         Email::class,
    //         Email::fromString('user@example.com')
    //     );
    // }

    // public function testCannotBeCreatedFromInvalidEmailAddress(): void
    // {
    //     $this->expectException(InvalidArgumentException::class);

    //     Email::fromString('invalid');
    // }

    // public function testCanBeUsedAsString(): void
    // {
    //     $this->assertEquals(
    //         'user@example.com',
    //         Email::fromString('user@example.com')
    //     );
    // }
}
