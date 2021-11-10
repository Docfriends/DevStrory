---
layout: post
title: "Advances CollectionView - Diffable Data Source"
description: "Diffable DataSource를 설명합니다."
date: 2021-11-10
tags: [iOS, WWDC, Diffable DataSource]
writer: zehye
category: iOS
comments: true
share: true
---

## Introducing Diffable Data Source

WWDC19에서 애플이 Diffable DataSource를 소개하였습니다. 그렇기 때문에 당연하게도 iOS13부터 사용이 가능합니다.<br>
DataSource하면 떠오르는 두개가 있죠.

1. UITableViewDataSource
2. UICollectionViewDataSource

그렇기에 어찌보면 조금 당연하게도 Diffable DataSource에도 아래 두개가 존재합니다.

1. UITableViewDiffableDataSource
2. UICollectionViewDiffableDataSource

그러면 Diffable DataSource는 우리가 기존에 채택했던 DataSource대신 채택하면 되는 프로토콜인걸까요?

정답은 NO입니다.


<br/>


> 우리가 이전에 사용하던 UITableViewDataSource/UICollectionViewDataSource는 프로토콜이기때문에 보통 UIViewController가 이를 채택하곤 했습니다.          
그러나 UITableViewDiffableDataSource/UICollectionViewDiffableDataSource는 프로토콜이 아닌 제네릭 클래스입니다.               
심지어 UITableViewDiffableDataSource/UICollectionViewDiffableDataSource가 UITableViewDataSource/UICollectionViewDataSource를 채택합니다.


<br/>


그렇다면 이러한 Diffable DataSource를 왜 만든걸까요?

실제 우리가 이전처럼 컬렉션뷰를 구성한다고 하면 아래와 같은 코드가 필요합니다.

```swift
func numberOfSection(in collectionView: UICollectionView) -> Int {
    return
}

func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return
}

func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    return
}
```

이제는 좀 기계적으로 사용하는 코드이다 보니 익숙하기도 하고 빠르게 작성이 가능하죠. <br>
이 코드 속에서 만약 웹의 요청을 받아 UI가 변화되었다면 우리는 무엇을 해야할까요?

바로 **reloadData** 입니다.

이를 하지 않으면 우리는 에러를 마주하게 됩니다. <br>
실제 WWDC에서도 이를 사용하는 방법또한 괜찮은 것이라고 말합니다.

다만 reloadData를 사용하면 애니메이션 되지 않은 상태로 데이터가 두둑 두둑 하고 나타나는 특징이 있죠.<br>
이는 UX적으로 조금 떨어지는 부분이 되기도 하죠.


그래서 애플은 완전히 새로운 접근방식을 도입합니다.


<br/>


## Diffable DataSource

iOS13에 도입된 Diffable DataSource는 새로운 `snapshots`이라는 개념을 추가해 UI 상태 관리를 간소화합니다.

이 스냅샷은 고유한 섹션 및 항목 식별자를 사용해 전체 UI상태를 **캡슐화** 합니다.<br>
UITableView/UICollectionView 를 업데이트할때 새 스냅샷을 생성하여 현재 UI 상태로 스냅샷을 채운 다음 데이터 소스에 적용을 합니다. 그러면 Diffable DataSource는 개발자의 추가 작업없이 차이점을 계산해 자동으로 애니메이션을 생성합니다.

더 나아가 iOS14에서 `section shapshots`이라는 새로운 스냅샷 타입이 생겼습니다.

이름에서도 유추할 수 있듯 section snapshots은 하나의 섹션 데이터를 캡슐화해줍니다.

1. DataSource로 하여금 section-sized 단위로 데이터를 구성하기 쉽게 하기 위해
2. outline 스타일의 UI rendering을 지원하는데 필요한 계층적 데이터 모델링을 허용하기 위해

iOS14에서는 이렇게 새로운 향상이 이루어졌는데, 그렇기 때문에 iOS14에서 찾을 수 있는 시각적 디자인이 바로 outline style 입니다.


![Diffable DataSource]({{ site.url }}{{ site.baseurl }}/images/2021/iOS/diff1.png)


위 사진을 풀이하면 다음과 같습니다.

1. 첫번째 섹션(=horizontally scrolling section): single section snapshot으로 구현되어 해당 부분에서 사용되는 콘텐츠를 모델링함
2. 두번째 섹션(expandable-collapsible outline style): hierarchy data를 모델링함
3. 세번째 섹션(list section): single section snapshot 해당 섹션 다시 모델링함


<br/>


즉 위 그림을 보면 Diffable DataSource를 세개의 개별 섹션 스냅샷으로 구성했으며 각 섹션은 단일 섹션의 컨텐츠를 나타내고 있음을 알 수 있습니다.


<br/>


## 실습

순서는 아래와 같습니다.

1. Connect a diffable data source to your collection view.
2. Implement a cell provider to configure your collection view's cells.
3. Generate the current state of the data.
4. Display the data in the UI.


### Connect a diffable data source to your collection view.

