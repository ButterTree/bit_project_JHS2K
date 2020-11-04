from image_2_style_gan.image_crossover import image_crossover
from image_animator.image_animator import image_animator

# from flask_restful import Resource, Api, reqparse
from flask import Flask, send_file, send_from_directory, render_template, request, jsonify
# from werkzeug.utils import secure_filename
import shutil
import time
import cv2
import os

app = Flask(__name__)
# api = Api(app)


@app.route("/")
def home():
    return render_template('index.html')


@app.route("/gen_picture", methods=['GET', 'POST'])
def gen_picture():
    time_flag = time.strftime('%m%d-%H%M%S', time.localtime(time.time()))
    client_ip = request.remote_addr

    if request.method == 'POST':   # POST 방식으로 전달된 경우
        f = request.files['raw_img_file']   # 파일 객체 혹은 파일 스트림을 가져옮.
        client_img_name = '../image_2_style_gan/img/{}.png'.format(client_ip)
        file_name = r'../image_2_style_gan/img/{}'.format(f.filename)
        f.save(file_name)

        cnv_buffer = cv2.imread(file_name)
        cv2.imwrite(client_img_name, cnv_buffer)
        os.remove(file_name)

    input_image, output_image = image_crossover(client_ip, time_flag)
    html = '''
                <!doctype html>
                <html>
                    <head>
                        <title>Image Requested</title>
                    </head>
                    <body>
                    <meta charset="UTF-8">
                    <title>Result | Change Eyes</title>
                    <img src="{}" width="500" height="500">
                    <img src="{}" width="500" height="500">
                    </body>
                </html>
            '''.format(input_image, output_image)

    return render_template('result.html', input_image_dir=input_image[7:], output_image_dir=output_image[7:])
    # return html


@app.route("/gen_video", methods=['GET', 'POST'])
def gen_video():
    time_flag = time.strftime('%m%d-%H%M%S', time.localtime(time.time()))
    client_ip = request.remote_addr

    if request.method == 'POST':   # POST 방식으로 전달된 경우
        f = request.files['raw_img_file']   # 파일 객체 혹은 파일 스트림을 가져옮.
        client_img_name = '../image_animator/source_image/{}_{}.png'.format(client_ip, time_flag)
        file_name = r'../image_animator/source_image/{}'.format(f.filename)
        f.save(file_name)

        cnv_buffer = cv2.imread(file_name)
        cv2.imwrite(client_img_name, cnv_buffer)
        os.remove(file_name)

    animated_result = image_animator(client_ip, time_flag)

    html = '''
            <!doctype html>
            <html>
                <head>
                    <title>Video Requested</title>
                </head>
                <body>
                    <video width="256" controls>
                        <source src="{}" type="video/mp4">
                    </video>
                </body>
            </html>
        '''.format(animated_result)
    return html


@app.route("/let_me_shine", methods=['GET', 'POST'])
def let_me_shine():
    time_flag = time.strftime('%m%d-%H%M%S', time.localtime(time.time()))
    client_ip = request.remote_addr

    if request.method == 'POST':   # POST 방식으로 전달된 경우
        f = request.files['raw_img_file']   # 파일 객체 혹은 파일 스트림을 가져옮.
        client_img_name = '../image_2_style_gan/img/{}.png'.format(client_ip)
        file_name = r'../image_2_style_gan/img/{}'.format(f.filename)
        f.save(file_name)

        cnv_buffer = cv2.imread(file_name)
        cv2.imwrite(client_img_name, cnv_buffer)
        os.remove(file_name)

    input_image, output_image = image_crossover(client_ip, time_flag)
    output_video = image_animator(client_ip, time_flag, output_image)

    return renderer(input_image, output_image, output_video)


# class ReceiveImageData(Resource):
#     def post(self):
#         try:
#             parser = reqparse.RequestParser()
#             # 첫 번째는 키값,
#             parser.add_argument('picture',
#                                 type=werkzeug.datastructures.FileStorage,
#                                 location='files')
#
#             args = parser.parse_args()
#             _imgFileStream = args['picture'].stream
#
#
#             # print(image_for_predict(_imgFileStream))
#             return model(_imgFileStream)
#         except Exception as e:
#             return str(e)
#
#
# api.add_resource(ReceiveImageData, '/get_picture')


if __name__ == "__main__":
    print("Server Start")
    app.run('121.138.83.1', port=45045, debug=True)