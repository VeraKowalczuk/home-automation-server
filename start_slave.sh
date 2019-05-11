#!/bin/sh

export FLASK_APP=slave_server.py
flask run --host=0.0.0.0 --port=4000