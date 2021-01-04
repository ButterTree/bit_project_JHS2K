# GroupWork - Make your eyes double eyelids



## 🔹프로젝트 목표 

- 무쌍꺼풀인 사용자가 자신의 사진을 업로드하면 쌍꺼풀이 생긴 모습으로 자연스럽게 보여주는 것.
- 성형 수술 상담이나 수술을 받지 않고도 본인 스스로 수술 유무와 결과를 판단 할 수 있어 시간적 고민을 덜어준다.


## 👋 팀구성

- 팀장
  - 손진수
- 팀원
  - 정상준 
  - 홍승현
  - 김혁
  - 강민주



## 🔶기술 스택

- DeepLearning

  - Image2styleGAN
  - StyleGAN1
  - StyleGAN2
  - StarGAN
  - BeautyGAN
  - DFDNet (이미지 화질 향상)
  - First-Order-Model (이미지 동적화)
    

- Python 3.x

  - openCV
  - Crawling
    

- HTML / CSS / JS

- API

- Flask

- Linux (ubuntu 18.04, CentOS 7)

- ...

  

## 🔶프로젝트 기간

​	🔶 10월 4주 ~ 12월 5주

​	🔶 12주 가량의 기간



## 📃 프로젝트 설명

#### 📢 차별점

쌍꺼풀 수술에 관한 후기나 할인 이벤트들을 모아놓은 사이트나 어플은 많이 있지만 우리는 직접 성형외과에 발걸음을 해야하고 의사가 손으로 그려주는 그림과 내가 아닌 사람들의 수술 결과만으로 짐작하여 상담을 받아야한다. 이 프로젝트는 <u>**현재 사용자의 모습을 기반**</u>으로 쌍꺼풀을 생성해주는 이미지를 제공하고 더 나아가 원하는 스타일을 다양하게 골라 결과를 즉시 받아 볼 수 있다.


```
├── connector
│   ├── gpu_task
│   ├── img_processing_manage
│   └── result_manage
├── image_2_style_gan
│   ├── dnnlib
│   ├── latent_W
│   ├── mask_makers
│   └── source
└── locust

10 directories
    /mnt/d/bit_project_JHS2K/API_for_Linux    model_only_eyes *1  tree -N -L 2 -d -I "node_modules|locust"       ✔  16:38:02  
.
├── connector
│   ├── gpu_task
│   ├── img_processing_manage
│   └── result_manage
└── image_2_style_gan
    ├── dnnlib
    ├── latent_W
    ├── mask_makers
    └── source

9 directories
    /mnt/d/bit_project_JHS2K/API_for_Linux    model_only_eyes *1  tree -N -L 3 -I "locust"                       ✔  16:38:13  
.
├── README.md
├── connector
│   ├── README.md
│   ├── __init__.py
│   ├── app.py
│   ├── gpu_task
│   │   └── model_task.py
│   ├── img_processing_manage
│   │   ├── path_manager.py
│   │   ├── save_photo.py
│   │   └── transform_manager.py
│   ├── requirements.txt
│   ├── result_manage
│   │   └── result_processing.py
│   └── wsgi.py
├── dump.rdb
└── image_2_style_gan
    ├── README.txt
    ├── __init__.py
    ├── align_images.py
    ├── color_channel_manipulator.py
    ├── dnnlib
    │   ├── __init__.py
    │   ├── submission
    │   ├── tflib
    │   └── util.py
    ├── encode_image.py
    ├── face_alignment.py
    ├── facial_exchange.py
    ├── image_crossover_eyes.py
    ├── image_crossover_face.py
    ├── image_morphing.py
    ├── landmarks_detector.py
    ├── latent_W
    │   └── crossover.npy
    ├── make_morphgif.py
    ├── mask_makers
    │   ├── mask_maker.py
    │   ├── precision_facial_mask_maker.py
    │   └── source
    ├── perceptual_model.py
    ├── random_noise_image.py
    ├── read_image.py
    ├── semantic_edit.py
    ├── source
    │   ├── mask_origin
    │   ├── noise
    │   ├── ref_mask
    │   ├── target
    │   └── target_reservoir
    ├── stylegan_layers.py
    └── weight_convert.py
```
