from image_2_style_gan.align_images import align_images
import cv2
import os
import base64
import uuid

rand_uuid = uuid.uuid4()


def make_dir(process_selection):
    BASE_DIR = f'../image_2_style_gan/images/{rand_uuid}/'
    if process_selection == 0:
        if os.path.isdir(BASE_DIR) is not True:
            os.makedirs(BASE_DIR, exist_ok=True)
        
        RAW_DIR = f'{BASE_DIR}raw/'
        os.mkdir(RAW_DIR)
        return BASE_DIR, RAW_DIR

    if process_selection == 1:
        CUSTOM_DIR = f'{BASE_DIR}raw_target/'
        os.makedirs(f'{CUSTOM_DIR}aligned/', exist_ok=True)
        os.mkdir(f'{CUSTOM_DIR}un_aligned/')
        return BASE_DIR, CUSTOM_DIR


def make_img_path(RAW_DIR):
    jpg_path = f'{RAW_DIR}raw_{rand_uuid}.jpg'
    png_path = f'{RAW_DIR}{rand_uuid}.png'
    return jpg_path, png_path
    

def save_jpg(file_path, data, process_selection):
    if process_selection == 0:
        with open(file_path, 'wb') as o:  
            o.write(base64.b64decode(data))

    if process_selection == 1:
        with open(file_path + 'c_target.jpg', 'wb') as c:
            c.write(base64.b64decode(data))     


def transform_jpg_to_png(jpg_path, png_path):
    cnv_buffer = cv2.imread(jpg_path)
    cv2.imwrite(png_path, cnv_buffer)
    os.remove(jpg_path)
    return png_path


def transform_aligned_custom_img(CUSTOM_DIR):
    cnv_buffer = cv2.imread(f'{CUSTOM_DIR}c_target.jpg')
    cv2.imwrite(f'{CUSTOM_DIR}un_aligned/c_target.png', cnv_buffer)
    os.remove(f'{CUSTOM_DIR}c_target.jpg')

    align_images(f'{CUSTOM_DIR}un_aligned/', f'{CUSTOM_DIR}aligned/')

