---
layout: post
title: "현업에서 사용해 본 UITableView"
description: "현업에서 사용해 본 UITableView Delegate, DateSource에 대해 설명합니다."
date: 2021-08-31
tags: [UITableView, Delegate, DataSource]
writer: zehye
category: iOS
comments: true
share: true
---

안녕하세요. 닥프렌즈 iOS 개발자 박지혜입니다. iOS 개발을 하다보면 많은 화면에서 UITableView를 사용해보게 됩니다. 제가 지금까지 개인 프로젝트를 진행하면서 사용해보았던 UITableView의 delegate, datasource 프로토콜 메서드와 실제 닥프렌즈에 들어와 사용해본 메서드들을 정리해보도록 하겠습니다.  


## UITableView

UITableView는 iOS 어플리케이션에서 많이 활용하는 사용자 인터페이스로 리스트 형태를 지닌것이 특징입니다. <br>
이러한 UITableView 객체는 datasource와 delegate가 없다면 정상적으로 동작하기 어렵기에 반드시 두 객체가 필요합니다.


### UITableView Datasource

UITableView Datasource객체는 **UITableViewDataSource** 프로토콜을 채택합니다.

데이터소스는 테이블뷰를 생성하고 수정하는데 필요한 정보를 테이블뷰 객체에 제공하는 역할을 합니다. <br>
**@required** 로 선언된 메서드는 UITableViewDataSource 프로토콜을 채탁한 타입에 필수로 구현해야합니다.

그렇기 때문에 기본적으로 테이블뷰를 사용해보았다면 아래 두 메서드는 반드시 사용해본 경험이 있을 것입니다.

```swift
func tableView(UITableView, numberOfRowsInSection: Int)
func tableView(UITableView, cellForRowAt: IndexPath)
```

1. 각 섹션에 표시할 행의 개수를 묻는 메서드이며
2. 두 번째 메서드는 특정 위치에 표시할 셀을 요청하는 메서드입니다.

이외에 추가적으로 사용해봤을 메서드는 아래 메서드입니다.

```swift
func numberOfSections(in: UITableView)
```

위 메서드는 테이블 뷰 총 섹션의 개수를 묻는 메서드입니다. <br>
그렇지만 이 외에도 datasource에서는 더 많은 메서드들을 지원하고 있습니다.

```swift
// 특정 섹션의 헤더 혹은 푸터 타이틀을 묻는 메서드
func tableView(UITableView, titleForHeaderInSection: Int)
func tableView(UITableView, titleForFooterInSection: Int)

// 특정 위치의 행을 삭제 또는 추가 요청하는 메서드
func tableView(UITableView, commit: UITableViewCellEditingStyle, forRowAt: IndexPath)

// 특정 위치의 행이 편집 가능한지 묻는 메서드
func tableView(UITableView, canEditRowAt: IndexPath)

// 특정 위치의 행을 재정렬 할 수 있는지 묻는 메서드
func tableView(UITableView, canMoveRowAt: IndexPath)

// 특정 위치의 행을 다른 위치로 옮기는 메서드
func tableView(UITableView, moveRowAt: IndexPath, to: IndexPath)
```



### UITableView Delegate

UITableView Delegate객체는 **UITableViewDelegate** 프로토콜을 채택합니다.

delegate는 테이블뷰의 시각적인 부분을 수정해주고, 테이블 뷰의 개별 행 편집 등을 도와주는 역할을 합니다.<br>
delegate에는 datasource와는 달리 필수로 구현해야하는 메서드는 없지만 흔히 사용하는 메서드가 존재합니다.


```swift
func tableView(UITableView, didSelectRowAt: IndexPath)
```

위 메서드는 지정된 행이 선택되었음을 알려주는 메서드로 해당 행이 눌렸을 때 행해질 행위에 대한 코드가 담기게 됩니다.<br>
외에도 아래와 같이 다양한 delegate 메서드들이 존재합니다.


```swift
// 특정 위치 행의 높이를 묻는 메서드
func tableView(UITableView, heightForRowAt: IndexPath)

// 특정 섹션의 헤더뷰 또는 푸터뷰를 요청하는 메서드
func tableView(UITableView, viewForHeaderInSection: Int)
func tableView(UITableView, viewForFooterInSection: Int)

// 특정 섹션의 헤더뷰 또는 푸터뷰의 높이를 물어보는 메서드
func tableView(UITableView, heightForHeaderInSection: Int)
func tableView(UITableView, heightForFooterInSection: Int)

// 테이블뷰가 편집모드에 들어갔음을 알리는 메서드
func tableView(UITableView, willBeginEditingRowAt: IndexPath)

// 테이블뷰가 편집모드에서 빠져나왔음을 알리는 메서드
func tableView(UITableView, didEndEditingRowAt: IndexPath?
```

이렇게 많은 메서드들이 존재하지만 실제로 제가 개인 프로젝트를 진행할때는 아래 메서드들만을 주로 사용해왔습니다.

