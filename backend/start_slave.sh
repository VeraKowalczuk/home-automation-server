#!/bin/sh

export FLASK_APP=./backend/slave_server.py
flask run --host=192.168.178.96 --port=4000