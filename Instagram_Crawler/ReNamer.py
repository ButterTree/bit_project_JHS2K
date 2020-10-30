def file_renamer(srcDir, dstDir):
    from tqdm import tqdm
    import os

    files = os.listdir(srcDir)
    count = 0

    for file in tqdm(files):
        newName = 'sorted_0' + str("{0:06d}".format(count)) + '.png'
        srcName = srcDir + file
        dstName = dstDir + newName

        try:
            os.rename(srcName, dstName)
            count += 1
        except FileExistsError as e:
            flag = 0
            while flag == 0:
                count += 1
                newName = 'sorted_0' + str("{0:06d}".format(count)) + '.png'
                dstName = dstDir + newName
                try:
                    os.rename(srcName, dstName)
                    count += 1
                    flag = 1
                except FileExistsError as e:
                    continue

    print("Total Renamed Count : {} files".format(count))
