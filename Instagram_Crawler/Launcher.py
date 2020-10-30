from Crawler.nVidiaFaceCrawler import get_fake_face as gff
from Crawler.InstaImageCrawler import insta_image_crawler_main as ic
from Crawler.AlignedFaceCropper import aligned_face_cropper as afc
from Crawler.DummyPixelAppender import dummy_pixel_appender as dpa
from Crawler.Before_After_Detector import before_after_detector as bfd
from Crawler.FaceCropper import face_cropper as fc
from Crawler.EyesCropper import eyes_cropper as ec
from Crawler.ReNamer import file_renamer as fr
import multiprocessing as mp
import numpy as np
import parmap
import time
import os

# Multi-Processing에 활용할 코어 갯수의 기본값을 설정합니다. 기본값은 해당 PC의 CPU 코어 수의 1/2입니다.
cores = int(mp.cpu_count() / 2)


# nVidia의 초상권이 없는 Fake Face를 무한정 수집합니다.
def nVidia_crawler():
    saveDir = 'D:/Downloaded/nVidiaFace/'
    if os.path.isdir(saveDir) is not True:
        os.mkdir(saveDir)
    gff(saveDir)


def insta_crawler():
    baseUrl = 'https://www.instagram.com/explore/tags/'
    tags = input('검색할 태그 입력 [다수 입력 시 콤마(",")로 구분] : ').replace(" ", "").split(",")  # Tag를 입력받습니다.
    # 공백이 입력되거나, ",,,,,"등으로 콤마만 입력될 경우, 오류는 발생하지 않지만 최소 1회/최대 "콤마 갯수+1"회 만큼 헛돈 후, 사진 저장 없이 종료됩니다.
    urls = []

    for tag in tags:
        urls.append(baseUrl + tag + '/')

    tagAndUrls = list(zip(tags, urls))

    while True:  # 스크롤을 반복할 횟수는 자연수만 입력받도록 제한하였습니다.
        iteration = int(input('스크롤을 반복할 횟수 지정 [0 초과 자연수만 입력하세요!] : '))
        if iteration > 0:
            break
        else:
            print("\nInvalid input : Natural Number ONLY!! Try again.\n")
            continue

    imgDir = 'D:/Downloaded/InstaIMG/'
    _, cnt = ic(tagAndUrls, imgDir, iteration)
    print("Total Images Saved : {}\n".format(cnt))


