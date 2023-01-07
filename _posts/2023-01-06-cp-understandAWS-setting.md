---
layout: post
title: "AWS를 잘 사용하기 위한 기초지식 이해하기."
description: "이번 글에서는 AWS를 사용하기 전 클라우드 컴퓨팅 시스템의 이해를 위해 기초적인 컴퓨팅 및 네트워크 지식을 다룹니다."
date: 2023-01-06
tags: [AWS, 가상화 기초, 클라우드]
writer: xxxx-jeung
category: BackEnd
comments: true
share: true
---
이번 글에서는 AWS를 사용하기 전 클라우드 컴퓨팅 시스템의 이해를 위해 기초적인 컴퓨팅 및 네트워크 지식을 다룹니다.  
이번 글을 정독하시면 아래와 같은 것들을 얻어가실 수 있습니다.

<aside>
💡 1. 자신의 서비스에 적절한 AWS 서비스를 선택할 수 있는 기초지식
💡 2. AWS 필요한 CS에 대한 간략한 이해
</aside>

### 그래서 클라우드가 뭔가요?

클라우드는 인터넷이 연결되어 있다면 언제 어디서든 원할 때 접속이 가능한 환경을 말합니다. 음악 스트리밍 서비스, 파일 스토리지 서비스 등 우리 주변에서도 클라우드 환경을 이용한 서비스를 손 쉽게 찾아볼 수 있습니다. 

휴대용기기가 처음 나왔을 때는 원하는 음악이나 동영상을 다운받아서 들고 다녀야했습니다. 우리는 필요할 경우에만 데이터를 다운 받지 평소에는 원하는 컨텐츠를 실시간으로 찾아서 보고, 듣고, 읽을 수 있는게 클라우드 컴퓨팅을 활용하여 구축되어 있기 때문입니다. 

### 그럼 클라우드랑 클라우드 컴퓨팅은 같은건가요?

같은 말은 아닙니다. 클라우드는 하나의 개념이라고 보면되고 클라우드 컴퓨팅은 클라우드라는 추상적인 개념을 구체화한 구현체라고 보셔도 괜찮을 것 같습니다. 

그래서 클라우드 컴퓨팅은 AWS, Azure 처럼 클라우드 환경에 구축된 인프라를 활용하는 서비스나 이를 사용하는 것을 말합니다.

[이후에는 기초 개념을 잡은 이후부터는 거의 대부분 클라우드는 클라우드 컴퓨팅을 말합니다.]

클라우드 컴퓨팅은 가상화 기술을 사용하여 언제 어디서든지 마음대로 서버나 인프라를 구축하여 운영할 수 있도록되어 있습니다. 이를 이용할 때 서버와 인프라를 대여하는 서비스를 제공하는게 주류입니다. 클라우드 컴퓨팅 서비스를 이용하면 클라우드 환경을 구축하기 위해 하드웨어, 네트워크 등 물리적인 설비를 직접 보유할 필요가 없습니다. 

### 클라우드 생태계에서 헷갈리는 용어들이 있어요

