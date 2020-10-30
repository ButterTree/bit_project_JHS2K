def face_cropper(fileNames, crpFileDir):
    from tqdm import tqdm
    import matplotlib.pyplot as plt
    import cv2
    import time

    timeFlag = time.strftime('%m%d-%H%M%S', time.localtime(time.time()))

    faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    # eyeCascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    cnt = 0

    for fileName in tqdm(fileNames, desc="Cropping Face from Images"):
        if plt.imread(fileName).shape[0] < 600:
            continue
        imgBuffer = cv2.imread(fileName)
        gray = cv2.cvtColor(imgBuffer, cv2.COLOR_BGR2GRAY)
        faces = faceCascade.detectMultiScale(gray, scaleFactor=1.01, minNeighbors=30, minSize=(256, 256))
        sizeCompare = []

        if len(faces) != 0:
            for x, y, w, h in faces:
                sizeCompare.append(str(w * h))
        else:
            continue

        if len(sizeCompare) == 1:
            x, y, w, h = faces[0]
        else:
            x, y, w, h = faces[sizeCompare.index(max(sizeCompare))]

        cropped = imgBuffer[y:y + h, x:x + w]
        crpFileName = '{}Face_{}_{}.png'.format(crpFileDir, timeFlag, str(cnt))
        cv2.imwrite(crpFileName, cropped)
        cnt += 1

    return cnt
