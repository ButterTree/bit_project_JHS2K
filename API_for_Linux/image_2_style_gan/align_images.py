import os

# import sys
# import bz2
# from keras.utils import get_file
from image_2_style_gan.face_alignment import image_align
from image_2_style_gan.landmarks_detector import LandmarksDetector


# def unpack_bz2(src_path):
#     data = bz2.BZ2File(src_path).read()
#     dst_path = src_path[:-4]
#     with open(dst_path, 'wb') as fp:
#         fp.write(data)
#     return dst_path


def align_images(ALIGNED_IMAGES_DIR):
    """
    Extracts and aligns all faces from images using DLib and a function from original FFHQ dataset preparation step
    python align_images.py /raw_images /aligned_images
    """

    # landmarks_model_path = unpack_bz2(get_file('shape_predictor_68_face_landmarks.dat.bz2',
    #                                            LANDMARKS_MODEL_URL, cache_subdir='temp'))
    landmarks_model_path = r'../image_2_style_gan/model/shape_predictor_68_face_landmarks.dat'
    alinged_files = []
    if os.path.isdir(os.path.dirname(landmarks_model_path)) is not True:
        os.makedirs(os.path.dirname(landmarks_model_path), exist_ok=True)

    RAW_IMAGES_DIR = r'../image_2_style_gan/images/raw'
    if os.path.isdir(RAW_IMAGES_DIR) is not True:
        os.makedirs(RAW_IMAGES_DIR, exist_ok=True)

    if os.path.isdir(ALIGNED_IMAGES_DIR) is not True:
        os.makedirs(ALIGNED_IMAGES_DIR, exist_ok=True)

    landmarks_detector = LandmarksDetector(landmarks_model_path)
    for img_name in os.listdir(RAW_IMAGES_DIR):
        print(img_name)
        if img_name == '':
            return
        raw_img_path = os.path.join(RAW_IMAGES_DIR, img_name)
        for i, face_landmarks in enumerate(landmarks_detector.get_landmarks(raw_img_path), start=1):
            aligned_face_path = '{}{}.png'.format(ALIGNED_IMAGES_DIR, os.path.splitext(img_name)[0])
            alinged_files.append(image_align(raw_img_path, aligned_face_path, face_landmarks))

    return alinged_files


if __name__ == "__main__":
    # RAW_IMAGES_DIR = sys.argv[1]
    # ALIGNED_IMAGES_DIR = sys.argv[2]

    ALIGNED_IMAGES_DIR = r'../image_2_style_gan/images/medium/'
    align_images(ALIGNED_IMAGES_DIR)
