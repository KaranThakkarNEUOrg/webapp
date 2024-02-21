# Project setup Commands

    npm i

# Run Project

    Dev command: npm run dev
    Prod command: npm run start
    Test command: npm run test

# Sql start/stop commmand

    run cmd as administrator
    net start MySQL80
    net stop MySQL80

# Swagger Documentation

    http://localhost:8888/api-docs/csye6225-webapp

# cmd command to test API

To test database health

```
curl -i -X GET http://localhost:8888/healtz
```

Test Post API

```
curl -i -X POST \
-H "Content-Type:application/json" \
-d '{"first_name":"Karan","last_name":"Thakkar","password": "Karan@api123","username":"karanthakkar@northeastern.edu"}' \
http://localhost:8888/v1/user/
```

Test GET API

```
curl -i -u karanthakkar@northeastern.edu:Karan@api123 -X GET http://localhost:8888/v1/user/self
```

Test PUT API

```
curl -i -X PUT \
  -u karanthakkar@northeastern.edu:Karan@api123 \
  -H "Content-Type: application/json" \
  -d '{"first_name":"KT", "last_name":"karan","password":"Karan@api123"}' \
  http://localhost:8888/v1/user/self
```

## Digital Ocean setup commands

Installing MYSQL [reference](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-8)

```
sudo dnf install mysql-server
sudo systemctl start mysqld.service
sudo systemctl status mysqld
sudo systemctl enable mysqld
```

> [!NOTE]
> The systemctl command manages both system and service configurations, enabling administrators to manage the OS and control the status of services

Securing MYSQL

```
sudo mysql_secure_installation
```

Testing MySQL

```
mysqladmin -u root -p version
mysql -u root -p
```

Install unzip package

```
sudo yum install unzip
```

Install Node.js

```
dnf module install nodejs:18/common
```

# ssh connection command

```
ssh -i ~/.ssh/digital_ocean_ssh root@192.34.56.82
```

# scp file transfer command

```
scp -i ~/.ssh/digital_ocean_ssh D:\Desktop\CloudAssignments\Assignment02\assignment02.zip root@192.34.56.82:/home
```

# unzip file inside home directory

```
unzip <filename> -d <destination path>
```

# packer installation [reference](https://www.packer.io/downloads)

# Commands to run packer

Initialize packer file

```
cd packer
packer init .\setup.pkr.hcl
```

Format packer file

```
cd packer
packer fmt .\setup.pkr.hcl
```

Validate packer syntax

```
cd packer
packer validate -var "project_id=<project_id>" -var "credentials=<json_file_path>" .\setup.pkr.hcl
```
