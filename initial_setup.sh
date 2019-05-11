#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

apt-get install apache2 python3 tmux
pip install -r requirements.txt
cp frontend/* /var/www/html/
cp local-config-default.yml local-config.yml