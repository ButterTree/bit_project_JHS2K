# 아직까지는 명령어만 사용해서 할 것.

## gunicorn.service 상황에 맞게 조절

- vi /etc/systemd/system/gunicorn.service

[Unit]
Description=Gunicorn instance to serve project
After=network.target

[Service]
User=tazo
Groups=tazo
WorkingDirectory=/home/tazo/Workspace/bit_project_JHS2K/API_for_Linux/connector
ExecStart=/usr/local/bin/gunicorn --workers 2 --bind unix:/home/tazo/Workspace/bit_project_JHS2K/API_for_Linux/server.sock center_api:application

[Install]
WantedBy=multi-user.target

---

## 접속 명령어

gunicorn center_api:app -b 192.168.1.44:45015 -w 2 -k gevent --timeout 120

## gunicorn 부팅시 데몬 온

sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo systemctl status gunicorn.service