```swift
// tableView datasource
func numberOfSections(in: UITableView)
func tableView(UITableView, cellForRowAt: IndexPath)

func tableView(UITableView, numberOfRowsInSection: Int)

// tableView delegate
func tableView(UITableView, didSelectRowAt: IndexPath)
```

필수로 사용해야하는 두 메서드를 제외하고 사용해본 메서드는 두개 정도 뿐이었습니다. <br>
그러나 사실 문서에만 들어가보아도 tableView에는 다양한 delegate메서드와 datasource메서드가 존재합니다.

저희 닥프렌즈에서도 제가 기존에 사용했던 메서드 이외 정말 다양한 메서드들을 사용하고 있었습니다.

그중 가장 흥미로웠던 메서드는 아래 메서드입니다.

```swift
func tableView(_ tableView: UITableView,
trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration?

func tableView(_ tableView: UITableView,
leadingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration?
```

한번도 아직 사용해본적은 없었지만, 테이블뷰를 제대로 사용해본다면 꼭 사용해 볼 법한 메서드입니다.<br>
위 메서드의 의미는 간단합니다.

1. 첫 번째 메서드는 우측에서 스와이프 했을 때 표시할 내용을 반환해주는 메서드
2. 두 번째 메서드는 좌측에서 스와이프 했을 때 표시할 내용을 반환해주는 메서드 입니다.

아이폰에서 리스트 형식의 데이터를 보여주는 화면은 대부분 테이블뷰를 사용하고 있습니다(아닌경우도 있지만..)<br>
이러한 테이블 뷰를 유저가 사용할 때 가장 많이 발생되는 유저의 행동은 **스와이프** 이죠.

스와이프를 함으로써 행을 삭제한다거나의 이외의 행동을 하도록 유도할 것이며 이를 도와주는 메서드가 위 메서드입니다.

위 메서드를 사용한 간단한 실습코드를 공유합니다 :)


```swift
class ViewController: UIViewController {
  override func viewDidLoad() {
    self.tableView.delegate = self
    self.tableView.dataSource = self
  }
}

extension ViewController: UITableViewDelegate, UITableViewDataSource {
  func tableView(_ tableView: UITableView,
  trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
    let alert = alertAction(at: indexPath)
    let detete = deleteAction(at: indexPath)

    return UISwipeActionsConfiguration(actions: [delete, alert])
  }

  func tableView(_ tableView: UITableView,
  leadingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
    let complete = completeAction(at: indexPath)
    return UISwipeActionsConfiguration(actions: [complete])
  }
}
```

셀의 우측을 스와이프 했을때 delete, alert 변수를 생성하고 셀 좌측 스와프를 했을때 complete 변수를 생성합니다. 이렇게 생성된 변수는 UISwipeActionsConfiguration 함수를 호출할 때 인자로 넣어주는 것이 특징입니다.

그리고 추가적으로 우측으로 스와이프를 할때 **[delete, alert]** 순서로 리턴을 해주고 있는데, 중요한 것은 가장 맨 마지막에 들어간 것이 실제 화면에서는 제일 앞으로 나오게 됩니다!! 즉, **실제 보이는 순서는 alert, delete인 것입니다.**


```swift
func alertAction(at indexPath: IndexPath) -> UIContextualAction {
  let alerts = alertList[indexPath.row
  let action = UIContextualAction(style: .normal, title: "알림") {(_, _, success) in
    success(true)
  }
  action.backgroundColor = UIColor.blue
  return action
}

func deleteAction(at indexPath: IndexPath) -> UIContextualAction {
  let action = UIContextualAction(style: .destructive, title: "삭제") {(_, _, success) in
    self.alertList.remove(at: indexPath.row)
    self.tableView.deleteRows(at: [indexPath], with: .automatic)
    success(true)
  }
  action.backgroundColor = UIColor.red
  return action
}

func completeaction(at indexPath: IndexPath) -> UIContextualAction {
  let action = UIContextualAction(style: .normal, title: "완성") {(_, _, success) in
    success(true)
  }
  action.image = UIImage(named: "")
  action.backgroundColor = UIColor.yellow
  return action
}
```


<br/>

## 마지막으로

그동안 개인 혹은 팀 프로젝트를 하면서는 저는 항상 사용하던 테이블 뷰 메서드들 만을 사용했었습니다. 하지만 현업에서는 조금 더 다양하게 사용하는 모습을 볼 수 있었습니다. 사용자에게 좀더 친숙하면서도 편리한 환경을 제공하기 위해 다양한 메서드들을 숙지해보는 것이 좋을 것 같다는 생각을 가지게 되었습니다. 앞으로도 재밌으면서도 공부할 만한 내용이 생길 때마다 블로그에 지속적인 업데이트를 진행해보도록 하겠습니다 :)

여기까지 읽어주셔서 감사합니다.
