#!/bin/bash

cd /
sudo dnf install unzip -y
unzip cd /tmp/packer/webapp.zip -d cd /home/packer/webapp/
cd home/packer/webapp/
npm install
touch .env
echo "MYSQL_HOSTNAME=localhost" >>.env
echo "MYSQL_PASSWORD=Karan@mysql001" >>.env
echo "MYSQL_DATABASENAME=cloud_assignment02" >>.env
echo "MYSQL_USERNAME=root" >>.env
echo "SALT_ROUNDS=10" >>.env
echo "PORT=8888" >>.env
