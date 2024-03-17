#!/bin/bash

curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

content="logging:
  receivers:
    my-app-receiver:
      type: files
      include_paths:
        - /var/log/webapp/app.log
      record_log_file_path: true
  processors:
    my-app-processor:
      type: parse_json
      time_key: time
      time_format: "%Y-%m-%dT%H:%M:%S.%L%Z"
  service:
    pipelines:
      default_pipeline:
        receivers: [my-app-receiver]
        processors: [my-app-processor]
"
echo "$content" | sudo tee -a /etc/google-cloud-ops-agent/config.yaml
sudo systemctl restart google-cloud-ops-agent
