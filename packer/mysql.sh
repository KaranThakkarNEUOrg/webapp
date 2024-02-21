#!/bin/bash

sudo dnf install mysql-server -y
sudo systemctl start mysqld.service
sudo systemctl enable mysqld
echo "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_PASSWORD'; FLUSH PRIVILEGES;" | sudo mysql
echo "CREATE DATABASE cloud_assignment02;" | sudo mysql
