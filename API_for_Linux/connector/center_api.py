from image_2_style_gan.image_crossover import image_crossover
from img_processing_manage.path_manager import *
from result_manage.result_processing import *
from flask import Flask, request
import shutil


app = Flask(__name__)  # 'app'이라는 이름의 Flask Application 객체를 생성한다.

@app.route("/let_me_shine/results/", methods=['GET', 'POST'])
def data_return():
    global data
    if request.method == 'POST':
        data = request.get_json(silent=True)
    elif request.method == 'GET':
        data_buf = data
        return data_buf
    elif data == '':
        data_return.close()
    return ''


@app.route("/let_me_shine", methods=['POST'])  # 첫 화면에서 Image 파일을 제출하고 나면, 본 Url Page로 접속하게 된다. (Web)
def let_me_shine():
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
        input_image, output_image = image_crossover(BASE_DIR, RAW_DIR, rand_uuid, process_selection, gender)
        print("\n********** Model processing succeed, post data **********\n")
        # 이미지 base64형식으로 변환
        final_data = result_processing(input_image, output_image)
        # results로 포스트
        post_data(final_data)
        shutil.rmtree(BASE_DIR) # UUID 디렉터리 삭제
        return url_base + '{}'.format(usr_ID)
    except Exception as e:
        shutil.rmtree(BASE_DIR) # UUID 디렉터리 삭제
        print(f'json_data part error: {e}')

        # 모든 Image 처리 과정이 완료되면, 'result.html'을 참조해 Page를 구성해 출력하고,
        # 각 scr를 받아들여 출력하는 부분에 해당되는 자료의 경로 및 파일명을 Parameter로 넘겨줘 Page에 출력할 수 있도록 한다.

if __name__ == "__main__":
    # __name__ == "__main__" 구문의 의미하는 것은 우선 [Module을 Command Prompt 등을 통해 "직접 실행하는 경우"]라는 의미이다.
    # 즉, 이는 특정 Module을 타 Module에서 Import를 통해 활용하는 경우와 구분지을 수 있는 수단이 된다.

    print("Server Initiative")  # 메시지를 출력해 Server의 작동 시작을 알린다.
    app.run(URL_IP, port=URL_PORT, debug=True)  # 생성한 'app' 객체를 Parameter 값들을 이용해 구동한다.
    # 위에서 활용된 Parameter는 IP(v4)와 포트 번호, 디버그 모드의 수행 여부에 대한 Boolean 값이다.