
# MJ-polls

A web application to host polls with the majority judgement voting method

- [Dependencies :](#dependencies)
    - [Dev-dependencies :](#dev-dependencies)
- [postgres config :](#postgres-config)
- [apache config :](#apache-config)
    - [For deployment in a subfolder](#for-deployment-in-a-subfolder)
    - [For deployment with a vhost](#for-deployment-with-a-vhost)
        - [.htaccess](#htaccess)
        - [index.php](#indexphp)
- [app local dependencies](#app-local-dependencies)


- [Running unit tests (./readme_tests.md))](./readme_tests.md)

## Dependencies :

```bash
(
    sudo apt update
    sudo apt install -y apache2 libapache2-mod-php postgresql
)
```

```bash
(
    cd ~/Downloads
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php -r "if (hash_file('sha384', 'composer-setup.php') === '906a84df04cea2aa72f40b5f787e49f22d4c2f19492ac310e8cba5b96ac8b64115ac402c8cd292b8a03482574915d1a8') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
    php composer-setup.php
    php -r "unlink('composer-setup.php');"
    sudo mv composer.phar /usr/local/bin/composer
)
```

### Dev-dependencies :

```bash
sudo apt install -y php-pgsql
```

<hr>

## postgres config :

```bash
sudo su - postgres
```

```bash
(
    createuser mjpolls
    psql -c "ALTER USER mjpolls WITH ENCRYPTED PASSWORD 'pass';"
)
``` 

```bash
(
    cd /home/ubuntu/gitRepos/mj-polls/v2/db

    psql -c "DROP DATABASE mjpollsdb;"
    psql -c "CREATE DATABASE mjpollsdb;"

    psql -f dbSchema.sql mjpollsdb
    psql -f dbInitFill.sql mjpollsdb
)
```
<hr>
<br>

## apache config :

```bash
sudo nano /etc/apache2/sites-available/mj-polls.conf
```

<hr>

### For deployment in a subfolder

```
Alias /sondage /home/ubuntu/gitRepos/mj-polls/v2
<Directory /home/ubuntu/gitRepos/mj-polls/v2>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

#### .htaccess

`RewriteBase /` becomes `RewriteBase /sondage`

#### index.php

`Route::run('/');` becomes `Route::run('/sondage');`

<hr>

### For deployment with a vhost

```bash
sudo mkdir /var/log/apache2/mj-polls
```

```
<VirtualHost *:80>
    DocumentRoot /home/ubuntu/gitRepos/mj-polls/v2

    ErrorLog ${APACHE_LOG_DIR}/mj-polls/error.log
    CustomLog ${APACHE_LOG_DIR}/mj-polls/access.log combined

    ErrorLogFormat "[%t] [%l] [pid %P] %F: %E: [client %a] %M"

    <Directory /home/ubuntu/gitRepos/mj-polls/v2>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

</VirtualHost>
```


<hr>
<hr>
<br>

```bash
(
sudo a2ensite mj-polls
sudo systemctl restart apache2
)
```

<hr>

## app local dependencies

```bash
(
    cd v2
    composer install --no-dev
)
```


