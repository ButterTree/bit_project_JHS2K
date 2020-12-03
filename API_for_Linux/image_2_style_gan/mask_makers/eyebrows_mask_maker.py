# from skimage.exposure import match_histograms, equalize_adapthist
from collections import OrderedDict
# from PIL import Image
import numpy as np
import argparse
import dlib
import cv2
import os
# import random
default_dir = '../image_2_style_gan/landmark_model/shape_predictor_68_face_landmarks.dat'


def precision_eye_masks(aligned_image_name, mask_dir, landmark_dat_dir=default_dir):
    FACIAL_LANDMARKS_INDEXES = OrderedDict([
    # ("Mouth", (48, 68)),
    ("Right_Eyebrow", (17, 22)),
    ("Left_Eyebrow", (22, 27)),
    ("Right_Eye", (36, 42)),
    ("Left_Eye", (42, 48))#,
    # ("Nose", (27, 35)),
    # ("Jaw", (0, 17))
    ])

    FACIAL_CONVPOLY_INDEXES = []
    FACIAL_CONVPOLY_INDEXES.append(range(17, 27))
    FACIAL_CONVPOLY_INDEXES.append(range(16, -1, -1))

    # bias = [[-35, 0], [0, -30], [0, -30], [20, 0], [0, 5], [0, 5], [-20, 0], [0, -30], [0, -30], [35, 0], [0, 5], [0, 5]]
    bias = [[-40, 0], [-30, -30], [25, -30], [25, 0], [0, 10], [0, 10], [-20, 0], [-25, -30], [30, -30], [40, 0], [0, 10], [0, 10]]
    lid_bias = [[-7, -15], [0, -13], [0, -13], [-3, -12], [3, -12], [0, -13], [0, -13], [7, -15]]
    brows_bias = [0, 20]

    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(landmark_dat_dir)

    image = cv2.imread(aligned_image_name)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    shape = predictor(gray, detector(gray, 1)[0])
    coordinates = np.zeros((68, 2), dtype=int)

    for i in range(0, 68):
        coordinates[i] = (shape.part(i).x, shape.part(i).y)

    mask_base = np.zeros((1024, 1024, 1))
    face_base = np.zeros((1024, 1024, 1))
    eyes_base = np.zeros((1024, 1024, 1))
    lids_base = np.zeros((1024, 1024, 1))
    brows_base = np.zeros((1024, 1024, 1))

    for i, landmark_name in enumerate(FACIAL_LANDMARKS_INDEXES.keys()):
        (j, k) = FACIAL_LANDMARKS_INDEXES[landmark_name]
        if landmark_name == 'Right_Eyebrow' or landmark_name == 'Left_Eyebrow':
            brows_coords = np.append(coordinates[j:k], np.flip(coordinates[j:k] + brows_bias, axis=0), axis=0)
            brows_base = cv2.fillConvexPoly(brows_base, brows_coords, 255)
        else:
            lid_coords = np.append(coordinates[j: k-2], np.flip(coordinates[j: k-2] + lid_bias[0+(4*(i-2)):4+(4*(i-2))], axis=0), axis=0)
            lids_base = cv2.fillConvexPoly(lids_base, lid_coords, 255)
            mask_base = cv2.fillConvexPoly(mask_base, coordinates[j:k] + bias[0+(6*(i-2)):6+(6*(i-2))], 255)
            eyes_base = cv2.fillConvexPoly(eyes_base, coordinates[j:k], 255)
    
    face_poly_coords = []
    for i in FACIAL_CONVPOLY_INDEXES:
        for x, y in coordinates[i]:
            face_poly_coords.insert(len(face_poly_coords), [x, y])
    face_base = cv2.fillConvexPoly(face_base, np.array(face_poly_coords), 255)

    face_base = cv2.blur(face_base, (30, 30))
    mask_base = cv2.blur(mask_base, (20,25))
    eyes_base = cv2.blur(eyes_base, (10,3))
    brows_base = cv2.blur(brows_base, (10,15))
    lids_base = cv2.blur(lids_base, (5,7))

    cv2.imwrite(mask_dir + 'mask.png', mask_base)
    cv2.imwrite(mask_dir + 'mask_face.png', face_base)
    cv2.imwrite(mask_dir + 'mask_eyes.png', eyes_base)
    cv2.imwrite(mask_dir + 'mask_brows.png', brows_base)
    cv2.imwrite(mask_dir + 'mask_lids.png', lids_base)

    return mask_dir + 'mask.png', mask_dir + 'mask_face.png', mask_dir + 'mask_eyes.png', mask_dir + 'mask_brows.png', mask_dir + 'mask_lids.png'


