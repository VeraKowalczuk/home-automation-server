#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

tmux kill-server
apt-get update
apt-get upgrade -y
git fetch --all
git reset --hard origin/master
pip3 install -r requirements.txt
rm -r /var/www/html/*
cp frontend/* /var/www/html/
/bin/bash start_server.sh