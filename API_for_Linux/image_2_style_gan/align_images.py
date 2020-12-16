import os
# import cv2
# import sys
# import bz2
# from keras.utils import get_file
from image_2_style_gan.face_alignment import face_align
from image_2_style_gan.landmarks_detector import LandmarksDetector


# def unpack_bz2(src_path):
#     data = bz2.BZ2File(src_path).read()
#     dst_path = src_path[:-4]
#     with open(dst_path, 'wb') as fp:
#         fp.write(data)
#     return dst_path


def align_images(RAW_IMAGE_DIR, ALIGNED_IMAGE_DIR):
    """
    Extracts and aligns all faces from images using DLib and a function from original FFHQ dataset preparation step
    python align_images.py /raw_images /aligned_images
    """

    # landmarks_model_path = unpack_bz2(get_file('shape_predictor_68_face_landmarks.dat.bz2',
    #                                            LANDMARKS_MODEL_URL, cache_subdir='temp'))
    landmarks_model_path = '../image_2_style_gan/landmark_model/shape_predictor_68_face_landmarks.dat'
    landmarks_detector = LandmarksDetector(landmarks_model_path)
    alinged_files = []

    for img_name in os.listdir(RAW_IMAGE_DIR):
        if img_name == '':
            return
        raw_img_path = os.path.join(RAW_IMAGE_DIR, img_name)
        for i, face_landmarks in enumerate(landmarks_detector.get_landmarks(raw_img_path), start=1):
            aligned_face_path = '{}{}_a.png'.format(ALIGNED_IMAGE_DIR, os.path.splitext(img_name)[0])
            alinged_files.append(face_align(raw_img_path, aligned_face_path, face_landmarks))

    return alinged_files


if __name__ == "__main__":
    RAW_IMAGE_DIR = 'images/raw/'
    ALIGNED_IMAGE_DIR = 'images/aligned/'
    
    if not os.path.isdir(RAW_IMAGE_DIR):
            os.makedirs(RAW_IMAGE_DIR, exist_ok=True)

    if not os.path.isdir(ALIGNED_IMAGE_DIR):
            os.makedirs(ALIGNED_IMAGE_DIR, exist_ok=True)

    align_images(RAW_IMAGE_DIR, ALIGNED_IMAGE_DIR)
