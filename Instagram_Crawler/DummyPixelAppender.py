def dummy_pixel_appender(srcDir, dstDir, paddingFlag):
    from tqdm import tqdm
    import numpy as np
    import cv2
    import os

    fileNames = os.listdir(srcDir)
    cnt = 0

    for fileName in tqdm(fileNames, desc='Padding Dummy Pixels to Image'):
        faceFile = cv2.imread(srcDir + fileName)
        imgY, imgX, imgCh = faceFile.shape
        dummyPixel = np.zeros((imgX - imgY, imgX, imgCh), dtype=np.uint8)

        if paddingFlag == 0:
            padded = np.append(dummyPixel, faceFile, axis=0)
        else:
            padded = np.append(faceFile, dummyPixel, axis=0)

        cv2.imwrite('{}{}.png'.format(dstDir, fileNames.index(fileName)), padded)
        cnt += 1

    return cnt
