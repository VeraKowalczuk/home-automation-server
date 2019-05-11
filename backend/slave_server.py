from flask import Flask, request
import RPi.GPIO as GPIO
import time
import yaml 
import os


app = Flask(__name__)
GPIO.setmode(GPIO.BCM)

with open(os.path.join(os.path.dirname(__file__),"../local-config.yml"), 'r') as ymlfile:
    cfg = yaml.load(ymlfile,Loader=yaml.SafeLoader)

pin_up = cfg['pins']['up'] 
pin_down = cfg['pins']['down'] 
button_press_duration = cfg['misc']['button_press_duration']

GPIO.setup(pin_up, GPIO.OUT)
GPIO.setup(pin_down, GPIO.OUT)

@app.route('/')
def index():
    return 'Server Works!'


@app.route('/up', methods=['POST'])
def up():
  if request.method == 'POST':
      GPIO.output(pin_up, GPIO.HIGH)
      time.sleep(button_press_duration)
      GPIO.output(pin_up, GPIO.LOW)
      return 'UP'


@app.route('/down', methods=['POST'])
def down():
  if request.method == 'POST':
      GPIO.output(pin_down, GPIO.HIGH)
      time.sleep(button_press_duration)
      GPIO.output(pin_down, GPIO.LOW)
      return 'DOWN'


@app.route('/config', methods=['POST'])
def config():
  if request.method == 'POST':
      request.files['config.yml'].save('./')
