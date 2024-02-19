packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.0.0"
    }
  }
}

source "googlecompute" "autogenerated_1" {
  credentials_file  = "../compute-engine-admin-account.json"
  image_description = "A custom centos8 image with MySQL installed"
  image_labels = {
    os = "centos8"
  }
  image_name   = "csye-centos-8"
  network      = "default"
  project_id   = "csye6225-dev-414623"
  source_image = "centos-stream-8-v20240110"
  ssh_username = "csye-dev"
  zone         = "us-east1-b"
}

build {
  sources = ["source.googlecompute.autogenerated_1"]

  provisioner "file" {
    source      = "./mysql.sh"
    destination = "/tmp/mysql.sh"
  }

  provisioner "file" {
    source      = "./nodejs.sh"
    destination = "/tmp/nodejs.sh"
  }

  provisioner "shell" {
    inline = [
      "sudo setenforce 0",
      "sudo chmod +x /tmp/mysql.sh",
      "sudo chmod +x /tmp/nodejs.sh"
    ]
  }

  provisioner "shell" {
    script = "./mysql.sh"
  }

  provisioner "shell" {
    script = "./nodejs.sh"
  }

}
