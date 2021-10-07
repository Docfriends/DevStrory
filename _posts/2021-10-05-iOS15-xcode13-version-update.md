---
layout: post
title: "iOS15 & Xcode13 업데이트 대응"
description: "iOS15와 Xcode13 업데이트 대응 정리"
date: 2021-10-05
tags: [iOS15, Xcode13]
writer: zehye
category: iOS
comments: true
share: true
---

### Index

- [iOS15](#1iOS15)
- [Xcode13](#2xcode13)
- [Doctalk](#3doctalk)



<br/>


## 1.iOS15

2021년 9월 21일 iOS15가 정식 런칭되었습니다.

큰 변화가 있었던 iOS14 업데이트에 비해 iOS15 업데이트는 큰 변화를 맞이하지 않았지만, iOS14에서 선보인 개인정보보호정책이 한층 더 강화되는 방향으로 업데이트가 이루어졌습니다. iOS15 주요 변경점을 알아보고 이에 대한 대응방식을 알아보도록 하겠습니다.



### App Tracking Transparency 변경사항

IDFA 권한을 획득하는 팝업 **ATTackingManager.requestTrackingAuthorization**은 앱이 완전히 실행된 경우에만 호출될 수 있도록 변경되었습니다.

![ATT]({{ site.url }}{{ site.baseurl }}/images/2021/iOS/att1.jpeg)

iOS14.5부터 강제되기 시작한 App Tracking Transparency의 IDFA를 획득하는 팝업인 ATTackingManager.requestTrackingAuthorization에 변경사항이 있습니다. 과거에는 사용자의 IDFA 값을 조금이라도 빠르게 권한을 받아 획득하기 위해 IDFA를 획득하는 팝업을 앱 실행 직후에 호출하는 방식을 많이 사용했었습니다. 즉, **didFinishLaunchingWithOptions** 에서 많이들 호출하곤 했죠. 하지만 이 방법은 이제 사용할 수 없게 되었습니다.

iOS15에서부터는 IDFA 권한 설정 팝업인 **ATTackingManager.requestTrackingAuthorization** 를 더이상 앱 실행 직후에 호출 할 수 없고 앱이 완전히 실행된 후에만 사용할 수 있도록 변경하였습니다. 혹시라도 앱 실행 직후에 이 팝업을 호출한다면 팝업 호출 시점을 변경해야 합니다.


<br/>

그렇다면 IDFA는 무엇일까요?


#### IDFA(IDentifier For Advertisers)

IDFA(IDentifier For Advertisers) 광고주 식별자란 Apple에서 사용자의 기기에 할당한 임의 기기 식별자를 의미합니다. 광고주는 이를 사용해 데이터를 추적해 맞춤형 광고를 제공합니다. IDFA는 개인 정보를 노출하지 않고 사용자를 추적하고 식별하는데 사용됩니다. 이러한 IDFA는 iOS에서 모바일 광고 캠페인을 트래킹하는 가장 정확한 방법입니다.


<br/>

## 2.Xcode13

Xcode13도 iOS15와 마찬가지로 큰 변화가 없었던 업데이트였습니다. Xcode13에서 눈에띄는 변화라고 하자면 팀 개발 기능이 추가되었다는 부분입니다. Xcode Cloud 뿐만 아니라 Github, Bitbucket 및 GitLab 협업 기능과 완벽히 작업을 할수 있게 되었는데요. 이에 따라 Xcode 내부에서 바로 pull request와 시작, 검토, 주석달기 및 병합까지 가능해졌습니다. 코드 내에서 팀원의 주석을 볼 수 있고 코드 파일의 두개 버전을 신속하게 비교해볼 수 있게 변화된 것이 특징입니다.



## 3.Doctalk

저희 닥톡에서는 이번에 Xcode13으로 버전 업데이트를 함과 동시에 앱 타겟 최소버전을 iOS11에서 iOS13으로 올리는 업데이트를 시행하게 되었습니다. iOS13으로 버전이 업데이트 되었을 당시 가장 중요했던 포인트는 크게 2가지가 있었습니다.(사실 이 외에도 많았겠지만 제 생각으로는 이 두개가 가장 큰 변화였다고 생각되었습니다.)

- 다크모드 대응
- Modal presentation 변경 대응


### 다크모드 대응

다크모드 대응과 관련해서는 이미 많은 글들이 존재할것입니다. 이러한 다크모드는 이미 WWDC2019부터 소개되었던 것으로 컨텐츠에 더 많은 집중을 시키기 위해 나온것이라고 합니다. [HIG 읽어보기](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/dark-mode/)

이러한 의도에 따라서 HIG에서는 다크 및 라이트 두개 모드에서 모두 다 테스트를 해보는 것을 권장하고 있습니다. 뿐만 아니라 색의 대비가 적당한지 또한 반드시 확인해보라고 합니다. 그 이유는 단순하게 어두운 배경에 글자색이 비슷한 컬러를 사용하고 있다면 사용자 입장에서 제대로 보이지 않을 것이기 때문입니다.


#### 다크모드 대응방법 1

앱 전반적으로 UIUserInterfaceStyle을 .light로 강제시키는 방법입니다.

- Info.plist에 `UIUserInterfaceStyle`를 `light`로 설정
- APPDelegate의 didFinishLaunch 메소드에서 `window?.overrideUserInterfaceStyle = .light` 추가

두개 방법 중 하나를 택하시면 됩니다. 그런데 두번째 방법의 경우 window에 오버라이드 하게 되면 그에 속한 모든 뷰에 오버라이드 되기 때문에 아래 코드처럼 사용하시길 바랍니다.

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions  launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    ...
    if #available(iOS 13.0, *) {
      window?.overrideUserInterfaceStyle = .light
    }
    ...
}
```

#### 다크모드 대응방법 2

- `traitCollectionDidChange:`를 통해 TraitCollection 변경을 감지


<br/>



### Modal presentation 변경 대응

iOS13에 들어와 새로운 presentation style이 추가됨과 함께 새로운 인터랙션까지 변화가 생겼습니다.

![Modal presentation]({{ site.url }}{{ site.baseurl }}/images/2021/iOS/att2.png)

새로운 프레젠테이션 스타일은 사용자가 현재 어느 컨텍스트에서 현재 페이지가 있는지 더 알기 쉽게 표현되고, 페이지를 닫으려고 하는 상황에서 기존에 여러번 닫기 혹은 뒤로가기 버튼을 누르는 것 대신 `pull-to-dismiss`할 수 있는 제스쳐를 제공하고 있습니다.


#### pull to dismiss 제스터의 등장

모달뷰에서 pull-to-dismiss 할 수 있게 기본적으로 제공이 됨으로써 기본적인 UX가 바뀌게 되었습니다.

기존 모달 방식에서는 close 혹은 back, save 버튼을 통해 뷰 디스미스를 진행했습니다. 이때는 뷰의 디스미스를 버튼을 통해 타이밍을 잡고, 디스미스 전에 해주어야할 일들을 저장해놓았는데요. 그런데 이번 새로운 제스처의 등장과 함께 디스미스하는 타이밍 하나를 더 잡아야하는 이슈가 발생하게 되었습니다. 예로들어 기존에 save, cancel를 통해 명확히 사용자의 의도를 파악 할 수 있었는데, 이번 pull-to-dismiss를 사용하게 된다면 정확히 사용자가 save를 원하는지 cancel을 원하는지 정확히 판단하는 것이 어려워지게 되었습니다.

그럼에도 이를 대응하기 위해서는 기존 방식을 최대한 유지하는 차원에서 `.fullscreen` 방식을 모달에 적용하게 되었습니다.

- iOS12 이전 버전에서

```swift
let baseVC = BaseViewController()
present(baseVC, animated: true)
```

- iOS13 이후 버전에서

```swift
let baseVC = BaseViewController()
baseVC.modalPresentationStyle = .fullscreen
present(baseVC, animated: true)
```

이와같이 사용하는 것 입니다.


<br/>



### 끝으로...

혼자서 하나의 프로젝트를 길게 개발하지 않는 한, 혼자하는 프로젝트 내에서 큰 변화를 맞이하는 경험을 하기는 쉽지 않다고 생각합니다. 저 또한 닥프렌즈를 들어오기 전까지 os 최소 버전을 변경해 본다던가 xcode를 업데이트 함으로써 deprecated를 수정해보는 경험을 해보지는 못했었는데요. (이번 xcode13의 업데이트가 그리 많지 않았어서 다행이라는 생각도 했습니다...ㅎㅎ) 이번글에서는 최소 타겟을 iOS13으로 올림으로써 겪었던 다크모드, pull-to-dismiss와 관련된 글이 주를 이뤘지만 이 외에도 제가 겪었던 문제와 이에 대한 해결방안들을 계속해서 정리해 나갈 예정입니다.


끝까지 읽어주셔서 감사합니다 :)
