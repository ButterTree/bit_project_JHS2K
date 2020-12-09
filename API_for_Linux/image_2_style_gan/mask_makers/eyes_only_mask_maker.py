from collections import OrderedDict
import numpy as np
import argparse
import dlib
import cv2
import os


def precision_eyes_only_masks(aligned_image_name, mask_dir):
    FACIAL_LANDMARKS_INDEXES = OrderedDict([("Right_Eye", (36, 42)), ("Left_Eye", (42, 48))])
    bias = [[5, 0], [0, 5], [0, 5], [-5, 0], [0, -3], [0, -3], [5, 0], [0, 5], [0, 5], [5, 0], [0, -3], [0, -3]]

    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor('../image_2_style_gan/landmark_model/shape_predictor_68_face_landmarks.dat')

    image = cv2.imread(aligned_image_name)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    shape = predictor(gray, detector(gray, 1)[0])
    coordinates = np.zeros((68, 2), dtype=int)

    for i in range(0, 68):
        coordinates[i] = (shape.part(i).x, shape.part(i).y)

    mask_base = np.zeros((1024, 1024, 1))

    for i, landmark_name in enumerate(FACIAL_LANDMARKS_INDEXES.keys()):
        (j, k) = FACIAL_LANDMARKS_INDEXES[landmark_name]
        mask_base = cv2.fillConvexPoly(mask_base, coordinates[j:k] + bias[0+(6*i):6+(6*i)], 255)
    
    mask_base = cv2.blur(mask_base, (5,5))
    cv2.imwrite(mask_dir + 'eyes_only_mask.png', mask_base)

    return mask_dir + 'eyes_only_mask.png'


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='MaskMaker')
    parser.add_argument('--path', default="source/for_mask/")
    parser.add_argument('--filename', default="source/")
    
    args = parser.parse_args()
    
    precision_eyes_only_masks(args.path + os.listdir(args.path)[0], args.filename)
