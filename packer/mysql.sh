#!/bin/bash

sudo dnf install mysql-server -y
sudo systemctl start mysqld.service
sudo systemctl enable mysqld
