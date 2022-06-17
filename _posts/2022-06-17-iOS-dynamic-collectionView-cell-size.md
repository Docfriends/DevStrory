---
layout: post
title: "iOS CollectionView Cell Dynamic Size 조절해주기"
description: "iOS CollectionView Cell Dynamic Size 조절해주는 방법에 대해 정리합니다."
date: 2022-06-17
tags: [Swift, iOS, Docstep, UICollectionViewCell, Dynamic Size]
writer: zehye
category: iOS
comments: true
share: true
---

## 컬렉션뷰 셀의 사이즈를 동적으로 조절하고 싶다면?

![CollectionViewCell]({{ site.url }}{{ site.baseurl }}/images/2022/iOS/docstep9.jpeg)

위 사진같이 셀을 동적으로 사이징 처리 해주고 싶다면?

구글링해보면 너무 어렵게만 설명되어있는데요.<br>
사실 별거 없습니다!


```swift
@IBOutlet weak var collectionView: UICollectionView!

func initUI() {
        self.collectionView.delegate = self
        self.collectionView.dataSource = self
        let layout = UICollectionViewFlowLayout()
        layout.estimatedItemSize = UICollectionViewFlowLayout.automaticSize
        self.collectionView.collectionViewLayout = layout
}
```

이렇게 해주면 셀 안의 데이터 크기에 맞게 알아서 사이징이 됩니다.



<br/>


### 문제발견

그런데 문제를 하나 발견했습니다.<br>
위에서 제시한 방법은 뷰컨에 바로 컬렉션뷰와 셀이 놓여져 있을떄만 적용이 되는 것 같았습니ㄴ다.

예로 들자면 컬렉션뷰 셀을 재사용하기 위해 셀을 nib로 따로 만들어놓고 이를 불러와서 사용해야한다면?

적용이 되지 않더라구요..!

그래서 제가 사용한 방법은 아래와 같습니다.<br>
우선 상황은 아래와 같습니다.


<br/>


1. 뷰컨에서 테이블뷰를 사용하고 있고 테이블뷰 셀 안에 컬렉션 뷰가 있다.
2. 컬렉션 뷰 셀은 재사용을 위해 따로 nib를 만들어 놓았다.
3. 따라서 테이블뷰 셀 파일에서 컬렉션뷰를 register하고 있다.



<br/>



#### tableviewCell file

```swift
class DataTableViewCell: UITableViewCell {
  @IBOutlet weak var collectionView: UICollectionView!

  let list = ["밥", "된장찌개", "계란말이", "교촌허니콤보", "떡볶이"]
  let calList = ["12kCal", "365kCal", "1234kCal", "135kCal", "567kCal"]

  override func awakeFromNib() {
        super.awakeFromNib()
        initUI()
  }

  func initUI() {
    self.collectionView.register(UINib(nibName: "CalorieCollectionViewCell", bundle: nil), forCellWithReuseIdentifier: "CalorieCell")
  }
}

extension DataTableViewCell: UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        let name = self.list[indexPath.row]
        let cal = self.calList[indexPath.row]

        let attributes = [NSAttributedString.Key.font: UIFont.systemFont(ofSize: 14)]

        let nameSize = (name as NSString).size(withAttributes: attributes as [NSAttributedString.Key: Any])
        let calSize = (cal as NSString).size(withAttributes: attributes as [NSAttributedString.Key: Any])
        return CGSize(width: (nameSize.width + calSize.width) + 20, height: 35)
    }
}
```

이렇게 셀 안에 들어갈 string의 size를 측정해 직접 넣어주는 방법을 사용해보았습니다!<br>
더 좋은 방법이 있다면 공유 부탁드립니다 :) 