![aws_3]({{ site.url }}{{ site.baseurl }}/images/2023/AWS/aws_3.png) 
[](https://www.google.com/search?q=%ED%81%B4%EB%9D%BC%EC%9A%B0%EB%93%9C%EC%99%80+%EC%98%A8%ED%94%84%EB%A0%88%EB%AF%B8%EC%8A%A4&tbm=isch&ved=2ahUKEwilw-_g0rL8AhWsyYsBHTL2DWYQ2-cCegQIABAA&oq=%ED%81%B4%EB%9D%BC%EC%9A%B0%EB%93%9C%EC%99%80+%EC%98%A8%ED%94%84%EB%A0%88%EB%AF%B8%EC%8A%A4&gs_lcp=CgNpbWcQA1CXBVjbB2DsCGgAcAB4AIAB1AGIAYoFkgEFMC4zLjGYAQCgAQGqAQtnd3Mtd2l6LWltZ8ABAQ&sclient=img&ei=8-u3Y-X9PKyTr7wPsuy3sAY&bih=666&biw=1209#imgrc=6Rdfjii1iy8UAM)

“온프레미스 환경에서 클라우드로!” 많이들 들어보셨을 수도 있는 말입니다. 

클라우드는 대충 알겠고 그럼 온프레미스 뭘까요?

온프레미스란 오프라인 공간에 자사가 서버 등을 직접 구축하는 것을 말합니다. 온프레미스의 장점은 자사가 자유롭게 설계/운영을 할 수 있다는 것입니다. 이에 따라오는 것이 숙련된 기술자가 필수적이라는 것 입니다.

임대 서버와 구분이 헷갈릴 수 있는데 임대서버는 위치적 장소는 대여하지 않고 정말 서버만 대여하는 것을 말합니다. 한마디로, 임대 서버란 하드웨어와 하드웨어를 위한 공간은 임대 서버를 제공하는 회사에서 관리하고 임대한 회사는 서버만 소유하는 것을 말합니다.

그러면 클라우드의 반대말이 온프레미스일까요?

아닙니다. 온프레미스의 반대 의미는 임대나 공유를 말하고 이는 자사가 소유 * 운영하지 않고 임대하거나 공공장소에 구축된 것을 사용하는 형태입니다. 짧게 임대* 공유에 대해 언급하자면 임대,공유는 서버환경을 구성하는 회사에 의해 관리되기 때문에 제공 측의 규제를 지켜야하고 소프트웨어 업데이트나 구성 등의 자유도가 떨어집니다.

클라우드 컴퓨팅 시스템은 클라우드 서비스를 제공해주는 타사에서 구축한 서버 환경을 대여하여 사용하는 방식입니다. 사용자는 자유롭게 서버를 늘릴 수도 있고 스팩을 올릴 수도 있습니다. 추가적인 하드웨어 구매가 있을 필요도 없고 하드웨어를 위치시킬 공간이 필요없어서 추가적으로 임대를 해야하는 경우도 발생하지 않습니다.

클라우드에도 두 종류가 있습니다. AWS처럼 임대하는 공용클라우드, 자사에서 구축하는 사설 클라우드. 사실 어떻게 보면 사설 클라우드는 온프레미스와 비슷해보입니다. 그래서 우리가 일반적으로 알고 있는 클라우드 서비스는 공용 클라우드입니다.

각 회사들은 보안적 이슈나 재정적 사항들을 잘 고려하여 온프레미스 서버환경과 클라우드 서버환경 중에 선택해야합니다.

## 클라우드를 지탱하는 2가지 기술

클라우드는 가상화와 분산 처리라는 2가지 핵심 기술을 통해 사용자에게 편리한 인프라 구성 및 서비스 이용을 제공합니다. 이 두가지 기술은 따로 설명해도 방대한 양을 차지하기 때문에 여기서는 간략하게 다루겠습니다.

### 가상화랑 분산처리는 뭔가요?

우선 간략하게 설명하면

**가상화** : 한대의 물리적 컴퓨터를 여러대의 논리적 컴퓨터로 나눠 사용할 수 있게 한다.

**분산처리** : 수많은 요청을 여러대의 서버에 분산시켜 서버 한대에 가해지는 부하를 줄인다.

![aws_2]({{ site.url }}{{ site.baseurl }}/images/2023/AWS/aws_2.png) 

[https://brunch.co.kr/@ka3211/8](https://brunch.co.kr/@ka3211/8)

가상화란 하나의 물리적 머신에서 가상화를 관리하는 소프트웨어를 사용하여 가상 머신을 만드는 기술을 말합니다.이렇게 생성된 가상머신(이하 VM)은 물리적 역할 및 성능을 수행하지만, CPU와 메모리 및 스토리지와 같은 하나의 물리적 머신의 컴퓨팅 소스를 사용합니다. 대표적인 가상화 기술로는 컨테이너 가상화 기술인 Docker가 있습니다.

이렇게 만들어진 VM은 하나의 물리적 기능을 하는 서버처럼 만들어집니다. 클라우딩 컴퓨팅 서비스를 제공받는 사용자라면 가상화된 물리적 서버의 인스턴스를 대여하게 됩니다.

가상화 기술을 사용하게되면 어떤 장점이 있을까요?
크게 아래와 같은 5가지 장점이 있습니다.

1. **Server Consolidation** : 다양한 기능적 서버의 물리적 개수를 서버 1개로 통합함으로써 물리적 서버를 관리하는 비용이 줄게됩니다.
2. **Isolation** : 기능에 맞게 여러 개의 가상 머신으로 분리하여 실패율이나 보안적 취약에 잘 대처가 가능합니다.
3. **Efficiency** : 컴퓨팅 자원을 최대한의 효율로 사용할 수 있게되고 관리가 쉬워집니다.
4. **Flexibility** : 한 서버의 데이터를 마이그레이션하기 용이해집니다.

이렇게 하나의 회사에서 엄청난 규모의 물리적 장비를 가지고 가상화를 통해 사용자 마다 각각의 서버를 구축할 수 있는 서비스를 제공하여 보관장소의 한계는 해결이 되었습니다. 하지만 점점 많은 사용자가 자사의 클라우드 서비스를 이용할 수록 방대한 규모의 데이터가 밀려들어오게 될 것 입니다. 만약 한대의 서버에 요청이 몰리게되면 서버의 부하가 발생하고 서버가 다운될 수 있습니다.  이를 해결하는 기술이 분산 처리 기술입니다. 

분산처리는 로드밸런서라는 개념을 사용해서 지정된 서버에 요청을 분배하는 방식을 많이 사용합니다. 더 나아가면 서버를 어떻게 확장시킬 것인지, 분배 방식은 어떻게 할 것인지, 무중단 배포 정책을 어떤걸로 잡을 것인지 많은 것을 알아야합니다. 궁금하신 부분은 가상화, 분산처리방식의 키워드들을 가지고 구글링해보면 많은 자료들이 나옵니다.

## 클라우드 서비스의 제공 형태 : Saas, Iaas, Paas

클라우드 컴퓨팅 서비스도 클라우드에서 어디까지 서비스를 제공 하느냐에 따라 세가지 형태로 나눠집니다. 
가장 기본적인 계층인 Iaas 부터 가장 많은 서비스를 제공하는 SaaS까지 있습니다. 

**Iaas :** 

서비스로 제공되는 인프라, 클라우드 서비스 회사의 물리적 하드웨어를 가상화하여 사용자에게 떼어주는 방식의 형태입니다. 하드웨어만 클라우드 회사에서 관리하고 윈도우 깔고 드라이버 다운받고 모든 소프트웨어를 관리하는 방식입니다. 현재 자주 사용되는 AWS의 EC2가 대표적인 Iaas라고 볼 수 있습니다.

**Paas :**

플랫폼이 서비스로 제공되는 겁니다. 가상 컴퓨터까지도 클라우드 회사가 관리해줍니다. 사용자는 개발을하고 배포만 하면되는 형태입니다. 

**SaaS :**

아예 만들어진 서비스를 클라우드로 제공하는 것을 말합니다. 사용자들이 “인터넷”을 이용해서 바로 이요할 수 있는 서비스의 형태를 말합니다. 대표적으로 유투브, 드롭박스, OTT 등이 있습니다. 

![aws_1]({{ site.url }}{{ site.baseurl }}/images/2023/AWS/aws_1.png) 

[https://watermelon-sugar.tistory.com/19](https://watermelon-sugar.tistory.com/19)