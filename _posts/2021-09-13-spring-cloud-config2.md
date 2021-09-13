---
layout: post
title: "Spring Boot Actuator"
description: "Spring Boot Actuator 적용해봅시다."
date: 2021-09-13
tags: [JAVA, Spring, Cloud, RabbitMQ]
writer: syh8088
category: JAVA
comments: true
share: true
---
# Spring Boot Actuator
Git Repository 에서 설정 파일을 변경 해야 하는 상황이 발생되었다.

![update-docfriends-yml]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/update-docfriends-yml.png)

기존에 docfriends.tel-numbers.jeonneung.block 값이 1234 -> 5678 로 변경 되었다고 가정 하자.

그럼 Server API, Scheduler Server 는 다시 재기동을 해야 반영된 설정파일을 읽을수가 있다.

이렇게 설정값이 변경 할때마다 수정 하고 다시 재부팅 해야 한다면 불편하지 않을까?

설정값은 언제든지 변경 될수 있는 상황이고 그때마다 서버를 재부팅 한다면 좋은 방향은 아니다.

이 불편한 일을 해결 방안 중 하나다 Actuator 를 사용 하는 것이다.

Spring Actuator 는 application 상태값 및 모니터링 관리 할 수 있도록 도와주는 기능이다.

여러가지 기능을 제공하는데 우리는 여기서 서버를 재부팅 하지 않아도 상태값을 변경 할 수 있는 refresh 기능을 사용 할것이다.

그외 기능은

https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.endpoints

여기서 확인이 가능하다.

## Spring Boot Actuator 적용하기

Server API, Scheduler Server 의 dependency 에 actuator 기능을 추가하자

`implementation 'org.springframework.boot:spring-boot-starter-actuator'`

![application-setting3]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/application-setting3.png)

Server API, Scheduler Server 의 각각 application.yml 에 설정값을 추가하자

여기서 include  에 Actuator EndPoint 를 추가 해야 하는데

우리는 여기서 'refresh', 'health', 'beans' 을 추가 했다.

refresh: 설정값을 변경해도 재기동 할 필요없이 반영 할 수 있는 기능이고<br>
health: 해당 어플리케이션 상태를 확인 할 수 있는 기능이다.<br>
beans: 해당 어플리케이션에 등록된 bean 정보를 확인 할수 있다.

차례대로 어떤 기능인지 확인 해보자

###actuator-health

Server API, Scheduler Server 의 dependency 에 actuator endpoint 추가 한 후 다시 각각 재기동 해보자

![actuator-health]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/actuator-health.png)

GET - http://localhost:{기동된 port 번호}/actuator/health

접속 하면 status 값이 'UP' 이라고 확인이 가능하다. 즉 서버가 정상적으로 작동 하고 있다는 뜻이다.

###actuator-beans

![actuator-beans]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/actuator-beans.png)

GET - http://localhost:{기동된 port 번호}/actuator/beans

접속 하면 해당 어플리케이션에 등록된 bean 을 확인 할 수 있다.

###actuator-refresh

해당 기능은 application 설정 값이 있다면 재기동 할 필요없이 반영될 수 있는 기능이다.

Git Repository 에 등록된 'docfriends-dev.yml' 에다가 docfriends.tel-numbers.jeonneung.block 값 5678 -> 2222

로 변경 해보자 그리고 반드시 변경된 사항을 Git PUSH 하자

![actuator-refresh]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/actuator-refresh.png)

POST - http://localhost:{기동된 port 번호}/actuator/refresh

접속 해보면 Response 값에 변경된 설정값 목록을 확인 할 수 있다.

그런 다음 'Server API' 어플리케이션의

GET - http://localhost:8881/jeonneung-block-number 호출 해보자

![test2]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/test2.png)

Server API 를 재기동 하지 않아도 설정값이 변경된것을 확인 할 수 있다.
