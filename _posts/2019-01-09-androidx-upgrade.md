---
layout: post
title: "Migrating to AndroidX"
description: "AndroidX를 Migrate 하면서 겪은 이슈 공유"
date: 2019-01-09
tags: [AndroidX, Migrating, Glide, Lottie]
writer: TejPak
category: Android
comments: true
share: true
---

# AndroidX Migration 적용기

###  AndroidX가 나온 이유

Android는 기기 파편화 및 OS 파편화로 인해 동일한 디자인 패턴 적용이 어려웠습니다.  또한 OS 파편화로 좋은 기능조차 하위버전에 쓸수가 없게 되어서 신규기능 사용이 어려워 졌습니다.
그래서 Support Library가 생겨났고, v4, v7 v8, v17 등 많은 Support Library가 생성되었습니다.
하지만 그로인해 새로운 파편화가 진행 되었고 파편화를 줄이기 위해 AndroidX가 나왔습니다.

### 도입 이유

닥톡 서비스에 Lottie를 적용해서 애니메이션을 넣는 중에 2.8.0 은 AndroidX 대응으로만 되어 있고, 기존 Support Library를 쓰는 프로젝트는 모두 2.7.0 으로 사용이 가능합니다.
그래서 도입할 시기가 왔다고 판단해서 도입을 했습니다.

### AndroidX 적용 방법

1. Android Studio 3.2 이상이 설치되어야 합니다.

2. Refactor -> Migrate to AndroidX... 를 클릭 합니다.
![Android Studio 3.2 Menu]({{ site.url }}{{ site.baseurl }}/images/2018/androidx-upgrade/screen-shot-01.png)

3. 아래와 같은 내용이 나오면 꼭! **Backup project as Zip file**을 체크해주세요.<br />해당 내용은 아래에서 더 설명 드리겠습니다.
![Migration]({{ site.url }}{{ site.baseurl }}/images/2018/androidx-upgrade/screen-shot-02.png)

4. 백업 파일은 잘 보관해주세요.

5. 충돌나는 부분이나 확인이 필요한 부분을 최종 물어볼 때 확인 후 OK를 누르면 완료 됩니다.

6. 끝!

### 백업이 필요한 이유

위 적용한 방법으로 확인 후 **Rebuild Project** 를 하면 문제 없이 Build가 되고 실행 시 실행도 정상적으로 됩니다.<br />
하지만 실제로 어플리케이션을 실행해서 사용하다 보면 강제종료 혹은 정상 작동을 안하는 기능들이 확인 됩니다.<br/>
<br/>
그래서 해당 클래스를 열어보면 아래 스크린샷 처럼(참고를 위해 강제로 만든 화면입니다. 실제론 더 처참했어요.)
<br/>
![Error]({{ site.url }}{{ site.baseurl }}/images/2018/androidx-upgrade/screen-shot-03.png)
이렇게 클래스들이 에러가 났었습니다.

이유는 제가 사용하는 **Open Source Library 에서 AndroidX 대응이 되지 않아 오류**가 발생하는 것인데, 그걸 Android Studio에서는 그냥 빌드가 되었던 것입니다.
이때는 벌써 정상인줄 알고 commit도 하고, 다른 기능 수정까지 한 상태였습니다. 그래서 다시 백업파일 본으로 복구 시키고(혹은 형상관리툴을 사용하시면 롤백) 돌아가는 작업이 필요합니다.

### AndroidX 대응 방법

1. Open Source Library 중 Support Library 는 Library를 사용하지 않는다.
  * 전 그럴 수 있는 상황이 아니라서 패스 했습니다.

2. Open Source Library 를 Fork 하여 AndroidX 대응 후 Pull Request 하기
  * AndroidX 혹은 Support Library 28 이상 사용 시엔 최소 SDK는 14 입니다.  일부 Library는 9 버전도 있어서, 수정해서 Pull Request를 해도 안될 수도 있고, 개발자가 이제 작업을 안해서 Merge 가 안될 수도 있습니다.
  * 반응이 없는 프로젝트는 Fork한 Library를  jitpack 에 올려서 사용
  * 하지만 하다보면 이것도 노가다라 Open Source를 많이 사용하는 프로젝트일 경우 시간이 오래 걸림

* 제가 찾은 대응 방법이였고 실제로 그렇게 시도는 했지만 모두 실패하였습니다. 그래서 모두 소스를 롤백하였습니다.

### 개인적인 생각

새로운 Support Library, Open Source Library가 나올 때 마다 최신 버전 적용하여 대응을 했지만, AndroidX는 예상보다 매우 큰 작업이라고 판단됩니다.  개별로 쓰시는 Open Source가 AndroidX 대응이 될 때 까지는 AndroidX 대응은 미루는걸 추천합니다.

