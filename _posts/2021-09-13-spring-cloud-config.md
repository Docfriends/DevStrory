---
layout: post
title: "Spring Cloud Config"
description: "Spring Cloud Config 통해 마이크로서비스에서 설정값을 관리 해봅시다."
date: 2021-09-13
tags: [JAVA, Spring, Cloud, RabbitMQ]
writer: syh8088
category: JAVA
comments: true
share: true
---
# 예제 소스 코드

이번 블로그에 사용되는 코드는 아래 링크 통해 확인 할 수 있습니다.

config server 및 client
https://github.com/syh8088/spring-cloud-config-project

git repository
https://github.com/syh8088/spring-cloud-config (브랜치는 master 입니다.)

# Spring Cloud Config

Spring Cloud Config 이야기 해볼려고 합니다.

보통 서비스를 구축 및 관리 하는 서비스 업체라면 마이크로 서비스를 도입 하고 있을겁니다.

예를들어 application.yml 설정 파일에서 각 업체마다 관리하는 수신차단 전화번호를 관리 한다고 생각해보자

갑자기 해당 업체로부터 수신차단 전화번호 변경 요청이 들어왔을때 변경된 수신 차단번호를 수정하고

상용에 배포된 프로세스를 중지 후 다시 재기동 해야 된다.

CI/CD 구축된 서비스라면 TEST 부터 빌드 및 배포까지 자동화 하지만 특정 설정 값을 변경할 뿐인데 다시 배포 작업을 한다는것은

여간 불편한게 아니다.

Spring Cloud Config 는 이러한 불편함을 해소하기 위해 설정 파일들을 외부로 분리 및 관리하고

설정이 바뀔 때마다 빌드와 배포가 필요 없도록 해주는 역활을 해준다.

지금부터 Spring Cloud Config 에 대해 알아보도록 하겠다.

## Spring Cloud Config 란?

![Spring-Cloud-Config-Server]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/Spring-Cloud-Config-Server.png)

앞서 설명 한것 처럼 Spring Cloud Config 는 여러 마이크로 서비스의 설정 파일을 외부로 분리해 하나의 중앙 설정

저장소 처럼 관리 할 수 있도록 해주며 특정 설정 값이 변경시 각각의 서비스를 재기동 할 필요없이 적용이 가능하도록 도와준다.

먼저 Git Repository 에 우리가 관리 해야 될 설정파일(yml 파일 등) 등록 시키고

Spring Cloud Config Server 에서는 등록된 설정 파일(Git Repository) 을 가져와서 연결된 Spring Boot Application 에 전달 하는 방식이다.

물론 개발환경 및 상용 환경에 따른 각각의 설정파일을 가져올수 있도록 설정 할 수 있다.

이러한 특징 때문에 설정 파일 관리를 동적으로 관리 해주면서 유연한 서비스를 유지 보수 할 수 있다.

## Spring Cloud Config Server 생성
우선 Spring Cloud Config Server 를 생성해보자

https://start.spring.io/

해당 주소로 통해 생성 해보자

![spring-initializr]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/spring-initializr.png)

Build Tool: Gradle <br>
Spring Boot Version: 2.4.10 <br>
Dependencies: <br>
```markdown
implementation 'org.springframework.cloud:spring-cloud-config-server'
implementation 'org.springframework.cloud:spring-cloud-starter'
```

![EnableConfigServer]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/EnableConfigServer.png)

프로젝트를 생성 후 main 메소드를 가서 생성된 서버가 Config Server 적용을 위해 @EnableConfigServer 적용하자

![application-setting1]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/application-setting1.png)

그다음 application.yml 가서
해당 서버 port 를 지정 후 application 이름을 'config-server' 로 지정 해보자 해당 이름은 자신이 원하는 단어로 선택해도 괜찮다.

그리고 설정 파일을 가져올수 있도록 설정 파일 저장된 Git Repository uri 를 지정 해야 하는데
아직 git repository 는 생성 하지 않았으니 key 값만 입력 해보자.

## Git Repository 생성 (설정 파일 저장소)
![create-new-repository]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/create-new-repository.png)

git 저장소를 생성하기 위해 GitHub 이용해 생성 하자
원하는 저장소 이름을 적고 생성 한 후 (반드시 브랜치는 'master' 에 적용 해야 합니다.)

