from flask import Flask, request
import RPi.GPIO as GPIO
import time

app = Flask(__name__)
GPIO.setmode(GPIO.BCM)
GPIO.setup(10, GPIO.OUT)
GPIO.setup(27, GPIO.OUT)

@app.route('/')
def index():
    return 'Server Works!'


@app.route('/up', methods=['POST'])
def up():
  if request.method == 'POST':
      GPIO.output(10, GPIO.HIGH)
      time.sleep(0.5)
      GPIO.output(10, GPIO.LOW)
      print('UUUP')
      return 'UP'


@app.route('/down', methods=['POST'])
def down():
  if request.method == 'POST':
      GPIO.output(27, GPIO.HIGH)
      time.sleep(0.5)
      GPIO.output(27, GPIO.LOW)
      print('DOOOWN')
      return 'DOWN'