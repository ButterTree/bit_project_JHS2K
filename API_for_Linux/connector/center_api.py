from image_2_style_gan.image_crossover_face import image_crossover_face
from image_2_style_gan.image_crossover_eyes import image_crossover_eyes
from connector.img_processing_manage.path_manager import *
from connector.result_manage.result_processing import *
from flask import Flask, request
import shutil


app = Flask(__name__)  # 'app'이라는 이름의 Flask Application 객체를 생성한다.

# @app.route("/let_me_shine/results/", methods=['GET', 'POST'])
# def data_return():
#     global data
#     if request.method == 'POST':
#         data = request.get_json(silent=True)
#     elif request.method == 'GET':
#         data_buf = data
#         return data_buf
#     elif data == '':
#         data_return.close()
#     return ''


# 첫 화면에서 Image 파일을 제출하고 나면, 본 Url Page로 접속하게 된다. (Web)
@app.route("/let_me_shine", methods=['POST'])
def let_me_shine():
    scope = 'eyes'
    try:
        # 앱으로부터 데이터 전송받기
        data = request.get_json(silent=True)
        gender = data['gender']
        process_selection = 0
        # 전송받은 데이터와 프로세스 선택 변수 넘겨주기
        BASE_DIR, RAW_DIR = origin_image_control(data, process_selection)
        if data['custom']:
            process_selection = 1
            custom_image_control(data, process_selection)

        print("\n********** Image processing succeed, send to model **********\n")
        if scope == 'eyes':
            input_image, output_image = image_crossover_eyes(
                BASE_DIR, RAW_DIR, rand_uuid, process_selection, gender)
        else:
            input_image, output_image = image_crossover_face(
                BASE_DIR, RAW_DIR, rand_uuid, process_selection, gender)
        print("\n********** Model processing succeed, post data **********\n")

        # 이미지 base64형식으로 변환
        json_data = result_processing(input_image, output_image)
        shutil.rmtree(BASE_DIR)  # UUID 디렉터리 삭제
        return json_data
    except Exception as e:
        shutil.rmtree(BASE_DIR)  # UUID 디렉터리 삭제
        print(f'json_data part error: {e}')


if __name__ == "__main__":
    # __name__ == "__main__" 구문의 의미하는 것은 우선 [Module을 Command Prompt 등을 통해 "직접 실행하는 경우"]라는 의미이다.
    # 즉, 이는 특정 Module을 타 Module에서 Import를 통해 활용하는 경우와 구분지을 수 있는 수단이 된다.
    print("Server Initiative")  # 메시지를 출력해 Server의 작동 시작을 알린다.
    # 생성한 'app' 객체를 Parameter 값들을 이용해 구동한다.
    app.run(URL_IP, port=URL_PORT, debug=True)
    # 위에서 활용된 Parameter는 IP(v4)와 포트 번호, 디버그 모드의 수행 여부에 대한 Boolean 값이다.
