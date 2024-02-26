#!/bin/bash

sudo sh -c 'cat << EOF > /etc/systemd/system/webapp.service
[Unit]
Description=Node.js Application
After=network.target

[Service]
EnvironmentFile=/opt/webapp/.env
Type=simple
User=csye6225
Group=csye6225
WorkingDirectory=/opt/webapp/
ExecStart=/usr/bin/node /opt/webapp/index.js
Restart=on-failure
RestartSec=3
StandardOutput=append:/var/log/webapp_output.log
StandardError=append:/var/log/webapp_error.log

[Install]
WantedBy=multi-user.target
EOF'
