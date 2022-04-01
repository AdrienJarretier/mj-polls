# Hosting instructions

You can host the application yourself, here are the instructions for a setup with Apache, php7.4 and Postgresql-14 on Linux : 

- [Dependencies](#dependencies)
    - [Dev-dependencies](#dev-dependencies)
- [postgres config](#postgres-config)
- [apache config](#apache-config)
    - [For deployment in a subfolder](#for-deployment-in-a-subfolder)
    - [For deployment with a vhost](#for-deployment-with-a-vhost)
        - [.htaccess](#htaccess)
        - [index.php](#indexphp)
- [app local dependencies](#app-local-dependencies)


- [Running unit tests (./readme_tests.md))](./readme_tests.md)

## Dependencies

If php7.4 isn't available in the official repository :
```bash
(
    sudo apt update
    sudo apt -y install software-properties-common
    sudo add-apt-repository ppa:ondrej/php
    sudo apt update
)
```

```bash
sudo apt update && \
sudo apt install -y postgresql-14 apache2 libapache2-mod-php7.4 php7.4-pgsql
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

### Dev-dependencies

phppgadmin to view database content while testing :
```bash
sudo apt install -y phppgadmin
```

<hr>

## postgres config

```bash
sudo su - postgres
```

```bash
databaseName="mjpollsdb" && \
dbusername="mjpolls"
```

```bash
(
    createuser $dbusername
    psql -c "ALTER USER $dbusername WITH ENCRYPTED PASSWORD 'pass';"
)
``` 

```bash
(
    cd /home/ubuntu/gitRepos/mj-polls/db && \

    psql -c "CREATE DATABASE $databaseName;" && \

    psql -c "
    ALTER DEFAULT PRIVILEGES GRANT SELECT ON TABLES TO $dbusername;
    ALTER DEFAULT PRIVILEGES GRANT INSERT ON TABLES TO $dbusername;
    ALTER DEFAULT PRIVILEGES GRANT UPDATE ON TABLES TO $dbusername;
    ALTER DEFAULT PRIVILEGES GRANT USAGE ON SEQUENCES TO $dbusername;
    " $databaseName && \

    psql -f dbSchema.sql $databaseName && \
    psql -f dbInitFill.sql $databaseName
)
```
<br>

**For Dev If changing db structure**
**/!\ DROP THE ENTIRE DATABASE /!\\**
```bash
psql -c "DROP DATABASE IF EXISTS $databaseName;"
```

<hr>

## apache config

```bash
sudo nano /etc/apache2/sites-available/mj-polls.conf
```

<hr>

### For deployment with a vhost

```bash
sudo mkdir /var/log/apache2/mj-polls
```

```
<VirtualHost *:80>
    DocumentRoot /home/ubuntu/gitRepos/mj-polls

    ErrorLog ${APACHE_LOG_DIR}/mj-polls/error.log
    CustomLog ${APACHE_LOG_DIR}/mj-polls/access.log combined

    ErrorLogFormat "[%t] [%l] [pid %P] %F: %E: [client %a] %M"

    <Directory /home/ubuntu/gitRepos/mj-polls>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

</VirtualHost>
```

<hr>

### For deployment in a subfolder

```
Alias /sondage /home/ubuntu/gitRepos/mj-polls
<Directory /home/ubuntu/gitRepos/mj-polls>
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
<hr>
<br>

```bash
(
sudo a2enmod rewrite
sudo a2ensite mj-polls
sudo systemctl restart apache2
)
```

<hr>

## app local dependencies

```bash
composer install --no-dev
```


