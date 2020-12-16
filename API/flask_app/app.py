from connector.gpu_task.model_task import main_processing
from flask import Flask, request

import uuid

app = Flask(__name__)

@app.route("/", methods=['POST'])
def let_me_shine():
    rand_uuid = uuid.uuid4()
    data = request.get_json(silent=True)
    json_data = main_processing(data, rand_uuid)
    return json_data