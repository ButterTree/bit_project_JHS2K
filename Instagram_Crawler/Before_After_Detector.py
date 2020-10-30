def before_after_detector(indexedFileNames, baDir):
    from tqdm import tqdm
    import numpy as np
    import time
    import cv2

    coreNum, fileNames = indexedFileNames
    timeFlag = time.strftime('%m%d-%H%M%S', time.localtime(time.time()))  # 모듈 작동 당시의 시각을 기억해 둡니다.(파일명에 활용하기 위함)
    eyeCascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    cnt = 0

    for fileName in tqdm(fileNames, desc="@Core {} - Cropping Target Object From Image".format(coreNum)):
        faceFile = cv2.imread(fileName)
        faceGray = cv2.cvtColor(faceFile, cv2.COLOR_BGR2GRAY)
        pixCoord = []

        try:
            dtcdEyes = eyeCascade.detectMultiScale(faceGray, scaleFactor=1.3, minSize=(70, 70), maxSize=(75, 75))

            if len(dtcdEyes) == 4:
                for x, y, w, h in dtcdEyes:
                    pixCoord.append([x, y, w, h])

                pixCoord = list(np.array(pixCoord).T)
                x = min(pixCoord[0])
                y = min(pixCoord[1])
                w = max(pixCoord[0]) + max(pixCoord[2])
                h = max(pixCoord[1]) + max(pixCoord[3])

                croppedEye = faceFile[y:h, x:w]

                eyeFileName = '{}BA_{}_{}_{}.png'.format(baDir, timeFlag, coreNum, str(cnt))
                cv2.imwrite(eyeFileName, croppedEye)
                cnt += 1
        except Exception as e:
            continue

    return cnt