def insta_aligned_face_crawler():
    baseUrl = 'https://www.instagram.com/explore/tags/'
    tags = input('검색할 태그 입력 [다수 입력 시 콤마(",")로 구분] : ').replace(" ", "").split(",")  # Tag를 입력받습니다.
    # 공백이 입력되거나, ",,,,,"등으로 콤마만 입력될 경우, 오류는 발생하지 않지만 최소 1회/최대 "콤마 갯수+1"회 만큼 헛돈 후, 사진 저장 없이 종료됩니다.
    interval, paddingFlag, resFlag, scope, flag = 0, 0, 0, 0, 1
    urls, imgRes = [], []

    for tag in tags:
        urls.append(baseUrl + tag + '/')

    tagAndUrls = list(zip(tags, urls))

    while True:  # 스크롤을 반복할 횟수는 자연수만 입력받도록 제한하였습니다.
        iteration = int(input('스크롤을 반복할 횟수 지정 [0 초과 자연수만 입력하세요!] : '))
        if iteration > 0:
            break
        else:
            print("\nInvalid input : Natural Number ONLY!! Try again.\n")
            continue

    while resFlag == 0:  # 정렬해 Crop한 얼굴 이미지의 출력 해상도를 선택할 수 있도록 합니다.
        imgResFlags = input(
            '얼굴 이미지의 출력 해상도(Pixel) 지정\n[복수입력 가능 >> 0 : 256*256 / 1 : 512*512 / 2 : 1024*1024] : ').replace(
            " ", "").split(",")
        resFlag = 1
        for imgResFlag in imgResFlags:
            if int(imgResFlag) in range(0, 3):
                if imgResFlag == '0':
                    imgRes.append(256)
                elif imgResFlag == '1':
                    imgRes.append(512)
                else:
                    imgRes.append(1024)
            else:
                print("[ 0, 1, 2 ] ONLY!!! Try Again.")
                resFlag = 0
                break

    while True:
        scopeFlag = int(input('이미지에 나타낼 범위를 지정 [0 : 이목구비 확대 / 1 : 머리 전체 및 어깨 상단] : '))
        if scopeFlag in range(0, 2):
            if scopeFlag == 0:
                scope = 0.1
            else:
                scope = 1
            break
        else:
            print("[ 0, 1 ] ONLY!!! Try Again.")
            continue

    while True:
        eyeFlag = int(input('얼굴에서 눈 부분만을 따로 Crop합니다 [0 : 아니오 / 1 : 예] : '))
        if eyeFlag == 1 or eyeFlag == 0:
            if eyeFlag == 1:
                while True:
                    paddingFlag = int(input('눈을 제외한 나머지 부분을 Padding합니다 [0 : 아니오 / 1 : 예] : '))
                    if paddingFlag == 1 or paddingFlag == 0:
                        break
                    else:
                        print("[ 0 or 1 ] ONLY!!! Try Again.")
            break
        else:
            print("[ 0 or 1 ] ONLY!!! Try Again.")

    while True:
        autoFlag = int(input('수동 정지 시까지 자동으로 단위 시간마다 Crawling을 실시합니다. [0 : 한 번만 작동 / 1 : 자동 지속] : '))
        if autoFlag == 1 or autoFlag == 0:
            if autoFlag == 1:
                while True:
                    intervalSwitch = int(input('Crawling 간격(단위시간) [0 : 3시간 / 1 : 6시간 / 2 : 12시간 / 3 : 24시간] : '))
                    if intervalSwitch in range(0, 4):
                        if intervalSwitch == 0:
                            interval = 3
                        elif intervalSwitch == 1:
                            interval = 6
                        elif intervalSwitch == 2:
                            interval = 12
                        else:
                            interval = 24
                        break
                    else:
                        print("[ 0, 1, 2 ] ONLY!!! Try Again.")
            break
        else:
            print("[ 0 or 1 ] ONLY!!! Try Again.")

    while flag != 0:
        imgDir = 'D:/Downloaded/InstaIMG/'
        fileNames, _ = ic(tagAndUrls, imgDir, iteration)

        crpFileDir = 'D:/Downloaded/InstaFace/'
        for res in imgRes:
            dir = '{}{}/'.format(crpFileDir, str(res))
            if os.path.isdir(dir) is not True:
                os.mkdir(dir)
        indexedFileNames = list(enumerate(np.array_split(fileNames, cores)))
        faceNames = []
        cnt = 0

        for faceNamesPerCore, cntPerCore in parmap.map(afc, indexedFileNames, crpFileDir, imgRes, scope):
            for faceName in faceNamesPerCore:
                faceNames.append(faceName)
            cnt += cntPerCore

        print("Total Face Cropped Count : {}\n".format(cnt))
        for fileName in fileNames:
            os.remove(fileName)

        if eyeFlag == 1:
            cnt = 0
            eyeDir = 'D:/Downloaded/InstaEyes/'
            if os.path.isdir(eyeDir) is not True:
                os.mkdir(eyeDir)
            indexedFaceNames = list(enumerate(np.array_split(faceNames, cores)))

            for cntPerCore in parmap.map(ec, indexedFaceNames, eyeDir, paddingFlag):
                cnt += cntPerCore
            print("Total Eyes Cropped Count : {}\n".format(cnt))

        flag = autoFlag
        if flag == 1:
            print("\n{}시간 후, 지정한 내용의 Crawling이 다시 수행됩니다.\n".format(interval))
        time.sleep(interval * 3600)


