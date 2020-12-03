from image_2_style_gan.image_crossover_face import image_crossover_face
from image_2_style_gan.image_crossover_eyes import image_crossover_eyes
# from image_animator.image_animator import image_animator
from image_2_style_gan.align_images import align_images
from flask import Flask, request
import requests as rq
import torch
import base64
import json
import cv2
import os
import shutil

from img_processing_manager.dir_manage import rand_uuid, make_dir, make_img_path, save_jpg, transform_jpg_to_png, transform_aligned_custom_img
from connector.data_check.data_checker import post_get_checker

app = Flask(__name__)  # 'app'이라는 이름의 Flask Application 객체를 생성한다.

URL_IP = '121.138.83.1'
URL_PORT = '45045'

@app.route("/let_me_shine/results/", methods=['GET', 'POST'])
def data_return():
    global data
    # post_get_checker(data)

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
    url_base = f"http://{URL_IP}:{URL_PORT}/let_me_shine/results/?uid="
    # rand_uuid = uuid.uuid4()    # 랜덤 UUID 생성 (범용 고유 식별자, universally unique identifier, UUID)
    usr_ID = f'{rand_uuid}'
    process_selection = 0
    scope = 'eyes'

    try:
        data = request.get_json(silent=True)
        if not data['origin']: return "Re-send image, please."
        else:
            gender = data['gender']
            # 베이스 디렉터리 생성
            BASE_DIR, RAW_DIR = make_dir(process_selection)
            # 경로 설정
            jpg_path, png_path = make_img_path(RAW_DIR)
            # jpg 저장
            save_jpg(jpg_path, data['origin'], process_selection)
            # jpg -> png
            png_path = transform_jpg_to_png(jpg_path, png_path)

            try:
                if data['custom']:
                    process_selection = 1
                    # 디렉터리 생성
                    BASE_DIR, CUSTOM_DIR = make_dir(process_selection)
                    # 커스텀 jpg 저장
                    save_jpg(CUSTOM_DIR, data['custom'], process_selection)
                    # jpg -> png, 정방형 처리
                    transform_aligned_custom_img(CUSTOM_DIR)
            except Exception as e:
                pass

            if scope == 'eyes':
                input_image, output_image = image_crossover_eyes(BASE_DIR, RAW_DIR, rand_uuid, process_selection, gender)
            else:
                input_image, output_image = image_crossover_face(BASE_DIR, RAW_DIR, rand_uuid, process_selection, gender)

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
    app.run(URL_IP, port=URL_PORT, debug=True)  # 생성한 'app' 객체를 Parameter 값들을 이용해 구동한다.
    # 위에서 활용된 Parameter는 IP(v4)와 포트 번호, 디버그 모드의 수행 여부에 대한 Boolean 값이다.
