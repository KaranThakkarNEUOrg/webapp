#!/bin/bash

sudo groupadd csye6225
sudo useradd -g csye6225 -s /usr/sbin/nologin csye6225
sudo chown -R csye6225:csye6225 /opt/webapp/
sudo chown -R csye6225:csye6225 /tmp/webapp.service
sudo cp /tmp/webapp.service /etc/systemd/system/
sudo chmod 700 /opt/webapp/
sudo chmod 700 /etc/systemd/system/
echo "csye6225 ALL=(ALL:ALL) NOPASSWD: /bin/systemctl" | sudo EDITOR='tee -a' visudo
sudo systemctl daemon-reload
sudo systemctl start webapp
sudo systemctl enable webapp
