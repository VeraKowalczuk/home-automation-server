from flask import Flask, request
import RPi.GPIO as GPIO
import time
import yaml 
import os
import threading
import datetime
import json
import pyHS100

TIMER_FILE_LOCATION = "/tmp/automation_timers.json"

# kind of inelegant timer solution. Using a file makes handling of timers and persistance a lot easier tho.
def check_timers():
    with open(TIMER_FILE_LOCATION, 'r') as f:
      timers = json.load(f)
      
    new_timers = []
    for timer in timers:
      if datetime.datetime.strptime(timer["time"], "%y-%m-%d %H:%M:%S") > datetime.datetime.now():
        switch(timer["device_type"], timer["host"], timer["state"])
      else:
        new_timers.append(timer)
    
    with open(TIMER_FILE_LOCATION, 'w') as f:
      json.dump(new_timers, f)

    # Schedule the next check
    t = threading.Timer(softtimer_check_interval, check_timers)
    t.start()

## Load config
with open(os.path.join(os.path.dirname(__file__),"../local-config.yml"), 'r') as ymlfile:
    cfg = yaml.load(ymlfile,Loader=yaml.SafeLoader)

pin_up = cfg['pins']['up'] 
pin_down = cfg['pins']['down'] 
button_press_duration = cfg['misc']['button_press_duration_seconds']
softtimer_check_interval = cfg['misc']['softtimer_check_interval_seconds']

app = Flask(__name__)
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin_up, GPIO.OUT)
GPIO.setup(pin_down, GPIO.OUT)

## Schedule softtimer checks
if not os.path.isfile(TIMER_FILE_LOCATION):
  with open(TIMER_FILE_LOCATION, 'w') as f:
      json.dump([], f)

t = threading.Timer(softtimer_check_interval, check_timers)
t.start() 

@app.route('/')
def index():
    return 'Server Works!'

@app.route('/config', methods=['POST'])
def config():
  if request.method == 'POST':
      request.files['config.yml'].save('./')

@app.route('/shutter/<direction>', methods=['POST'])
def shutter(direction):
  if request.method == 'POST':

      if (direction == "down"):
        pin_used = pin_down
      elif (direction == "up"):
        pin_used = pin_up
      else:
        return 'No such direction: '+ direction
        
      GPIO.output(pin_used, GPIO.HIGH)
      time.sleep(button_press_duration)
      GPIO.output(pin_used, GPIO.LOW)

      return direction

@app.route('/switch/<device_type>/<host>/<state>', methods=['POST'])
def switch(device_type, host, state):
  if device_type == "tplink":
    plug = pyHS100.SmartPlug(host)
    if state == "on":
      plug.turn_on()
    elif state == "off":
      plug.turn_off()
    else:
      print("Unknown state")
  else:
    print("Unknown type")
  return "done"
      
@app.route('/timer/<seconds>/<device_type>/<host>/<state>', methods=['POST'])
def timer(seconds, device_type, host, state):
  shutoff_time = datetime.datetime.now() + datetime.timedelta(seconds=seconds)
  timer = {
    "time": shutoff_time.strftime("%y-%m-%d %H:%M:%S"),
    "device_type": device_type,
    "host": host,
    "state": state
  }
  with open(TIMER_FILE_LOCATION, 'rw') as f:
    try:
      timers = json.load(f)
      timers.append(timer)
      json.dump(timers, f)
    except Exception:
      # No JSON in file
      json.dump([timer], f)
  return "done"