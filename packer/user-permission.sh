#!/bin/bash

sudo groupadd csye6225
sudo useradd -g csye6225 -s /usr/sbin/nologin csye6225
sudo chown -R csye6225:csye6225 /opt/webapp/
sudo cp /tmp/webapp.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