Diffable DataSource를 사용할 UITableView/UICollectionView에 연결하려면 우선 Diffable DataSource를 만들어야 합니다. 이는 프로토콜이 아닌 제네릭 함수입니다.

```swift
class UICollectionViewDiffableDataSource<SectionIdentifierType, ItemIdentifierType> : NSObject where SectionIdentifierType: Hashable, ItemIdentifierType: Hashable
```

이때 중요한 점은 둘다 **Hashable** 을 준수하는 타입만 들어갈 수 있습니다.


<br/>


#### SectionIdentifierType

enum은 모든 case, 관련된 값이 Hashable을 준수하면 자동으로 동기화해줍니다.

```swift
enum Section: CaseIterable {
  case main
}
```


#### ItemIdentifierType

보여줄 item이 단순 String 이기 때문에 그냥 String으로 넣어줍니다.


```swift
enum Section: CaseIterable {
  case main
}

UICollectionViewDiffableDataSource<Section, String>
```

그러면 이제 collectionView와 연결해주는 작업과 provider 구성작업이 남았습니다.

```swift
UICollectionViewDiffableDataSource<Section, String>(collectionView: self.collectionView) { (collectionView, indexPath, item) -> UICollectionViewCell? in
    // code
}
```


<br/>


### Implement a cell provider to configure your collection view's cells.

익숙할 셀 작업입니다.

```swift
self.dataSource = UICollectionViewDiffableDataSource<Section, String>(collectionView: self.collectionView) { (collectionView, indexPath, item) -> UICollectionViewCell? in  
    guard let cell = collectionView.dequeueReusableCell(withreuseIdentifier: "cell", for: indexPath) as? DataCollectionView else { preconditionFailure() }
    cell.configure(text: item)
    return cell
}
```

위와 같은 방식은 스토리보드에 셀이 있는 경우인데요. 만약 .xib나 코드로 만들어진 경우에는 반드시 register를 해주어야 합니다.

```swift
self.collectionView.register(DataCollectionView.self, forCellWithReuseIdentifier: "cell")
```

그런데 이렇게 register를 하지않고 Diffable DataSource를 만들때 register와 configure작업을 할 수 있기도 합니다.

```swift
let cellRegisteration = UICollectionView.CellResgistration<DataCollectionView, String> { (cell, indexPath, item) in
    cell.configure(text: item)
}

self.dataSource = UICollectionViewDiffableDataSource<Section, String>(collectionView: self.collectionView) {
    (collectionView, indexPath, item) -> UICollectionViewCell? in
    return collectionView.dequeueConfigureReusableCell(using: cellResgistration, for: indexPath, item: item)
}
```

<br/>


### Generate the current state of the data.

이제 스냅샷을 구성합니다.

```swift
func performQuery(with filter: Stirng?) {
    // 변경될때마다 컬렉션뷰에 보여지는 데이터가 달라집니다.
    let filtered = self.arr.filter { $0.hasPrefix(filter ?? "")}

    // 스냅샷 생성
    var snapshot = NSDiffableDataSourceSnapshot<Section, String>()
    // 스냅샷은 section, item으로 구성되어 추가, 삭제 등의 내용을 구성
    snapshot.appendSection([.main])
    snapshot.appendItem(filtered)
    // apply를 통해 적용
    self.dataSource.apply(snapshot, animatingDifferences: true)
}
```


<br/>


### Display the data in the UI.

Diffable DataSource에서는 **Apply** 만 하면 끝입니다.


<br/>


이렇게 하면 문제없지만, 단한가지 예외상황이 있습니다.


## Supplied item identifiers are not unique

SectionIdentifierType, ItemIdentifierType은 Hashable을 준수해야합니다.

그런데 만약 데이터에 중복되는 데이터가 있다면 어떻게 될까요?

> DiffableDataSource_Example[75856:2941803] *** Terminating app due to uncaught exception 'NSInternalInconsistencyException', reason: 'Fatal: supplied item identifiers are not unique.'

이와 같은 에러를 뱉어냅니다.

만약 이 둘중 하나라도 공통된 데이터가 존재한다면 고유하지않은 Hash값을 가지게 되는 것입니다.
Diffable DataSource는 고유한 해쉬값을 요구하는데, 이 identifier가 고유하지않다면 바로 오류가 발생하게 되는것이죠.

이를 해결하는 방법은 간단합니다.

유니크한 해쉬값을 갖도록 하는 것 입니다.


<br/>


### UUID를 사용하기

UUID는 타입, 인터페이스 및 기타 항목을 식별하는 데 사용할 수 있는 보편적으로 고유한 값 입니다.

```swift
struct Item: Hashable {
  let pid = UUID()
  let name: String
}
```

이렇게 정의하면 눈에 보이기에 같은 데이터일지라도 이들이 갖는 해쉬값은 다릅니다.



<br/>

## 끝으로...

이번 글에서는 Diffable DataSource에 대해 알아보았습니다.<br>
다음글에서는 위에 잠깐 언급했던 Modern Cell Configuration에 대해 정리해보는 글로 나타나도록 하겠습니다.

긴 글 읽어주셔서 감사합니다 🙇‍♀️
