from flask import Flask, request, Response
import requests as req
import yaml
import json
import os

def create_response(res):
    response_master = Response(res)
    response_master.headers['Access-Control-Allow-Origin'] = '*'
    return response_master

def distribute_post_request(name, request):

    # the frontend sends the name in the format [ group | group$member ] for namepsacing purposes
    if '$' in name:
            namesplit = name.split('$')
            groupname = namesplit[0]
            memberid = namesplit[1]
            for group in cfg['groups']:
                if group['name'] == groupname:
                    for member in group['members']:
                        if member['id'] == memberid:
                            response_slave = req.post(member['host'] + request)
                            return create_response(response_slave.text)
    else:
        for group in cfg['groups']:
            if name == group['name']:
                responses_slaves = list()

                for member in group['members']:
                    responses_slaves.append(req.post(member['host'] + request).text)

                return create_response(responses_slaves)



with open(os.path.join(os.path.dirname(__file__),"../config.yml"), 'r') as ymlfile:
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


@app.route('/distribute/<name>/<path:subpath>', methods=['POST'])
def control(name, subpath):
    if request.method == 'POST':
        return distribute_post_request(name, '/'+subpath)


