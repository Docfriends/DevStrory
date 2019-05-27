---
layout: post
title: "Lambda 스케쥴러 만들기"
description: "AWS Lambda Scheduler"
date: 2019-05-21
tags: [AWS, Lambda, Scheduler]
writer: pikachu987
category: server
comments: true
share: true
---

### 1.Lambda

##### 1) 람다 만들기

<a href='https://ap-northeast-2.console.aws.amazon.com/lambda/home' target='blank'>AWS Lambda 사이트</a>

<a href='{{ site.url }}{{ site.baseurl }}/2019-05-20/make-lambda#temp1-2' target='blank'>AWS Lambda 함수 만들기</a> 로 가서 Lambda 함수를 만듭니다.

![MakeLambda]({{ site.url }}{{ site.baseurl }}/images/2019/lambda-scheduler/makeLambda.png)


### 2.CloudWatch 규칙 만들기

<a href='https://ap-northeast-2.console.aws.amazon.com/cloudwatch/home' target='blank'>AWS CloudWatch 사이트</a>


![RoleMake]({{ site.url }}{{ site.baseurl }}/images/2019/lambda-scheduler/roleMake.png)

**이벤트** **규칙** 을 선택합니다.

![RoleCreate]({{ site.url }}{{ site.baseurl }}/images/2019/lambda-scheduler/roleCreate.png)

![RoleInput]({{ site.url }}{{ site.baseurl }}/images/2019/lambda-scheduler/roleInput.png)

**일정** 을 누르고 Cron식을 입력합니다.

```
*/1 * ? * MON-FRI *: 월-금 매시간 1분마다 호출
```

**대상추가** 를 누르고 Lambda함수를 선택합니다.<br>
**세부 정보 구성** 을 누릅니다.

![RoleName]({{ site.url }}{{ site.baseurl }}/images/2019/lambda-scheduler/roleName.png)

규칙 이름을 입력하고 **규칙 생성** 을 누릅니다.

![RoleComplete]({{ site.url }}{{ site.baseurl }}/images/2019/lambda-scheduler/roleComplete.png)

규칙 생성 완료 🎉🎉🎉

![LambdaComplete]({{ site.url }}{{ site.baseurl }}/images/2019/lambda-scheduler/lambdaComplete.png)

Lambda에 들어가면 CloudWatch Event가 생겼습니다.<br>
누르면 Event 리스트가 나오게 됩니다 🎉🎉🎉

### 3.Test

```
exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    console.log("스케쥴러!");
    return response;
};
```

람다 함수에 Console.log(); 를 추가합니다.

![Test]({{ site.url }}{{ site.baseurl }}/images/2019/lambda-scheduler/test.png)

테스트 성공 🎉🎉🎉

Cron에서 UTC 시간대 때문에 서울은 +9를 해주어야 합니다.

```
월-금 10시 = 0 1 ? * MON-FRI *
월-금 18시 30분 = 30 9 ? * MON-FRI *
월-금 19시 = 0 10 ? * MON-FRI *
월-금 매분마다 = */1 * ? * MON-FRI *
```
