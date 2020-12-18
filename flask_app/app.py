from .connector.gpu_task.model_task import main_processing
from flask import Flask, request

import uuid

server = Flask(__name__)

@server.route("/", methods=['GET', 'POST'])
def let_me_shine():
    if request.method == 'POST':
        rand_uuid = uuid.uuid4()
        data = request.get_json()
        json_data = main_processing(data, rand_uuid)
        return data
    else:
        return "Hi"