#!/bin/bash

cd /
sudo dnf install unzip -y
sudo unzip /tmp/packer/webapp.zip -d /home/packer/webapp/
cd home/packer/webapp/
sudo npm install
sudo touch .env
echo "MYSQL_HOSTNAME=localhost" >>.env
echo "MYSQL_PASSWORD=Karan@mysql001" >>.env
echo "MYSQL_DATABASENAME=cloud_assignment02" >>.env
echo "MYSQL_USERNAME=root" >>.env
echo "SALT_ROUNDS=10" >>.env
echo "PORT=8888" >>.env
