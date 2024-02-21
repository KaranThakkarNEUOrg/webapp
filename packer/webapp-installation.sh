#!/bin/bash

cd /
sudo dnf install unzip -y
sudo unzip /tmp/webapp.zip -d /opt/webapp/
cd /opt/webapp/
sudo npm install
