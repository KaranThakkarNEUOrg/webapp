packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.0.0"
    }
  }
}

variable "credentials" {}
variable "project_id" {}
variable "MYSQL_PASSWORD" {}

source "googlecompute" "autogenerated_1" {
  credentials_file  = var.credentials
  image_description = "A custom centos8 image with MySQL installed"
  image_labels = {
    os = "centos8"
  }
  image_name   = "csye-centos-8-1"
  network      = "default"
  project_id   = var.project_id
  source_image = "centos-stream-8-v20240110"
  ssh_username = "packer"
  zone         = "us-east1-b"
}

build {
  sources = ["source.googlecompute.autogenerated_1"]

  provisioner "shell" {
    inline = [
      "sudo setenforce 0"
    ]
  }

  // provisioner "file" {
  //   source      = "./mysql.sh"
  //   destination = "/tmp/mysql.sh"
  // }

  // provisioner "file" {
  //   source      = "./nodejs.sh"
  //   destination = "/tmp/nodejs.sh"
  // }

  // provisioner "file" {
  //   source      = "./permissions.sh"
  //   destination = "/tmp/permissions.sh"
  // }

  // provisioner "file" {
  //   source      = "./webapp-installation.sh"
  //   destination = "/tmp/webapp-installation.sh"
  // }

  // provisioner "file" {
  //   source      = "./user-permission.sh"
  //   destination = "/tmp/user-permission.sh"
  // }

  provisioner "file" {
    source      = "/home/runner/work/webapp/webapp/webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = "./webapp.service"
    destination = "/opt/webapp/webapp.service"
  }

  provisioner "shell" {
    scripts = ["./mysql.sh", "./nodejs.sh", "./permissions.sh", "./webapp-installation.sh", "./user-permission.sh"]
    environment_vars = [
      "MYSQL_PASSWORD=${var.MYSQL_PASSWORD}"
    ]
  }

}
