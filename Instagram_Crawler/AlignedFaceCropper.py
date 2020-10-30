def aligned_face_cropper(indexedFileNames, crpFileDir, imgRes, scope):
    from tqdm import tqdm
    import matplotlib.pyplot as plt
    import dlib
    import time

    cnt = 0
    coreNum, fileNames = indexedFileNames
    # leaveFlag = not bool(coreNum)
    # print(leaveFlag, coreNum)

    timeFlag = time.strftime('%m%d-%H%M%S', time.localtime(time.time()))   # 모듈 작동 당시의 시각을 기억해 둡니다.(파일명에 활용하기 위함)
    shapePrd = dlib.shape_predictor('D:/HSH/Model/shape_predictor_68_face_landmarks.dat')   # 학습된 형태 예측기의 모델 파일을 불러옵니다.
    faceDtcr = dlib.get_frontal_face_detector()   # 얼굴 정면을 탐지하는 dlib의 Method를 변수화해 줍니다.
    faceDirs = []

    # 특정 폴더 내 사진들의 이름 리스트인 'fileNames'의 내용에 따라 이미지를 불러온 후, 컨테이너에 적재합니다.
    for fileName in tqdm(fileNames, desc="@Core {} - Aligning & Cropping".format(coreNum)):
        saveCnt = 0
        if plt.imread(fileName).shape[0] < 600:
            continue
        imgLoaded = dlib.load_rgb_image(fileName)   # 파일을 RGB Color 이미지로 불러옵니다.
        dtcdFaces = faceDtcr(imgLoaded, 1)   # 불러온 이미지에서 얼굴(들)을 탐지해 변수에 저장합니다.
        objects = dlib.full_object_detections()    # 탐지해 낸 랜드마크 포인트들을 담을 변수를 선언합니다.

        for dtcdFace in dtcdFaces:  # 찾은 얼굴 부분 안에서 모델을 이용해 랜드마크 포인트들을 탐지합니다.
            if dtcdFace.right() - dtcdFace.left() < 200:
                continue

            shape = shapePrd(imgLoaded, dtcdFace)
            objects.append(shape) # 찾아낸 포인트들의 정보를, 앞서 선언해 둔 변수에 적재합니다.

        # for i, face_rect in enumerate(detected_faces):
        #     width = face_rect.right() - face_rect.left()
        #     height = face_rect.bottom() - face_rect.top()

        for res in imgRes:
            saveCnt = 0
            dir = '{}{}/'.format(crpFileDir, str(res))
            try:
                # 탐지한 포인트 정보와 주어진 Parameter 값들을 가지고 얼굴을 바르게 정렬한 후 잘라낸 다음, 적재합니다.
                face = dlib.get_face_chips(imgLoaded, objects, size=res, padding=scope)
                # 앞서 추출한 얼굴을 png 파일로 출력합니다. 동일 인물의 중복을 방지하기 위해 한 사진 당 얼굴 하나씩만 출력합니다.
                fileDir = '{}{}_Aligned_{}_{}_{}_{}.png'.format(dir, int(scope), timeFlag, coreNum, res, cnt)
                dlib.save_image(face[0], fileDir)
                faceDirs.append(fileDir)
                saveCnt += 1
            except Exception as e:
                break

        cnt += saveCnt

    return faceDirs, cnt  # 출력한 파일들의 수를 호출측에 반환합니다.
