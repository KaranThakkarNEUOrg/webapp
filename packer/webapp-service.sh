#!/bin/bash

sudo sh -c 'cat << EOF > /etc/systemd/system/webapp.service
[Unit]
Description=Node.js Application
After=network.target

[Service]
Type=simple
User=csye6225
Group=csye6225
Environment=MYSQL_HOSTNAME='$MYSQL_HOSTNAME'
Environment=MYSQL_PASSWORD='$MYSQL_PASSWORD'
Environment=MYSQL_DATABASENAME='$MYSQL_DATABASENAME'
Environment=MYSQL_USERNAME='$MYSQL_USERNAME'
Environment=SALT_ROUNDS='$SALT_ROUNDS'
Environment=PORT='$PORT'
WorkingDirectory=/opt/webapp/
ExecStart=/usr/bin/node /opt/webapp/index.js
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF'
