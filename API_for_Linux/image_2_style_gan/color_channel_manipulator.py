from image_2_style_gan.read_image import image_reader_color
from image_2_style_gan.align_images import align_images
from torchvision.utils import save_image
import numpy as np
import argparse
import torch
import os

ch_color_mean = []

def channel_manipulator(src_dir, trg_dir):
    raw_img_file_name = os.listdir(src_dir)[0]
    raw_image = image_reader_color(src_dir + raw_img_file_name)

    for i in range(3):
        ch_color_mean.append(torch.mean(raw_image[:, :, i]))

    idx_min = ch_color_mean.index(min(ch_color_mean))
    idx_max = ch_color_mean.index(max(ch_color_mean))
    bias = (max(ch_color_mean) - min(ch_color_mean))

    print(min(ch_color_mean))
    print(max(ch_color_mean))
    print(bias)
    raw_image -= bias * 10

    save_image(torch.clamp(raw_image, 0, 1), trg_dir + '00.png')

    return raw_image


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Source_dir, Target_dir')
    parser.add_argument('--src_dir', default='images/raw/')
    parser.add_argument('--cm_dir', default='images/ch_matched/')
    parser.add_argument('--trg_dir', default='images/aligned/')
    parser.add_argument('--crop', default=False)
    args = parser.parse_args()

    src_dir = args.src_dir
    cm_dir = args.cm_dir
    trg_dir = args.trg_dir
    crop_flag = args.crop

    if not os.path.isdir(src_dir):
            os.makedirs(src_dir, exist_ok=True)

    if not os.path.isdir(cm_dir):
            os.makedirs(cm_dir, exist_ok=True)

    if not os.path.isdir(trg_dir):
            os.makedirs(trg_dir, exist_ok=True)

    channel_manipulator(src_dir, cm_dir)
    if crop_flag:
        align_images(cm_dir, trg_dir)