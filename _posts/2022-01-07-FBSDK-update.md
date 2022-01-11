---
layout: post
title: "iOS Facebook SDK 12.2.1 업데이트 이슈"
description: "CocoaPod > Facebook SDK 12.2.1로 업데이트하면서 수정한 것을 정리하였습니다."
date: 2022-01-07
tags: [Swift, iOS, CocoaPods, FBSDK]
writer: zehye
category: iOS
comments: true
share: true
---


## FBSDK 12.2.1 업그레이드

참고한 깃헙은 요것입니다 > [참고 Github](https://github.com/facebook/facebook-ios-sdk/blob/main/CHANGELOG.md)

FBSDK를 9.1.0 에서 12.2.1 로 코코아팟을 통해 업그레이드 하였습니다.<br>


```vim
pod 'FBSDKShareKit', '12.2.1'
pod 'FBSDKCoreKit', '12.2.1'
pod 'FBSDKLoginKit', '12.2.1'
```


<br/>


### 1. Incorrect argument label in call (have 'fromViewController:content:delegate:', expected 'viewController:content:delegate:')

친절하게도 이 에러에서는 대체해야할 문구를 바로 알려주었습니다.<br>
`Replace 'fromViewController' with 'viewController'`

즉 이전까지는 fromViewController로 사용했던 파라미터를 viewController로 변경하라는 의미입니다.


<br/>


### 2. Instance member 'activateApp' cannot be used on type 'AppEvents'; did you mean to use a value of this type instead?

AppEvents에 activateApp이 없다는 의미입니다.<br>
shared를 통해 activateApp을 가져옵시다.


```swift
AppEvents.activateApp()  // 구버전
AppEvents.shared.activateApp()  // 요렇게 바꿔주기
```

<br/>


### 3. Extra argument 'completionHandler' in call

`GraphRequest.start(completionHandler:)` 요게 `GraphRequest.start(completion:)` 이렇게 바뀌었다고 한다.
