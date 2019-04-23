from flask import Flask, request, Response
import requests as req
import yaml
import json

def create_response(res):
    response_master = Response(res)
    response_master.headers['Access-Control-Allow-Origin'] = '*'
    return response_master

with open("config.yml", 'r') as ymlfile:
    cfg = yaml.load(ymlfile,Loader=yaml.SafeLoader)


jsoncfg= json.dumps(cfg, ensure_ascii=False)


app = Flask(__name__)

@app.route('/')
def index():
    return 'Server Works!'


@app.route('/config', methods=['GET','POST'])
def config():
    if request.method == 'POST':
        #TODO

        return 'POST'

    elif request.method == 'GET':

        resp = Response(jsoncfg)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp


@app.route('/control/<name>/<direction>', methods=['POST'])
def control(name, direction):
    if request.method == 'POST':

        if '$' in name:
            namesplit = name.split('$')
            groupname = namesplit[0]
            memberid = namesplit[1]
            for group in cfg['groups']:
                if group['name'] == groupname:
                    for member in group['members']:
                        if member['id'] == memberid:
                            response_slave = req.post(member['host'] + '/' + direction)
                            return create_response(response_slave.text)

        else:
            for group in cfg['groups']:
                if name == group['name']:
                    responses_slaves = list()

                    for member in group['members']:
                        responses_slaves.append(req.post(member['host']+'/'+direction).text)

                    return create_response(responses_slaves)
