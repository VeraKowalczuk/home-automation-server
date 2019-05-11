from flask import Flask, request
import RPi.GPIO as GPIO
import time
import yaml 
import os
import threading
import datetime


# kind of inelegant timer solution. Using a file makes handling of timers and persistance a lot easier tho.
def check_timers():
    t = threading.Timer(softtimer_check_interval, check_timers)
    t.start()

    with open(os.path.join(os.path.dirname(__file__), ".timer"), 'r') as f:
      shutoff_time = datetime.datetime.strptime(f.readline(), '%m/%d/%y %H:%M:%S')

    if (shutoff_time > datetime.datetime.now() ):
      # TODO: SHUTOFF LIGHT WITH GPIO
      reset_timer()

def reset_timer():
  with open(os.path.join(os.path.dirname(__file__), ".timer"), 'w') as f:
      f.write("NO TIMER")


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
if(not os.path.isfile(os.path.join(os.path.dirname(__file__), ".timer"))):
  reset_timer()

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



@app.route('/light/switch/<onoff>', methods=['POST'])
def light_swich(onoff):
  if request.method == 'POST':
    if onoff == "on":
      pass# TODO: TURN ON LIGHT WITH GPIO
    elif (onoff == "off"):
      pass# TODO: TURN OFF LIGHT WITH GPIO
    pass




@app.route('/light/offtimer/<seconds>', methods=['POST'])
def light_timer(seconds):
  if request.method == 'POST':
    
    shutoff_time = datetime.datetime.now() + datetime.timedelta(seconds=seconds)
    with open(os.path.join(os.path.dirname(__file__), ".timer"), 'w') as f:
      f.write(shutoff_time)
      
