---
layout: post
title: "Spring Cloud Bus"
description: "Spring Cloud Bus 를 이용해서 RabbitMQ 활용해 설정값을 갱신 해보자"
date: 2021-09-13
tags: [JAVA, Spring, Cloud, RabbitMQ]
writer: syh8088
category: JAVA
comments: true
share: true
---
# Spring Cloud Bus
지금까지 Spring Cloud Actuator 기능을 통해 Git Repository 에서 설정값을 변경 되더라도 Spring Cloud Config Client 서버들이

재기동 할 필요없이 설정값들을 바로 반영 할 수 있도록 하는 기능을 알아 보았다.

그러나 한가지 불편한 점이 있는데 Spring Cloud Config Client 서버들 그러니깐 Server API, Scheduler Server 각각 Actuator refresh 기능 통해

호출 해야 반영된다는 점이다.

지금은 2개 서버밖에 없어서 그렇지 앞으로 많은 서버들이 존재한다고 한다면 하나하나씩 Actuator refresh 기능을 수행해야 할 것이다.

이러한 불편한점을 해소하기 위해 Spring Cloud Bus 를 이용할려고 한다.

## Spring Cloud Bus 개요

Spring Cloud Bus 란 수많은 여러 서버가 존재했을때 즉 분산된 서버에 메시지 브로커(message broker) 역활로 메세지를 전달하는 기능을 제공 한다.

![MessageBroker]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/MessageBroker.png)

여기서 메시지 브로커(message broker) 란 여러 수많은 서버에 메세지를 전달 했을때 중간 단계로써 역활을 한다.

메시지 브로커는 대표적으로 Apache Kafka, Redis, RabbitMQ, Celery 등이 있다.

여기서 우리는 RabbitMQ 이용해서 기능을 구현할 것이다.

즉 Spring Cloud Bus 를 이용해서 RabbitMQ 활용해 각각 Server API, Scheduler Server 에 메세지를 전달 하므로써

기존에 Actuator refresh 하나하나 실행 할 필요없이 하나의 메세지 통해 설정값을 변경 했다고 알려 줄것이다.

![springCloudBus]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/springCloudBus.png)

이미지 통해 자세히 알아보자

기존에는 Git Repository 에서 해당 yml 파일에 설정값이 변경되었으면 Actuator refresh 기능 통해 각각 서버에 알려줘야 되었다.

하지만 이번에는 Actuator busrefresh 기능을 수행 하면

(Actuator busrefresh 기능을 수행하기 위해 Spring Cloud Config Server 와 연결된 어느 서버에 호출해도 된다.)

Spring Cloud Bus 가 이를 감지하고 RabbitMQ 를 이용해서 AMQP Protocol 로 Spring Cloud Config Server 와 연결된 서버들에게

설정값 변경된것을 알려줄것이다. 이를 감지된 서버들은 이전에 우리가 알아보았던 Actuator refresh 기능 처럼 refresh 해서 변경된 설정값으로 반영시키게 된다.

## RabbitMQ 설치 (Mac OS)
![RabbitMQ]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/RabbitMQ.png)

https://www.rabbitmq.com/

우선 공식 사이트 RabbitMQ 사이트 이다.

터미널로 가서 아래 명령어를 입력 해보자 <br>

`
$ brew update
`<br>
`
$ brew install rabbitmq
`<br>
설치 명령어

`
$ export PATH=$PATH:/usr/local/sbin
`<br>
환경변수 추가

`
$ rabbitmq-server
`<br>
RabbitMQ 실행 명령어

실행 명령어 까지 완료했으면

http://localhost:15672

접속 해보자

![RabbitMQ-MAIN]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/RabbitMQ-MAIN.png)

로그인 페이지를 확인 할 수 있다.

기본 계정은 guest/guest 이다.

Login 클릭하게 된다면

![RabbitMQ-DASHBOARD]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/RabbitMQ-DASHBOARD.png)

dashboard 페이지를 확인 할 수 있다.

## 어플리케이션에 RabbitMQ 적용

Spring Cloud Config Server, Server API, Scheduler Server dependency 에서 각각 AMQP 설치 해보자

Spring Cloud Config Server 에서는 actuator 도 추가 해보자

`implementation group: 'org.springframework.cloud', name: 'spring-cloud-starter-bus-amqp'` <br>
`implementation 'org.springframework.boot:spring-boot-starter-actuator'`

```markdown
spring:
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: guest
    password: guest
    
management:
  endpoints:
    web:
      exposure:
        include: refresh, health, beans, busrefresh
```
Spring Cloud Config Server, Server API, Scheduler Server 의 application.yml 파일에 rabbitmq 설정값과 actuator endpoint 중 'busrefresh' 추가 하자

여기서 rabbitmq 웹사이트로 접속하기 위해서는 포트 정보를 15672 로 사용했지만 시스템으로 접속시에는 포트 정보를 5672 로 입력해야 한다.

참고로 Spring Cloud 2020.0.0 부터는 'bus-refresh' 명령어가 'busrefresh' 로 변경되었다.

적용 했으면 Spring Cloud Config Server 시작으로 Server API, Scheduler Server 차례대로 서버 재기동 해보자

## Spring Cloud Bus 이용 해보기

Git Repository 에 등록된 'docfriends-dev.yml' 에다가 docfriends.tel-numbers.jeonneung.block 값 2222 -> 3333 으로 변경 하고

'docfriends-prod.yml' 에다가 docfriends.tel-numbers.jeonneung.block 값 080-1234-5678 -> 080-1234-1234 변경 후 GIT PUSH 해보자

![actuator-busrefresh]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/actuator-busrefresh.png)

그런 다음 POST - http://localhost:{기동된 port 번호}/actuator/busrefresh

접속 해보면 Response 204 확인 할 수 있다.

그런 다음 'Server API' 어플리케이션의

GET - http://localhost:8881/jeonneung-block-number

'Scheduler Server' 어플리케이션의

GET - http://localhost:8882/jeonneung-block-number 각각 호출 해보자

![test3]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/test3.png)
![test4]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/test4.png)

정상적으로 변경된 값으로 확인 할 수 있다.

이렇게 하나의 요청값으로 여러 서버에 재기동 할 필요없이 바로 적용된 것을 확인 할 수 있다.




