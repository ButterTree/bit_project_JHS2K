import argparse
import random
import torch
import os
from torchvision.utils import save_image


def random_pixel_image(trg_dir, min_float=0.0, max_float=1.0):
    random_tensor = torch.rand((1, 3, 1024, 1024))
    random_tensor = torch.clamp(random_tensor, min_float, max_float)
    
    save_image(random_tensor, trg_dir + 'random_noise.png')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Target_dir, min_flt(float), max_flt(float)')
    parser.add_argument('--trg_dir', default='images/aligned/')
    parser.add_argument('--min_flt', default=0.0)
    parser.add_argument('--max_flt', default=1.0)
    args = parser.parse_args()

    trg_dir = args.trg_dir
    min_float = args.min_flt
    max_float = args.max_flt

    if not os.path.isdir(trg_dir):
            os.makedirs(trg_dir, exist_ok=True)

    random_pixel_image(trg_dir, min_float, max_float)