#!/bin/bash

cd /
sudo dnf install unzip -y
sudo unzip /tmp/webapp.zip -d /home/packer/webapp/
cd /home/packer/webapp/
sudo npm install
sudo touch .env
sudo echo "MYSQL_HOSTNAME=localhost" >>.env
sudo echo "MYSQL_PASSWORD=Karan@mysql001" >>.env
sudo echo "MYSQL_DATABASENAME=cloud_assignment02" >>.env
sudo echo "MYSQL_USERNAME=root" >>.env
sudo echo "SALT_ROUNDS=10" >>.env
sudo echo "PORT=8888" >>.env
