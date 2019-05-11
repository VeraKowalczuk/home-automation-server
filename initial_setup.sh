#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

apt-get update
apt-get upgrade -y
apt-get install -y apache2 python3 python3-pip tmux
pip3 install -r requirements.txt
rm -r /var/www/html/*
cp frontend/* /var/www/html/
cp local-config-default.yml local-config.yml
chmod 777 local-config.yml
/bin/bash start_server.sh