def before_after_detector():
    baseUrl = 'https://www.instagram.com/explore/tags/'
    tags = input('검색할 태그 입력 [다수 입력 시 콤마(",")로 구분] : ').replace(" ", "").split(",")  # Tag를 입력받습니다.
    # 공백이 입력되거나, ",,,,,"등으로 콤마만 입력될 경우, 오류는 발생하지 않지만 최소 1회/최대 "콤마 갯수+1"회 만큼 헛돈 후, 사진 저장 없이 종료됩니다.
    urls = []

    for tag in tags:
        urls.append(baseUrl + tag + '/')

    tagAndUrls = list(zip(tags, urls))

    while True:  # 스크롤을 반복할 횟수는 자연수만 입력받도록 제한하였습니다.
        iteration = int(input('스크롤을 반복할 횟수 지정 [0 초과 자연수만 입력하세요!] : '))
        if iteration > 0:
            break
        else:
            print("\nInvalid input : Natural Number ONLY!! Try again.\n")
            continue

    imgDir = 'D:/Downloaded/InstaIMG/'
    if os.path.isdir(imgDir) is not True:
        os.mkdir(imgDir)
    fileNames, _ = ic(tagAndUrls, imgDir, iteration)

    baDir = 'D:/Downloaded/InstaB-A/'
    if os.path.isdir(baDir) is not True:
        os.mkdir(baDir)
    indexedFileNames = list(enumerate(np.array_split(fileNames, cores)))
    cnt = 0

    for cntPerCore in parmap.map(bfd, indexedFileNames, baDir):
        cnt += cntPerCore

    for fileName in fileNames:
        os.remove(fileName)

    print("Total Before-After Detected Count : {}\n".format(cnt))


def aligned_face_cropper():
    imgRes = []
    flag, cnt, scope = 0, 0, 0

    while flag == 0:  # 정렬해 Crop한 얼굴 이미지의 출력 해상도를 선택할 수 있도록 합니다.
        imgResFlags = input(
            '얼굴 이미지의 출력 해상도(Pixel) 지정\n[복수입력 가능 >> 0 : 256*256 / 1 : 512*512 / 2 : 1024*1024] : ').replace(" ", "").split(",")
        flag = 1
        for imgResFlag in imgResFlags:
            if int(imgResFlag) in range(0, 3):
                if imgResFlag == '0':
                    imgRes.append(256)
                elif imgResFlag == '1':
                    imgRes.append(512)
                else:
                    imgRes.append(1024)
            else:
                print("[ 0, 1, 2 ] ONLY!!! Try Again.")
                flag = 0
                break

    while True:
        scopeFlag = int(input('이미지에 나타낼 범위를 지정 [0 : 이목구비 확대 / 1 : 머리 전체 및 어깨 상단] : '))
        if scopeFlag in range(0, 2):
            if scopeFlag == 0:
                scope = 0.1
            else:
                scope = 1
            break
        else:
            print("[ 0, 1 ] ONLY!!! Try Again.")
            continue

    fileDir = "D:/Downloaded/InstaIMG/"
    fileNames = []
    for name in os.listdir(fileDir):
        fileNames.append(fileDir + name)

    crpFileDir = 'D:/Downloaded/InstaFace/'
    for res in imgRes:
        dir = '{}{}/'.format(crpFileDir, str(res))
        if os.path.isdir(dir) is not True:
            os.mkdir(dir)
    indexedFileNames = list(enumerate(np.array_split(fileNames, cores)))

    for _, cntPerCore in parmap.map(afc, indexedFileNames, crpFileDir, imgRes, scope):
        cnt += cntPerCore

    # for fileName in fileNames:
    #     os.remove(fileName)

    print("Total Face Cropped Count : {}\n".format(cnt))


def face_cropper():
    srcDir = "D:/Downloaded/InstaFace/"
    fileNames = []
    for name in os.listdir(srcDir):
        fileNames.append(srcDir + name)

    crpFileDir = 'D:/Downloaded/InstaFace/'
    if os.path.isdir(crpFileDir) is not True:
        os.mkdir(crpFileDir)

    cnt = fc(fileNames, crpFileDir)
    for fileName in fileNames:
        os.remove(fileName)
    print("Total Cropped Count : {}".format(cnt))


