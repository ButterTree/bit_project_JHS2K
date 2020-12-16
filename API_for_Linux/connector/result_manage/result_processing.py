import torch
import base64
import json

<<<<<<< HEAD
URL_IP = '0.0.0.0'
URL_PORT = '5000'
# URL_PORT = '80'
# URL_IP = '192.168.1.44'
# URL_PORT = '45015'
=======
URL_IP = '192.168.1.47'
URL_PORT = '45055'
>>>>>>> upstream/model_only_eyes

url_base = f"http://{URL_IP}:{URL_PORT}/let_me_shine/results/?uid="


def result_processing(input_image, output_image, rand_uuid):
    try:
        usr_ID = f'{rand_uuid}'
        torch.cuda.empty_cache()
        post_processed_data = {'results': {'imgID_1': base64.b64encode(open(input_image, 'rb').read()).decode('utf-8'),
                                           'imgID_2': base64.b64encode(open(output_image, 'rb').read()).decode('utf-8')}, 'usrID': usr_ID}
        final_data = json.dumps(post_processed_data)
        return final_data
    except Exception as e:
        print(f"result processing error {e}")
