from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def index():
    return 'Server Works!'


@app.route('/greet')
def say_hello():
    return 'Hello from Server'

@app.route('/up', methods=['POST'])
def up():
  if request.method == 'POST':
      print('UUUP')
      return 'UP'


@app.route('/down', methods=['POST'])
def down():
  if request.method == 'POST':
      print('DOOOWN')
      return 'DOWN'