from collections import OrderedDict
import numpy as np
import argparse
import dlib
import cv2
import os

from numpy.lib.function_base import append

def precision_facial_mask(aligned_image_name, mask_dir):
    FACIAL_LANDMARKS_INDEXES = []
    FACIAL_LANDMARKS_INDEXES.append(range(17, 27))
    FACIAL_LANDMARKS_INDEXES.append(range(16, -1, -1))

    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor('../image_2_style_gan/landmark_model/shape_predictor_68_face_landmarks.dat')

    image = cv2.imread(aligned_image_name)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    shape = predictor(gray, detector(gray, 1)[0])
    coordinates = np.zeros((68, 2), dtype=int)

    for i in range(0, 68):
        coordinates[i] = (shape.part(i).x, shape.part(i).y)
        if i >= 0 and i<= 16:
            coordinates[i] += [0, 20]
        if i >= 17 and i<= 26:
            coordinates[i] += [0, -20]
    
    face_poly_coords = []
    for i in FACIAL_LANDMARKS_INDEXES:
        for x, y in coordinates[i]:
            face_poly_coords.insert(len(face_poly_coords), [x, y])

    mask_base = np.zeros((1024, 1024, 1))
    mask_base = cv2.fillConvexPoly(mask_base, np.array(face_poly_coords), 255)
    mask_base = cv2.blur(mask_base, (30, 30))

    cv2.imwrite(mask_dir + 'mask.png', mask_base)

    return mask_dir + 'mask.png'


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='MaskMaker')
    parser.add_argument('--path', default="source/for_mask/")
    parser.add_argument('--filename', default="source/")
    
    args = parser.parse_args()
    
    precision_facial_mask(args.path + os.listdir(args.path)[0], args.filename)
