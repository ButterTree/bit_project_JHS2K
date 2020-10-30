def eyes_cropper(indexedFaceNames, eyeDir, paddingFlag):
    from tqdm import tqdm
    import numpy as np
    import time
    import cv2

    coreNum, faceNames = indexedFaceNames

    timeFlag = time.strftime('%m%d-%H%M%S', time.localtime(time.time()))  # 모듈 작동 당시의 시각을 기억해 둡니다.(파일명에 활용하기 위함)
    eyeCascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    cnt = 0

    for faceName in tqdm(faceNames, desc="@Core {} - Cropping Eyes From Face".format(coreNum)):
        try:
            faceFile = cv2.imread(faceName)
            faceGray = cv2.cvtColor(faceFile, cv2.COLOR_BGR2GRAY)
            faceRes = int(np.shape(faceFile)[0])

            if faceName[:1] == 0:
                minSizeArg, maxSizeArg = int(faceRes * 0.166), int(faceRes * 0.2344)
            else:
                minSizeArg, maxSizeArg = int(faceRes * 0.075), int(faceRes * 0.1)

            dtcdEyes = eyeCascade.detectMultiScale(
                faceGray, scaleFactor=1.3, minSize=(minSizeArg, minSizeArg), maxSize=(maxSizeArg, maxSizeArg))
            _, y, _, h = dtcdEyes[1]

            # pixSize = np.array(pixSize).T
            # idxMax = np.argmin(pixSize[1])
            # y = pixSize[0][idxMax]
            # h = pixSize[1][idxMax]

            croppedEye = faceFile[y:y + h, :]
            eyeFileName = '{}Eyes_{}_{}_{}_{}.png'.format(eyeDir, timeFlag, coreNum, faceRes, str(cnt))

            if paddingFlag == 1:
                imgH, imgW, imgCh = faceFile.shape
                upperDummyBase = np.zeros((imgH - (h + y), imgW, imgCh), dtype=np.uint8)
                lowerDummyBase = np.zeros((y, imgW, imgCh), dtype=np.uint8)
                croppedEye = np.append(lowerDummyBase, croppedEye, axis=0)
                croppedEye = np.append(croppedEye, upperDummyBase, axis=0)
                # dummyBase = np.zeros((imgH - h, imgW, imgCh), dtype=np.uint8)
                # croppedEye = np.insert(dummyBase, y + h, croppedEye, axis=0)
                eyeFileName = '{}EyesSQR_{}_{}_{}_{}.png'.format(eyeDir, timeFlag, coreNum, faceRes, str(cnt))

            cv2.imwrite(eyeFileName, croppedEye)
            cnt += 1
        except Exception as e:
            continue

    return cnt
