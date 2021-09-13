---
layout: post
title: "비대칭키를 이용한 application.yml 설정값 암호화"
description: "비대칭키를 이용해서 application.yml 설정값 암호화 및 관리 해봅시다."
date: 2021-09-13
tags: [JAVA, Spring, Cloud]
writer: syh8088
category: JAVA
comments: true
share: true
---
# 설정 값 암호화 적용

어플리케이션을 관리하다 보면 설정 값들을 외부에 노출 하고 싶지 않을때가 있다.

예를들어 설정 값 중에 Database 계정 정보가 있을텐데 이러한 값들은 외부 개발자에게 노출하고 싶지 않을 것이다.

이러한 에러사항을 암호화를 통해 관리한다면 가령 Database Password 값이 노출 되더라도 암호화 되어 있기 때문에 안전하게 유지 관리가 가능하다.

우리는 이러한 설정값들을 암호화 해서 관리 하는 방법을 알아볼려고 한다.

## 대칭키 VS 비대칭키
대표적으로 대칭키 방식과 비대칭키 방식이 있다. 설명하기전 우선 복호화(decryption) 암호화(encryption) 용어를 간단하게 설명하자면

암호화(encryption): 말그래로 해당 데이터를 암호화 처리를 말한다.<br>
복호화(decryption): 암호화의 반대로 암호화된 데이터를 암호화되기 전의 형태로 바꾸는 처리를 말한다.

대칭키 방식: 암호화 및 복호화시 같은 Key 로 사용하는것을 대칭키 방식이라고 한다. <br>
비대칭키 방식: 암호화 하는 Key 와 복호화 하는 Key 를 다르게 이용해서 사용하는것을 비대칭키 방식이라고 한다.

보통 암호화 할때 private key 를 사용하고 반대로 복호화 할때 public key 를 사용하지만 반대로 사용해도 된다. 중요한것은 public key 로 암호화를 했으면

복호화 할때 다른키 즉 private key 를 이용해야 한다.

우리는 여기서 비대칭키 방식으로 설정값을 관리 하고자 한다.

## JDK keytool 이용한 public key, private key 생성

자바에서 제공하는 keytool 이용해서 public key, private key 생성 해보자

```markdown
keytool -genkeypair -alias {별칭} 
                    -keyalg RSA 
                    -keypass {패스워드}
                    -keystore {파일명}.jks 
                    -storepass {패스워드}
```
* -v          : 결과를 상세하게 보기 옵션이다.
* -keystore  : 키가 저장될 JKS를 지정한다. 없을 경우는 생성한다.
* -alias      : 키의 별칭이다.
* -sigalg    : 인증서의 알고리즘이다. 해시 알고리즘으로 구성된다.
* -keysize   : 직역대로 키 사이즈이며 키 사이즈가 클 수록 암복호화 시간이 오래 걸리지만 좀 더 안전하다.
* -validity    : 인증서의 유효기간이다.

```markdown
// private key 생성
keytool -genkeypair -alias privateKey -keyalg RSA -dname "CN=Kenneth Lee, OU=API Development, O=joneconsulting.co.kr, L=Seoul, C=KR" -keypass "1q2w3e4r" -keystore privateKey.jks -storepass "1q2w3e4r"

// 인증서 파일
keytool -export -alias privateKey -keystore privateKey.jks -rfc -file trustServer.cer

// 인증서 파일 -> jks 파일 public key 생성 
keytool -import -alias trustServer -file trustServer.cer -keystore publicKey.jks
```

## 생성된 public key, private key 적용

Spring Cloud Config Server 'bootstrap.yml' 에 아래 설정값을 추가 한다.
```markdown
encrypt:
  key-store:
    location: file:///{디렉토리 경로}/{파일명}.jks
    alias: apiEncryptionKey
    password: 1q2w3e4r
```
Window OS 버전

```markdown
encrypt:
  key-store:
    location: file://{디렉토리 경로}/privateKey.jks
    alias: privateKey
    password: 1q2w3e4r
```
MAC OS 버전

Spring Cloud Config Server 재기동 하고 실제로 사용하고자 하는 database password 를 암호화 해보자

![encrypt]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/encrypt.png)

POST - http://localhost:8888/encrypt

암호화 할 데이터를 '1234' 로 입력하게 되면 응답에 암호화 된 데이터를 얻게 된다.

![decrypt]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/decrypt.png)

POST - http://localhost:8888/decrypt

암호화 된 데이터를 body 에 담아서 보내게 되면 복호화 하게 된다.

![application-setting4]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/application-setting4.png)

암호화 된 데이터를 GIT Repository 의 docfriends-dev.yml, docfriends-prod.yml 에 적용 해보자

적용할때 암호화된 데이터 앞에 '{cipher}' 를 반드시 적용 해야 한다. 그래야 해당 데이터가 암호화된 데이터로 인식해 복호화 하기 때문이다.

```markdown
    @Value("${spring.datasource.password}")
    private String password;
    
    @GetMapping("password")
    public String getPassword() {
        return String.format("Database Password = " + password);
    }
```
Server API Controller 에 password 설정값을 확인 할 수 있도록 추가 하고 재기동 하자

![test5]({{ site.url }}{{ site.baseurl }}/images/2021/spring-cloud-config/test5.png)

정상적으로 복호화 된 데이터를 가져올수 있는걸 확인 할 수 있다.

이상으로 Spring Cloud Config 설명을 마치도록 하겠습니다.

감사합니다 :)


