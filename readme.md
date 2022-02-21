# Raisonnance

Dependencies :

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

Dev-dependencies :

```bash
sudo apt install -y php-pgsql
```

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
    cd /home/ubuntu/gitRepos/mj-polls/db
    psql -f dbSchema.sql
    psql -f dbInitFill.sql
)
```

## apache config :

```bash
sudo nano /etc/apache2/sites-available/mj-polls.conf
```
```
Alias /sondage /home/ubuntu/gitRepos/mj-polls
<Directory /home/ubuntu/gitRepos/mj-polls>
    Options -Indexes +FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```

```bash
(
sudo a2ensite mj-polls
sudo systemctl restart apache2
)
```

## app local dependencies

```bash
(
    composer install
)
```