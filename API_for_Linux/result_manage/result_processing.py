from img_processing_manage.path_manager import *
import torch
import base64
import json
import requests as rq

URL_IP = '222.106.22.97'
URL_PORT = '45055'

url_base = f"http://{URL_IP}:{URL_PORT}/let_me_shine/results/?uid="
usr_ID = f'{rand_uuid}'

def result_processing(input_image, output_image):
    try:
        torch.cuda.empty_cache()
        post_processed_data = {'results': {'imgID_1': base64.b64encode(open(input_image, 'rb').read()).decode('utf-8'),
                                'imgID_2': base64.b64encode(open(output_image, 'rb').read()).decode('utf-8')}, 'usrID': usr_ID}
        final_data = json.dumps(post_processed_data)
        return final_data
    except Exception as e:
        print(f"result processing error {e}")


def post_data(json_data):
    try:
        last_data = rq.post(url_base + '{}'.format(usr_ID), json=json_data)
        return last_data
    except Exception as e:
        print(f"data post error {e}")