# def target_preprocessor(aligned_image_name, TARGET_SOURCE_DIR, TARGET_IMAGE_DIR, process_selection):
#     FACIAL_LANDMARKS_INDEXES = OrderedDict([("Right_Eye", (36, 42)), ("Left_Eye", (42, 48))])
#     detector = dlib.get_frontal_face_detector()
#     predictor = dlib.shape_predictor('../image_2_style_gan/landmark_model/shape_predictor_68_face_landmarks.dat')
    
#     origin_image = cv2.imread(aligned_image_name)
#     target_image = cv2.imread(TARGET_SOURCE_DIR + os.listdir(TARGET_SOURCE_DIR)[0])

#     if np.shape(target_image)[2] == 1:
#         gray = target_image
#         target_image = cv2.merge((target_image, target_image, target_image))
#     else :
#         gray = cv2.cvtColor(target_image, cv2.COLOR_BGR2GRAY)

#     rects = detector(gray, 1)
#     # cv2.imwrite('../image_2_style_gan/source/target_grayed.png', gray)
#     for (i, rect) in enumerate(rects):
#         shape = predictor(gray, rect)
#         coordinates = np.zeros((68, 2), dtype=int)

#         for i in range(0, 68):
#             coordinates[i] = (shape.part(i).x, shape.part(i).y)
        
#         mask_base = np.zeros((1024, 1024, 1))

#         for (i, name) in enumerate(FACIAL_LANDMARKS_INDEXES.keys()):
#             (j, k) = FACIAL_LANDMARKS_INDEXES[name]
#             mask_base = cv2.fillConvexPoly(mask_base, coordinates[j:k], 1)
#             mask_continv = 1 - mask_base
#             # mask_base = cv2.merge((mask_base, mask_base, mask_base))
#             # mmask_continv = cv2.merge((mask_continv, mask_continv, mask_continv))
    
#     eyes_origin = target_image * mask_base

#     origin_ref_part = origin_image[shape.part(37).y - 30 : shape.part(41).y + 30, shape.part(36).x - 30 : shape.part(39).x + 10]
#     target_ref_part = target_image[shape.part(37).y - 30 : shape.part(41).y + 30, shape.part(36).x - 30 : shape.part(39).x + 10]
    
#     # if np.max(origin_ref_part) > 255:
#     #     origin_ref_part = ((origin_ref_part/np.max(origin_ref_part))*255).astype(np.uint8)
    
#     hist_mean = np.mean(origin_ref_part) - np.mean(target_ref_part)
#     print(hist_mean)

#     if np.abs(np.mean(origin_ref_part) - np.mean(target_ref_part)) > 2:
#         # target_image = match_histograms(target_image * mask_continv, origin_ref_part, multichannel=True)/255
#         # target_image = equalize_adapthist(target_image, clip_limit=0.008)*255 + eyes_origin
#         target_image = (target_image + hist_mean) + eyes_origin
#     else:
#         target_image = target_image + eyes_origin
#     # target_image = target_image + eyes_origin

#     cv2.imwrite(TARGET_IMAGE_DIR + 'target.png', target_image)

#     return TARGET_IMAGE_DIR + 'target.png'


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='MaskMaker')
    parser.add_argument('--path', default="source/for_mask/")
    parser.add_argument('--filename', default="source/")
    args = parser.parse_args()
    
    if not os.path.isdir(args.path):
            os.makedirs(args.path, exist_ok=True)

    precision_eye_masks(args.path + os.listdir(args.path)[0], args.filename, '../landmark_model/shape_predictor_68_face_landmarks.dat')
