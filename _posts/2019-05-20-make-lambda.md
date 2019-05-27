---
layout: post
title: "Lambda 만들기"
description: "AWS Lambda 만들고 APIGateway연결 IAM으로 로그 찍기"
date: 2019-05-20
tags: [AWS, Lambda, APIGateway, CORS, Log, IAM]
writer: pikachu987
category: server
comments: true
share: true
---

<a href='https://ap-northeast-2.console.aws.amazon.com/lambda/home' target='blank'>AWS Lambda</a>

<a href='https://ap-northeast-2.console.aws.amazon.com/apigateway/home' target='blank'>AWS API Gateway</a>

<a href='https://console.aws.amazon.com/iam/home' target='blank'>AWS IAM</a>

<a href='https://ap-northeast-2.console.aws.amazon.com/cloudwatch/home' target='blank'>AWS CloudWatch</a>

### 1.Lambda

<h3 id="temp1" style="visibility:hidden;"></h3>

##### 1) AWS 리전 변경

![Region]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/region.png)

AWS 사이트 상단에서 자기와 가까운 리전을 설정합니다.

##### 2) Lambda 함수 생성

<h3 id="temp1-2" style="visibility:hidden;"></h3>

![LambdaSite]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/lambdaSite.png)

함수 만들기를 선택합니다.

![LambdaMakeFunc]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/lambdaMakeFunc.png)

함수이름을 입력하고 함수 생성을 합니다.

![LambdaMakeFuncComplete]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/lambdaMakeFuncComplete.png)

Lambda 함수 만들기 성공했습니다 🎉🎉🎉

### 2.API Gateway

##### 1) API Gateway 만들기

![ApiGatewaySite]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/apiGatewaySite.png)

API Gateway를 시작합니다.

![ApiGatewayMake]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/apiGatewayMake.png)

**새 API생성**에서 **새 API** 를 선택하고<br>
API 이름을 입력합니다.<br>
그리고 API 생성을 합니다.

![ApiGatewayMakeComplete]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/apiGatewayMakeComplete.png)

API Gateway 만들기 성공했습니다 🎉🎉🎉

##### 2) API Gateway Method 만들기

<h3 id="temp2-2" style="visibility:hidden;"></h3>

![ApiGatewayWorkMethod]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/apiGatewayWorkMethod.png)

**메서드 생성** 을 합니다.

![ApiGatewayWorkMethodType]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/apiGatewayMethodType.png)

여러가지 HTTP Method가 나오게 되는데 저는 POST를 해보겠습니다.

![ApiGatewayMethodPost]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/apiGatewayMethodPost.png)

POST를 선택한 다음 체크를 선택합니다.

![ApiGatewayLambda]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/apiGatewayLambda.png)

Lambda함수를 입력을 하고 저장을 해줍니다.

![ApiGatewayLambdaConnect]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/apiGatewayLambdaConnect.png)

Lambda 함수에 API Gateway 권한부여를 확인을 합니다.

![ApiGatewayMethodMakeComplete]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/apiGatewayMethodMakeComplete.png)

API Gateway POST 메서드를 만들었습니다 🎉🎉🎉

### 3.배포, 테스트

##### 1) 배포

<h3 id="temp3-1" style="visibility:hidden;"></h3>

![UploadWork]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/uploadWork.png)

작업을 눌러서 **API 배포** 를 선택합니다.

![UploadSelect]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/uploadSelect.png)

**배포 스테이지** 를 선택합니다.

![UploadComplete]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/uploadComplete.png)

**[새 스테이지]** 를 선택하고 스테이지 이름을 입력을 한 뒤 배포를 합니다.

![UploadSiteComplete]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/uploadSiteComplete.png)

이제 URL까지 나왔습니다 🎉🎉🎉

##### 2) 통신 테스트

<h3 id="temp3-2" style="visibility:hidden;"></h3>

![RequestTest]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/requestTest.png)

URL로 통신 끝 🎉🎉🎉

### 4.HEAD추가, CORS추가

##### 1) HEAD

특정 사이트에서는 HTTP Method 중 head가 필요할수 있습니다.

![LambdaHead]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/lambdaHead.png)

[Lambda - Lambda 함수 생성](#temp1-2) 에서 POST를 만드는것과 비슷하게 HEAD를 만듭니다.<br>
코드는 간단히 200을 리턴하게 하였습니다.

![ApiGatewayHead]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/apiGatewayHead.png)

[API_Gateway - API Gateway Method 만들기](#temp2-2) 에서 HEAD 메서드를 만듭니다.

[배포, 테스트 - 배포](#temp3-1) 다시 배포를 합니다.

![TestHead]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/testHead.png)

HEAD 테스트 완료 🎉🎉🎉

##### 1) CORS

![WorkCors]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/workCors.png)

**작업** 에서 CORS 활성화를 선택합니다.

![CorsCheck]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/corsCheck.png)

**CORS 활성화 및 기존의 CORS 헤더 대체** 를 선택 합니다.

![CorsConfirm]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/corsConfirm.png)

**예, 기존 값을 대체하겠습니다.** 를 선택합니다.

![CorsComplete]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/corsComplete.png)

OPTIONS 메서드도 생겼습니다.<br>
CORS [배포, 테스트 - 배포](#temp3-1) 배포를 합니다.<br>
CORS 추가 완료 🎉🎉🎉

### 5.로그 IAM 추가

##### 1) Role 추가

![IamRole]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/iamRole.png)

IAM에 들어가서 **역활** 을 누르고 **역활 만들기** 를 누릅니다.

![IamRoleAPIGateway]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/iamRoleAPIGateway.png)

**API Gateway** 를 누르고 **다음:권한** 을 누릅니다.

![IamFilter]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/iamFilter.png)

**다음:태그** 를 누릅니다.

![IamTag]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/iamTag.png)

**다음:검토** 를 누릅니다.

![IamCheck]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/iamCheck.png)

역활 이름을 입력하고 **다음:만들기** 를 누릅니다.

![IamComplete]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/iamComplete.png)

IAM 추가 완료 🎉🎉🎉<br>
**역활 ARN** 을 복사해놓습니다.

##### 2) API Gateway에 IAM 추가

![IamGateway]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/iamGateway.png)

API Gateway에서 **설정** 에 들어간 다음 ARN을 적고 **저장** 을 눌러줍니다.

![LogMethod]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/logMethod.png)

API Gateway에서 **스테이지** 를 누르고 배포스테이지에 들어간 다음 **로그/추적** 에서 **CloudWatch 로그 활성화** 를 해줍니다.<br>
로그 수준을 **INFO** 해주고 필요한 사항을 체크한 뒤 **변경 사항 저장** 을 합니다.

##### 3) Test

![LambdaLog]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/lambdaLog.png)

Lambda 코드에 Console.log를 적어주고 저장합니다.<br>
다시 통신 테스트 [배포, 테스트 - 테스트](#temp3-2) 를 합니다.

##### 3) Log 확인

![CloudWatchLog]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/cloudWatchLog.png)

CloudWatch에서 **로그** 를 들어갑니다.

![CloudWatchLogList]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/cloudWatchLogList.png)

아까 만든 로그 그룹을 들어갑니다.

![CloudWatchLogComplete]({{ site.url }}{{ site.baseurl }}/images/2019/make-lambda/cloudWatchLogComplete.png)

로그 완료 🎉🎉🎉
