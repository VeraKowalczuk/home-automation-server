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
chmod 666 local-config.yml
CURRENT_PATH=$(dirname "$(readlink -f "$0")")
SCRIPT_PATH="$CURRENT_PATH/start_server.sh"
sed -i "s@{#SCRIPT_PATH#}@$SCRIPT_PATH@g" home-automation-server.service
cp home-automation-server.service /etc/systemd/system/
systemctl enable home-automation-server
systemctl start home-automation-server