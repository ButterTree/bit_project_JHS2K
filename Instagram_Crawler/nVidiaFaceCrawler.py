def get_fake_face(saveDir):
    import urllib.request
    import time
    import cv2
    import os

    timeFlag = time.strftime('%Y%m%d', time.localtime(time.time()))
    url = 'https://www.thispersondoesnotexist.com/image'
    user_agent = "Chrome/86.0.4240.75"  # 본인이 사용할 브라우저의 정보를 입력해 주시기 바랍니다.
    request = urllib.request.Request(url, headers={'User-Agent': user_agent})

    i = 0

    while True:
        try:
            timeNow = time.strftime('%Y%m%d', time.localtime(time.time()))
            if int(timeFlag) < int(timeNow):
                timeFlag = timeNow
                i = 0

            html = urllib.request.urlopen(request).read()
            fileName = '{}{}_{}.jpg'.format(saveDir, timeFlag, i)
            buffer = open(fileName, 'wb')
            buffer.write(html)
            buffer.close()

            file = cv2.imread(fileName)
            pngName = '{}{}_{}.png'.format(saveDir, timeFlag, i)
            cv2.imwrite(pngName, file)
            os.remove(fileName)

            i += 1

        except Exception as e:
            print("Error Occurred at " + time.strftime('%m%d - %H:%M:%S', time.localtime(time.time())))
            print("Description = {}".format(e))
