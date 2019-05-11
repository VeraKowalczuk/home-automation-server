#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

apt-get update
apt-get upgrade -y
apt-get install -y apache2 python3 python3-pip
pip3 install -r requirements.txt
rm -r /var/www/html/*
cp frontend/* /var/www/html/
cp local-config-default.yml local-config.yml
chmod 666 local-config.yml
CURRENT_PATH=$(dirname "$(readlink -f "$0")")
MASTER_PYTHON_PATH="$CURRENT_PATH/backend/master_server.py"
SLAVE_PYTHON_PATH="$CURRENT_PATH/backend/slave_server.py"
sed -i "s@{#PYTHON_PATH#}@$MASTER_PYTHON_PATH@g" home-automation-server-master.service
sed -i "s@{#PYTHON_PATH#}@$SLAVE_PYTHON_PATH@g" home-automation-server-slave.service
cp home-automation-server-master.service /etc/systemd/system/
cp home-automation-server-slave.service /etc/systemd/system/
systemctl enable home-automation-server-master
systemctl enable home-automation-server-slave
systemctl start home-automation-server-master
systemctl start home-automation-server-slave