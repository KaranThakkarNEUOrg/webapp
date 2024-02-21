#!/bin/bash

cd /
sudo dnf install unzip -y
sudo unzip /tmp/webapp.zip -d /home/packer/webapp/
cd /home/packer/webapp/
sudo npm install
sudo touch .env
echo "MYSQL_HOSTNAME=localhost" | sudo tee -a .env
echo "MYSQL_PASSWORD=Karan@mysql001" | sudo tee -a .env
echo "MYSQL_DATABASENAME=cloud_assignment02" | sudo tee -a .env
echo "MYSQL_USERNAME=root" | sudo tee -a .env
echo "SALT_ROUNDS=10" | sudo tee -a .env
echo "PORT=8888" | sudo tee -a .env
