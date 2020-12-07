from connector.result_manage.result_processing import *
from connector.gpu_task.model_task import main_processing
from flask import Flask, request


app = Flask(__name__)  # 'app'이라는 이름의 Flask Application 객체를 생성한다.


@app.route("/let_me_shine", methods=['POST'])
def let_me_shine():
    # 앱으로부터 데이터 전송받기
    data = request.get_json(silent=True)
    # json_data = q.enqueue(main_processing(data))
    json_data = main_processing(data)

    return json_data


if __name__ == "__main__":
    print("Server Initiative")
    app.run(URL_IP, port=URL_PORT, debug=True)
