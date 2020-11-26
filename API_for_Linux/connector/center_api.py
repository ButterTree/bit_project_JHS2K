from image_2_style_gan.image_crossover import image_crossover
from image_animator.image_animator import image_animator
from image_2_style_gan.align_images import align_images
from flask import Flask, render_template, request
import requests as rq
import torch
import base64
import json
import cv2
import os
import uuid
import shutil

app = Flask(__name__)  # 'app'이라는 이름의 Flask Application 객체를 생성한다.


@app.route("/let_me_shine/results/", methods=['GET', 'POST'])
def data_return():
    global data
    if request.method == 'POST':
        data = request.get_json(silent=True)
    elif request.method == 'GET':
        data_buf = data
        data = ''
        return data_buf
    elif data == '':
        data_return.close()
    return ''


@app.route("/let_me_shine", methods=['GET', 'POST'])  # 첫 화면에서 Image 파일을 제출하고 나면, 본 Url Page로 접속하게 된다. (Web)
def let_me_shine():
    url_base = "http://222.106.22.97:45045/let_me_shine/results/?uid="
    rand_uuid = uuid.uuid4()    # 랜덤 UUID 생성 (범용 고유 식별자, universally unique identifier, UUID)
    usr_ID = f'{rand_uuid}'
    process_selection = 0

    try:
        data = request.get_json(silent=True)
        if not data['origin']:
            print("Received Blank(0-Byte) File. Re-send image, please.")
            return "Re-send image, please."
        else:
            # item = {'label': data.get('label'), 'text': data.get('text')}
            BASE_DIR = f'../image_2_style_gan/images/{rand_uuid}/'
            if os.path.isdir(BASE_DIR) is not True:
                os.makedirs(BASE_DIR, exist_ok=True)
            
            RAW_DIR = f'{BASE_DIR}raw/'
            os.mkdir(RAW_DIR)

            file_name = f'{RAW_DIR}raw_{rand_uuid}.jpg'  # 첨부한 Image가 업로드한 파일명과 형식 그대로 일단 저장될 위치를 지정한다.
            client_img_name = f'{RAW_DIR}{rand_uuid}.png' # 첨부한 Image가 png 형식으로 다시 저장될 경로와 이름을 지정한다.

            gender = data['gender']

            with open(file_name, 'wb') as f:  # 변수에 받아들여 놓은 Image를 파일로 저장한다.
                f.write(base64.b64decode(data['origin']))

            cnv_buffer = cv2.imread(file_name)  # 앞서 저장한 업로드 Image를 openCV Library의 'imread'메소드를 이용해 다시 읽어들인다.
            cv2.imwrite(client_img_name, cnv_buffer)  # 접속한 Client의 UUID를 활용해 지정한 이름으로, 읽어들였던 Image를 png파일로 다시 기록한다.
            os.remove(file_name)  # 기존의 원본 Image 파일은 삭제한다.

            if data['custom']:
                process_selection = 1
                custom_target_name = f'{BASE_DIR}raw_target/'
                os.makedirs(f'{custom_target_name}aligned/', exist_ok=True)
                os.mkdir(f'{custom_target_name}un_aligned/')

                with open(custom_target_name + 'c_target.jpg', 'wb') as f:  # 변수에 받아들여 놓은 Image를 파일로 저장한다.
                    f.write(base64.b64decode(data['custom']))

                cnv_buffer = cv2.imread(f'{custom_target_name}c_target.jpg')
                cv2.imwrite(f'{custom_target_name}un_aligned/c_target.png', cnv_buffer)
                os.remove(f'{custom_target_name}c_target.jpg')

                align_images(f'{custom_target_name}un_aligned/', f'{custom_target_name}aligned/')

            input_image, output_image = image_crossover(BASE_DIR, RAW_DIR, rand_uuid, client_img_name, process_selection, gender)
            torch.cuda.empty_cache()
            # 'image_crossover'는 변경 요청 대상 Image에서 눈 부분만 Target처럼 바꿔주는 메소드이다.
            # 저장 파일명에 활용할 Client의 UUID를 Parameter로 넘겨주고, 처리 전의 원본 Image와 처리 후의 결과물 Image의 '경로 + 파일명'을 반환받는다.
            # output_video = image_animator(client_ip, time_flag, output_image)
            # 'image_animator'는 입력받은 Image를 특정한 Source 영상의 모션과 결합해 동영상으로 만들어 주는 메소드이다.
            # 저장 파일명에 활용할 Client의 IP, 'time_flag'와 재료가 될 Image를 Parameter로 넘겨주고 처리 후의 결과물 Image의 '경로 + 파일명'을 반환받는다.

            data = {'results': {'imgID_1': base64.b64encode(open(input_image, 'rb').read()).decode('utf-8'),
                                'imgID_2': base64.b64encode(open(output_image, 'rb').read()).decode('utf-8')}, 'usrID': usr_ID}
            json_data = json.dumps(data)

            rq.post(url_base + '{}'.format(usr_ID), json=json_data)

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
    app.run('222.106.22.97', port=45045, debug=True)  # 생성한 'app' 객체를 Parameter 값들을 이용해 구동한다.
    # 위에서 활용된 Parameter는 IP(v4)와 포트 번호, 디버그 모드의 수행 여부에 대한 Boolean 값이다.
