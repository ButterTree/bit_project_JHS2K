from connector.result_manage.result_processing import URL_IP, URL_PORT
from connector.gpu_task.model_task import main_processing
from flask import Flask, request

import uuid

app = Flask(__name__)


@app.route("/", methods=['POST', 'GET'])
def let_me_shine():
    if request.method == 'POST':
        rand_uuid = uuid.uuid4()
        data = request.get_json(silent=True)
        json_data = main_processing(data, rand_uuid)
        return json_data
    else:
        return 'You entered GET site'

if __name__ == "__main__":
    print("Server Initiative")
    app.run(URL_IP, port=URL_PORT, debug=True)
