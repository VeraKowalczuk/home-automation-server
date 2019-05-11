#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit 1
fi

export FLASK_APP=backend/slave.py
flask run --host=0.0.0.0 --port=4000
