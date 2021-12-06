---
layout: post
title: "iOS13 Deprecated - statusBarFrame, keyWindow"
description: "iOS13에서 Deprecated 된 statusBarFrame, keyWindow 수정 방법을 설명합니다."
date: 2021-12-06
tags: [iOS, iOS13, Deprecated, statusBarFrame, keywindow]
writer: zehye
category: iOS
comments: true
share: true
---


## StatusBar Height 구하기

기존 iOS13 이전에는 statusbar의 높이를 `UIApplication.shared.statusBarFrame.height`를 통해 구할 수 있었습니다.

그러나 iOS13부터는 이 방식이 deprecated 되어 아래 문구를 띄워주게 됩니다.

![statusBarFrame deprecated]({{ site.url }}{{ site.baseurl }}/images/2021/iOS/statusBarFrame.png)

이제 window scene의 statusbarManager를 사용하라는 의미입니다.<br>
이는 아래 방식으로 고쳐 사용하면 됩니다.


### Before

```swift
UIApplication.shared.statusBarFrame.height
```


### After

```swift
view.window?.windowScene?.statusBarManager?.statusBarFrame.height ?? 0
```

옵셔널은 상황에 맞게 처리해주시면 됩니다.



## keyWindow

keyWindow란 윈도우가 여러개 존재할 때, 가장 앞쪽에 배치된 윈도우를 의미합니다. <br>
터치 이벤트같은 경우 해당 이벤트들은 이벤트가 발생한 윈도우에 직접 전달이 됩니다.

그런데 관련 좌표값이 없는 이벤트 같은 경우에는 키 윈도우로 전달이 됩니다.

이러한 좌표값이 없는 이벤트는 시스템이 생성한 윈도우에서 생성된 이벤트를 의미합니다.

예로들어, 가상 키보드 창은 시스템이 생성한 윈도우입니다.<br>
키보드 창에서 글자를 입력할 때 발생하는 이벤트들은 앱의 키 윈도우로 전달이 됩니다.<br>
하나의 시점에는 오직 한개의 윈도우만이 키 윈도우가 될 수 있으며, 키 윈도우는 `isKeyWindow` 속성을 통해 결정 할 수 있습니다.

이러한 keyWindow는 iOS13에서 deprecated 되었습니다.

![keyWindow deprecated]({{ site.url }}{{ site.baseurl }}/images/2021/iOS/keyWindow.png)

이제 keyWindow를 window로 사용해야 합니다.


### Before

```swift
UIApplication.shared.keyWindow
```


### After

```swift
UIApplication.shared.window.first { $0.isKeyWindow }
```

만약 윈도우의 bottomConstraint를 설정하고 싶다면 어떻게 해야할까요?

```swift
let bottomConstraint = UIApplication.shared.windows.filter { $0.isKeyWindow }.first?.safeAreaInseta.bottom ?? 0
```
