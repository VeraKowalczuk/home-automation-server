tmux \
  new-session  "export FLASK_APP=master_server.py; flask run --host=0.0.0.0 --port=5000" \; \
  split-window "export FLASK_APP=slave_server.py; flask run --host=0.0.0.0 --port=4000" \; \
  select-layout even-vertical \; \
  detach