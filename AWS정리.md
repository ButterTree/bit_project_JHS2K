## AWS

계정 ID : 088944302557
사용자 이름 : jinsoo_son
Passwd : Bit0*1(2biT
private key : 파일로 받아야함

---

## 접속 순서

1. https://088944302557.signin.aws.amazon.com/console
2. 들어가서 로그인을 하면 MFA키를 달라고 하는데 생성기가 일단 진수형한테만 있어서 물어봐야함...
3. 접속완료
4. 인스턴스를 누르면 굿닥 인스턴스를 포함해 3개정도가 있다. 
5. 우리 인스턴스 이름은 bitproject어쩌구 저쩌구...
6. 연결을 누르고 연결 방식을 SSH로 한다.
7. 그다음 건네받은 프라이빗키를 ```sudo chmod 400 default-keypair.pem```해서 권한을 바꾼다.
8. 아래 ssh 명령어로 접속 안되면 sudo로 하면 됨.

---

## 포트 및 방화벽 설정

### AWS

- 포트를 열어주려면 인바운드 아웃바운드 규칙이라는 것을 작성해줘야하는데 각각이 무엇을 의미하는지는 아래와 같다.

> **인바운드**
> 내부를 향하는 것, 서버 내부로 들어오는 것으로써 보통 클라이언트가 서버로 보내는 모양이다. 기본적으로 윈도우에서는 모든 접속이 차단되어있다.

>**아웃바운드**
>바깥으로 향하는 것. 서버에서 클라이언트로 보내는 모양이다. 보통은 나가는 신호는 모든 접속을 허용해 놓는다.

- 아웃바운드는 특별하게 해줄게 없고 인바운드만 정해주면 된다.

~~~
# 모든 아이피 허용의 형태인거 같다. 
# 두개씩 추가해주면 됨.
포트 	   프로토콜 원본         보안그룹
80		TCP		0.0.0.0/0	CentOS 7 -x86_64- - with Updates HVM-2002_01-AutogenByAWSMP-
80		TCP		::/0		CentOS 7 -x86_64- - with Updates HVM-2002_01-AutogenByAWSMP-
8000	TCP		0.0.0.0/0	CentOS 7 -x86_64- - with Updates HVM-2002_01-AutogenByAWSMP-
8000	TCP		::/0		CentOS 7 -x86_64- - with Updates HVM-2002_01-AutogenByAWSMP-
45045	TCP		0.0.0.0/0	CentOS 7 -x86_64- - with Updates HVM-2002_01-AutogenByAWSMP-
45045	TCP		::/0		CentOS 7 -x86_64- - with Updates HVM-2002_01-AutogenByAWSMP-
~~~

~~~
# 혹시 모르니 아웃바운드 규칙도 작성.
포트범위 / 전체	
프로토콜 / 전체	
대상 / 0.0.0.0/0	
보안그룹 / CentOS 7 -x86_64- - with Updates HVM-2002_01-AutogenByAWSMP-
~~~



### 리눅스 

- centos기반으로 구축해놓은 서버에서도 사용할 포트를 열어줘야한다.
- Nginx, gunicorn이 사용할 포트를 열어줄 것인데 방법은 아래와 같다.

> - 시작하기 이전에  ```firewall-cmd --state```을 찍어보고 없다 그러면
>   ```yum install firewalld```
>   ```systemctl start firewalld```
>   ```systemctl enable firewalld``` 설치하고 활성화 시켜준다. 
>
> ~~~
> # 서비스/포트 추가/제거
> 1. tcp
> 	firewall-cmd --add-port=(port number)/tcp
> 	firewall-cmd --remove-port=(port number)/tcp
> 2. ftp (우리는 안씀)
> 	firewall-cmd --add-service=ftp
> 	firewall-cmd --remove-service=ftp
> 3. http 허가
> 	firewall-cmd --zone=public --add-service=http --permanent
> 	
> # 시스템 재부팅 또는 방화벽 재시작 후에도 적용되도록 하려면 --permanent 옵션을 붙여야한다.
> 	firewall-cmd --permanent --add-service=ftp
> 	
> # 방화벽 재시작
> 	firewall-cmd --reload
> ~~~
>
> 참고사이트 
> https://www.manualfactory.net/10153
> https://www.lesstif.com/system-admin/rhel-centos-firewall-22053128.html
> https://www.linode.com/docs/guides/introduction-to-firewalld-on-centos/

---





