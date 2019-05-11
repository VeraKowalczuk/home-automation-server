#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

tmux \
  new-session  "export FLASK_APP=backend/master_server.py; flask run --host=0.0.0.0 --port=5000" \; \
  split-window "export FLASK_APP=backend/slave_server.py; flask run --host=0.0.0.0 --port=4000" \; \
  select-layout even-vertical \; \
  detach