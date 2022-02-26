# Unit tests

```bash
sudo su - postgres
```

```bash
(
    cd /home/ubuntu/gitRepos/mj-polls/v2/db

    psql -c "DROP DATABASE mjpolls_unittests;"
    psql -c "CREATE DATABASE mjpolls_unittests;"
    psql -c "ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO mjpolls;" mjpolls_unittests

    psql -f dbSchema.sql mjpolls_unittests
    psql -f dbInitFill.sql mjpolls_unittests
)
```

```bash
./vendor/bin/phpunit tests --testdox
```