![server-api-application-yml]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/server-api-application-yml.png)

각각 'docfriends-dev.yml', 'docfriends-prod.yml' 를 생성하자.
여기서 파일명을 설명하자면 {application name}-{profile}.yml
즉 파일명 앞에는 application name 이고 그 다음은 profile name 이다.

![blockDiagram]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/blockDiagram.png)

예를들어 Server API 서버에 profile 설정을 'prod' 로 설정하면 Spring Cloud Config Server 로 부터 'docfriends-prod.yml' 파일을 참조 하게 된다.

다시 Spring Cloud Config 프로젝트의 application.yml 가서 git uri 를 Git Repository 생성한 uri 로 설정 한다.

![application-setting2]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/application-setting2.png)

## Spring Cloud Config Client 생성
우리는 여기서 Server API, Scheduler Server 두개 생성 할 것이다.

![spring-initializr2]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/spring-initializr2.png)

Git 예제 소스 코드 이용해보자
https://github.com/syh8088/spring-cloud-config-project

새롭게 추가된 Server API, Scheduler Server 에 application 저장된 디렉토리 각각 'bootstrap.yml' 파일을 추가 하자

bootstrap 파일은 초기 기동시(Server API 및 Scheduler Server) application 설정 파일보다 먼저 읽게 된다.

이 bootstrap 에 설정한 값을 이용해서 먼저 생성한 spring-cloud-config-server 이용하겠다는 전략이다.

즉 외부에 설정한 설정파일을 먼저 읽겠다는 것이다.

![bootstrap-server-api]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/bootstrap-server-api.png)

Server API -> bootstrap.yml

![bootstrap-scheduler-server]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/bootstrap-scheduler-server.png)

Scheduler Server -> bootstrap.yml

Server API, Scheduler Server 프로젝트에 각각 bootstrap.yml 추가 해서 이미지에 보이는 설정값을 기입하자<br>
uri: spring-cloud-config-server 주소<br>
name: Git Repository 에 추가된 설정 파일명<br>
profiles.active: Git Repository 에 추가된 설정 파일 중에서 어떤 profile 을 가져 오는지 지정하는 것 (기입 하지 않으면 default 로 파일명 중 기입 되지 않는 우선순위로 가져오게 된다)

Git Repository 에 docfriends-{profile name}.yml 라고 추가 한 값을 읽어 오겠다는 의미

![controller-server-api]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/controller-server-api.png)

Server API -> ServerApiController

![controller-scheduler-server]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/controller-scheduler-server.png)

Scheduler Server -> SchedulerApiController

추가된 Server API(port: 8881), Scheduler Server(port: 8882) 프로젝트 에서 controller 를 만들어보자

Git Repository 에서 만들었던 설정파일을 읽어 오는 controller 를 만들 것이다.

여기서 중요한것은 @RefreshScope 이다. config 저장소에서 설정 파일을 변경했을 때 변경사항을 갱신할 수 있도록 설정하는 것이다.

## TEST 해보기

Git Repository 에 설정 파일을 잘 읽어 오는지 TEST 해보자

먼저 Git Repository 에 추가된 설정파일을 git 에 PUSH 하고 Spring Cloud Config Server 를 먼저 기동 해야 한다.

프로세스가 올라가면 그 다음에 각각 Server API, Scheduler Server 기동 하자

![process-up-client-server]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/process-up-client-server.png)

Server API 기동시 로그를 확인 해보면

`Fetching config from server at : http://127.0.0.1:8888`

Spring Cloud Config Server URI 로 부터 Fetching 되었다는 것을 알 수 있다.

그 밑에 환경 이름은 'docfriends' 로 가져오게 되고 profile 은 'dev' 로 가져온다고 알 수 있다.
여기서 'BootstrapPropertySource' 은 읽어 오자 하는 Bootstrap 정보 값이다.

정상적으로 Git Repository 위치를 가져오는 것을 확인 할 수 있다.

최종적으로 TEST 해보자

1. http://localhost:8881/jeonneung-block-number (Server API)
2. http://localhost:8882/jeonneung-block-number (Scheduler Server)

![test1]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/test1.png)

정상적으로 Server API(profile: dev) 는 '1234' Scheduler Server (profile: prod) 는 '080-1234-5678' 로 가져오는 걸 확인 할 수 있다.