def eyes_cropper():
    imgRes = 256
    while True:  # Crop할 대상 얼굴 이미지의 해상도에 해당하는 폴더를 선택할 수 있도록 합니다.
        imgResFlag = int(input('대상 얼굴 이미지 해상도(Pixel) 폴더 선택 [0 : 256*256 / 1 : 512*512 / 2 : 1024*1024] : '))
        if imgResFlag in range(0, 3):
            if imgResFlag == 0:
                imgRes = 256
            elif imgResFlag == 1:
                imgRes = 512
            else:
                imgRes = 1024
            break
        else:
            print("[ 0, 1, 2 ] ONLY!!! Try Again.")
            continue

    srcDir = "D:/Downloaded/InstaFace/{}/".format(imgRes)
    faceNames = []
    for name in os.listdir(srcDir):
        faceNames.append(srcDir + name)

    eyeDir = 'D:/Downloaded/InstaEyes/'
    if os.path.isdir(eyeDir) is not True:
        os.mkdir(eyeDir)
    cnt = 0

    while True:
        paddingFlag = int(input('눈을 제외한 나머지 부분을 Padding합니다 [0 : 아니오 / 1 : 예] : '))
        if paddingFlag == 1 or paddingFlag == 0:
            break
        else:
            print("[ 0 or 1 ] ONLY!!! Try Again.")

    # cnt = ec(fileNames, eyeDir, paddingFlag)

    indexedFaceNames = list(enumerate(np.array_split(faceNames, cores)))

    for cntPerCore in parmap.map(ec, indexedFaceNames, eyeDir, paddingFlag):
        cnt += cntPerCore

    print("Total Eyes Cropped Count : {}\n".format(cnt))


def dummy_pixel_appender():
    srcDir = 'D:/Downloaded/InstaEyes/'
    dstDir = 'D:/Downloaded/InstaEyesSquared/'
    if os.path.isdir(dstDir) is not True:
        os.mkdir(dstDir)

    while True:
        paddingFlag = int(input('Padding할 부분을 설정합니다 [0 : 원본 이미지의 위 / 1 : 원본 이미지의 아래] : '))
        if paddingFlag == 1 or paddingFlag == 0:
            break
        else:
            print("[ 0 or 1 ] ONLY!!! Try Again.")

    cnt = dpa(srcDir, dstDir, paddingFlag)

    print("Total Squared Image Count : {}\n".format(cnt))


def renamer():
    srcDir = input('Input Source Directory [ex: D:/..../..../ ] >> ')
    dstDir = input('Input Target Directory [ex: D:/..../..../ ] >> ')
    if os.path.isdir(dstDir) is not True:
        os.mkdir(dstDir)
    fr(srcDir, dstDir)


def main():
    runFlag = 1
    while runFlag == 1:
        inputFlag = 0
        launchCode = []
        while inputFlag == 0:
            try:
                launchCode = input('사용할 기능의 번호를 선택하세요.\n'
                                   '[다수 입력 시 콤마(",")로 구분되며, 입력한 순서대로 순차 실행됩니다.]\n\n'
                                   '1 : nVidia Fake Face Crawler\n'
                                   '2 : Instagram #Tag Image Crawler\n'
                                   '3 : Automated Instagram #Tag Pre-Processed Image Crawler\n'
                                   '4 : Instagram Eyelid Surgery Before-After Image Crawler\n'
                                   '5 : Dlib Aligned Face Cropper\n'
                                   '6 : openCV Face Cropper\n'
                                   '7 : openCV Eyes Cropper\n'
                                   '8 : Dummy Pixel Appender(= Image Squaring)\n'
                                   '9 : Multiple File Re-Namer\n'
                                   '0 : Exit Launcher\n\n'
                                   '위 목록에 해당하는 번호만 입력해 주십시오 : ').replace(" ", "").split(",")
                inputFlag = 1
                for code in launchCode:
                    if int(code) not in range(0, 10):
                        print('\nERROR : Invalid Input!!! Try Again.\n\n')
                        inputFlag = 0
                        break
            except Exception as e:
                print('\nERROR : Invalid Input!!! Try Again.\n\n')
                inputFlag = 0

        for code in launchCode:
            if int(code) == 1:
                nVidia_crawler()
            elif int(code) == 2:
                insta_crawler()
            elif int(code) == 3:
                insta_aligned_face_crawler()
            elif int(code) == 4:
                before_after_detector()
            elif int(code) == 5:
                aligned_face_cropper()
            elif int(code) == 6:
                face_cropper()
            elif int(code) == 7:
                eyes_cropper()
            elif int(code) == 8:
                dummy_pixel_appender()
            elif int(code) == 9:
                renamer()
            else:
                runFlag = 0


if __name__ == '__main__':
    main()
