from bs4 import BeautifulSoup
from selenium import webdriver
from urllib.request import urlopen
from tqdm import tqdm
import multiprocessing as mp
import numpy as np
import parmap
import time

cores = int(mp.cpu_count())


def image_saver(indexedImgList, imgDir):
    timeFlag = time.strftime('%m%d-%H%M%S', time.localtime(time.time()))
    coreNum, imgList = indexedImgList
    fileNames = []
    cnt = 0

    for i, img in tqdm(enumerate(imgList), total=len(imgList),
                    desc="@Core {} - Saving Crawled Images".format(coreNum)):  # List로 가져온 Url에 대해, 이미지를 얻어내 파일로 저장합니다.
        try:
            fileName = '{}_{}_{}.jpg'.format(imgDir + timeFlag, coreNum, i)
            imgSrc = urlopen(img).read()
            buffer = open(fileName, "wb")
            buffer.write(imgSrc)
            buffer.close()

            fileNames.append(fileName)
            cnt += 1

        except Exception as e:
            print("\nError Occurred at " + time.strftime('%m%d - %H:%M:%S', time.localtime(time.time())))
            print("Description = {}".format(e))
            pass

    return fileNames, cnt


def image_crawler(indexedtagAndUrls, iteration, sleepTimeBias):
    # 크롬 자동 실행 시, 크롬 창이 뜨며 다른 작업을 방해하는 것을 방지하기 위해 백그라운드에서 실행되도록 하는 옵션 설정 부분.
    option = webdriver.ChromeOptions()
    option.add_argument("headless")

    coreNum, tagAndUrls = indexedtagAndUrls
    imgList = []  # 이미지 파일을 누적할 배열을 선언.

    for tag, url in tagAndUrls:  # 태그가 여러 개일 경우, 태그 수 만큼 반복 작동합니다.
        driver = webdriver.Chrome(options=option)   # driver로 크롬을 기동합니다.
        driver.get(url)
        time.sleep(5)  # 페이지가 온전히 Load 되도록 잠시 기다려 줍니다.

        page = []   # 매 스크롤 때마다의 새 페이지 정보를 담을 배열을 선언.
        tryCount = 0   # 스크롤다운 재시도 카운트를 초기화합니다.

        for itr in tqdm(range(0, iteration), desc=("@Core {} - Scrolling ({})".format(coreNum, tag))):  # 입력한 스크롤 반복 횟수만큼 반복문을 수행할 것입니다.
            if page == BeautifulSoup(driver.page_source, 'html.parser').select('.v1Nh3.kIKUG._bz0w'):  # "page"는 select()의 Parameter에 해당하는 HTML <Class>의 정보를 가져옵니다.
                # 만약 스크롤다운 이후의 page 값이 이전 내용과 같다면(스크롤 이전과 이후의 값이 같다면), 스크롤 오류일 가능성이 있으므로 다시 시도합니다.
                if tryCount == 5:
                    print("\nScrolling is Finished Early : End of Scroll")
                    break  # 지정된 횟수까지 시도해도 변화가 없을 경우, 안내 메시지를 출력한 후 스크롤을 조기 종료합니다.

                # 스크롤을 다시 시도한 후, tryCount 값을 증가시키고 "page"를 갱신하여 다음으로 진행합니다.
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(5)
                tryCount += 1
                page = BeautifulSoup(driver.page_source, 'html.parser').select('.v1Nh3.kIKUG._bz0w')

            else:
                tryCount = 0  # 새 page가 로드되면 스크롤 재시도 횟수를 초기화합니다.
                # 스크롤한 후, 새 이미지가 Load 되면 "page"를 갱신하고 진행합니다.
                page = BeautifulSoup(driver.page_source, 'html.parser').select('.v1Nh3.kIKUG._bz0w')

                try:
                    for i in page:
                        imgUrl = i.select_one('.KL4Bh').img['src']  # 가져올 img Url을 얻어냅니다.
                        imgList.append(imgUrl)  # 리스트에 해당 Url을 적재합니다.
                except Exception as e:  # 모종의 오류가 발생하더라도, 당시까지 모은 image DATA의 증발을 방지하기 위해, 멈추지 않고 계속 진행합니다.
                    print("\nError Occurred at " + time.strftime('%m%d - %H:%M:%S', time.localtime(time.time())))
                    print("Error = {}".format(e))
                    pass

                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")  # 스크롤 다운을 수행합니다.
                time.sleep(3 + sleepTimeBias)  # 스크롤 다운 후, 이미지가 모두 온전히 Load 되도록 잠시 기다립니다.

        driver.close()  # 측정 Tag값에 대해, 스크롤 끝까지의 이미지 Url을 얻어와 적재하는 과정을 마치면, 크롬을 종료합니다.

    imgList = list(set(imgList))  # 적재된 사진들 간의 중복을 제거합니다.

    return imgList


def insta_image_crawler_main(tagAndUrls, imgDir, iteration):
    imgList = []

    while True:
        if len(tagAndUrls) <= cores:
            indexedtagAndUrls = list(enumerate(np.array_split(tagAndUrls, len(tagAndUrls))))
            sleepTimeBias = len(tagAndUrls) * 0.5
            for imgListPerCore in parmap.map(image_crawler, indexedtagAndUrls, iteration, sleepTimeBias):
                for img in imgListPerCore:
                    imgList.append(img)
            break
        else:
            indexedtagAndUrls = list(enumerate(np.array_split(tagAndUrls[0:8], cores)))
            del tagAndUrls[0:8]
            sleepTimeBias = cores * 0.5
            for imgListPerCore in parmap.map(image_crawler, indexedtagAndUrls, iteration, sleepTimeBias):
                for img in imgListPerCore:
                    imgList.append(img)

    indexedImgList = list(enumerate(np.array_split(list(set(imgList)), cores)))
    fileNames = []
    cnt = 0

    for fileNamesPerCore, cntPerCore in parmap.map(image_saver, indexedImgList, imgDir):
        for fileName in fileNamesPerCore:
            fileNames.append(fileName)
        cnt += cntPerCore

    return fileNames, cnt
