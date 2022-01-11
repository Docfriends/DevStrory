---
layout: post
title: "iOS Firebase 8.8.0 업데이트 이슈"
description: "CocoaPod > Firebase 8.8.0으로 업데이트하면서 수정한 것을 정리하였습니다."
date: 2022-01-08
tags: [Swift, iOS, CocoaPods, Firebase]
writer: zehye
category: iOS
comments: true
share: true
---


## Firebase 8.8.0 업그레이드

Firebase를 7.10.0 에서 8.8.0으로 코코아팟을 통해 업그레이드 하였습니다.<br>


```vim
pod 'Firebase', '8.8.0'
pod 'Firebase/Core'
pod 'Firebase/Auth'
pod 'Firebase/Messaging'
pod 'Firebase/Analytics'
pod 'Firebase/Performance'
pod 'Firebase/Crashlytics'
```

했더니 아래와 같은 두개의 에러가 발생하였습니다.

- ld: framework not found FirebaseInstanceID
- ld: framework not found Protobuf


<br/>


### 1. ld: framework not found FirebaseInstanceID

[참고한 Stackoverflow](https://stackoverflow.com/questions/62301690/framework-not-found-firebaseinstanceid-on-xcode)


<br/>


#### Target > BuildSetting > 서치박스에서 FirebaseInstanceID 검색

![firebase deprecated]({{ site.url }}{{ site.baseurl }}/images/2021/iOS/firebase1.png)


<br/>


#### Linking에 FirebaseInstanceID가 있을 것

![firebase deprecated]({{ site.url }}{{ site.baseurl }}/images/2021/iOS/firebase2.png)


<br/>


#### Linking > Other Linker Flags > Debug/Release 두개 모두에서 -framework, FirebaseInstanceID delete(-) 클릭

![firebase deprecated]({{ site.url }}{{ site.baseurl }}/images/2021/iOS/firebase3.png)


<br/>


#### 반드시 Debug/Release 두개 모두에서 삭제해줘야하고

<br/>


#### -framework, FirebaseInstanceID 이 두개도 반드시 지워줘야 함


<br/>


### 2. ld: framework not found Protobuf

[참고한 Stackoverflow](https://stackoverflow.com/questions/59499381/framework-not-found-protobuf)

이 또한 위에 FirebaseInstanceID를 삭제해주는 방식과 동일하게 처리해주면 끝!
