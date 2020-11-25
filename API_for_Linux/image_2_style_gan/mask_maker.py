from skimage.exposure import match_histograms, equalize_adapthist
from collections import OrderedDict
from PIL import Image
import numpy as np
import argparse
import dlib
import cv2
import os


def mask_maker(aligned_image_name, mask_dir):
# def mask_maker(fileDir + fileName):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

    # img = cv2.imread(fileDir + fileName)
    img = cv2.imread(aligned_image_name)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    try:
        for x, y, w, h in faces:                       # 얼굴 x좌표, y좌표, 가로길이, 세로길이
            cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)

            face_gray = gray[y: y + h, x: x + w]
            face_color = img[y: y + h, x: x + w]

            eyes = eye_cascade.detectMultiScale(face_gray, scaleFactor=2.3, minSize=(85, 85), maxSize=(95, 95))
            # 눈만 잘 찾도록 값 조정

            for (ex, ey, ew, eh) in eyes:               # 눈 x좌표, y좌표, 가로길이, 세로길이
                cv2.rectangle(face_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)

        eyes_loc = eyes + [[x, y, 0, 0]]                # 눈의 좌표가 얼굴 내부 기준이므로 얼굴좌표를 더해줌

        mask_loc = eyes_loc[eyes_loc[:, 1] < 500] - [[50, 40, 0, 0]]        # 눈이 있을 높이 내에서만 (입 인식 방지), 마스킹 잘 되도록 적절한 위치로 조정

        # Mask 생성
        mask = Image.open('../image_2_style_gan/source/mask_origin/mask_circle_blur.jpg')                 # 이미지 파일과 동일한 디렉토리
        resized_mask = mask.resize((mask_loc[0, 2] * 2, mask_loc[0, 2] * 2))        # 인식된 눈 사이즈 * 2

        back = Image.new("L", (1024, 1024))                                 # 검정색 1024 x 1024 배경 생성
        for index in range(len(mask_loc)):
            if len(mask_loc) == 1:                                          # 눈이 하나만 인식되면 중앙을 기준으로 y축 대칭 생성
                back.paste(im=resized_mask, box=(mask_loc[index, 0], mask_loc[index, 1]))
                back.paste(im=resized_mask, box=(1024 - mask_loc[index, 0] - mask_loc[index, 2] * 2, mask_loc[index, 1]))
            else:
                back.paste(im=resized_mask, box=(mask_loc[index, 0], mask_loc[index, 1]))
        back.save(mask_dir + 'Mask.png')                          # Mask 파일 생성

    except IndexError:
        pass    # 눈이 인식되지 않을 시 pass
    except TypeError:
        pass    # 눈이 인식되지 않을 시 pass
    except UnboundLocalError:
        pass    # 눈이 인식되지 않을 시 pass


def precision_eye_masks(aligned_image_name, mask_dir):
    FACIAL_LANDMARKS_INDEXES = OrderedDict([("Right_Eye", (36, 42)), ("Left_Eye", (42, 48))])
    # bias = [[-35, 0], [0, -30], [0, -30], [20, 0], [0, 5], [0, 5], [-20, 0], [0, -30], [0, -30], [35, 0], [0, 5], [0, 5]]
    bias = [[-40, 0], [-30, -27], [25, -27], [25, 0], [0, 10], [0, 10], [-20, 0], [-25, -27], [30, -27], [40, 0], [0, 10], [0, 10]]

    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor('../image_2_style_gan/landmark_model/shape_predictor_68_face_landmarks.dat')

    image = cv2.imread(aligned_image_name)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    rects = detector(gray, 1)

    for (i, rect) in enumerate(rects):
        shape = predictor(gray, rect)
        coordinates = np.zeros((68, 2), dtype=int)

        for i in range(0, 68):
            coordinates[i] = (shape.part(i).x, shape.part(i).y)

        mask_base = np.zeros((1024, 1024, 1))
        eyes_base = np.zeros((1024, 1024, 1))

        for (i, name) in enumerate(FACIAL_LANDMARKS_INDEXES.keys()):
            (j, k) = FACIAL_LANDMARKS_INDEXES[name]
            eyes = cv2.fillConvexPoly(eyes_base, coordinates[j:k], 255)
            mask_base = cv2.fillConvexPoly(mask_base, coordinates[j:k] + bias[0+(6*i):6+(6*i)], 255)        

        precision_mask = cv2.blur(mask_base,(15,18))
        cv2.imwrite(mask_dir + 'mask.png', precision_mask)
        cv2.imwrite(mask_dir + 'mask_net.png', eyes)
    
    return mask_dir + 'mask.png', mask_dir + 'mask_net.png'


def target_preprocessor(aligned_image_name, target_dir):
    FACIAL_LANDMARKS_INDEXES = OrderedDict([("Right_Eye", (36, 42)), ("Left_Eye", (42, 48))])
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor('../image_2_style_gan/landmark_model/shape_predictor_68_face_landmarks.dat')
    
    origin_image = cv2.imread(aligned_image_name)
    target_image = cv2.imread("../image_2_style_gan/source/target/" + os.listdir("../image_2_style_gan/source/target/")[0])

    if np.shape(target_image)[2] == 1:
        gray = target_image
        target_image = cv2.merge((target_image, target_image, target_image))
    else :
        gray = cv2.cvtColor(target_image, cv2.COLOR_BGR2GRAY)

    rects = detector(gray, 1)
    # cv2.imwrite('../image_2_style_gan/source/target_grayed.png', gray)
    for (i, rect) in enumerate(rects):
        shape = predictor(gray, rect)
        coordinates = np.zeros((68, 2), dtype=int)

        for i in range(0, 68):
            coordinates[i] = (shape.part(i).x, shape.part(i).y)
        
        mask_base = np.zeros((1024, 1024, 1))

        for (i, name) in enumerate(FACIAL_LANDMARKS_INDEXES.keys()):
            (j, k) = FACIAL_LANDMARKS_INDEXES[name]
            mask_base = cv2.fillConvexPoly(mask_base, coordinates[j:k], 1)
            mask_continv = 1 - mask_base
            # mask_base = cv2.merge((mask_base, mask_base, mask_base))
            # mmask_continv = cv2.merge((mask_continv, mask_continv, mask_continv))

    extrcd_img = origin_image[shape.part(37).y - 20 : shape.part(41).y + 20, shape.part(36).x - 20 : shape.part(39).x + 5] + 20
    if np.max(extrcd_img) > 255:
        extrcd_img = (extrcd_img/np.max(extrcd_img))*255

    cv2.imwrite('../image_2_style_gan/source/target_ref_color.png', extrcd_img)
    eyes_origin = target_image * mask_base
    cv2.imwrite('../image_2_style_gan/source/target_eyes.png', eyes_origin)
    target_image = match_histograms(target_image * mask_continv, extrcd_img, multichannel=True)/255
    target_image = equalize_adapthist(target_image, clip_limit=0.01)*255 + eyes_origin
    # target_image = target_image*255 + eyes_origin
    cv2.imwrite(target_dir + 'target.png', target_image)
    cv2.imwrite('../image_2_style_gan/source/target_histadj.png', target_image)

    return target_dir + 'target.png'


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='MaskMaker')
    parser.add_argument('--path', default="source/for_mask/")
    parser.add_argument('--filename', default="source/")
    
    args = parser.parse_args()
    
    precision_eye_masks(args.path + os.listdir(args.path)[0], args.filename)
