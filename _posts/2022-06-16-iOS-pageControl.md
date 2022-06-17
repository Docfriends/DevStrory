---
layout: post
title: "iOS UIPageControl 사용해보기"
description: "iOS UIPageControl 사용방법에 대해 정리합니다."
date: 2022-06-16
tags: [Swift, iOS, Docstep, UIPageControl]
writer: zehye
category: iOS
comments: true
share: true
---

## UIPageControl 사용해보기

이번 프로젝트에서 저는 UIPageControl을 UICollecionView와 함께 사용한 경험이 있습니다.<br>
정확히는 테이블뷰 셀 위에 컬렉션뷰를 놓았고, 그 컬렉션뷰 셀에 대한 페이지 컨트롤을 동작하게 만들어 놓았습니다. 

다음 사용방법은 아래와 같습니다. 

```swift 
class HomeTableViewCell: UITableViewCell{
    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var pageControl: UIPageControl!

    override func awakeFromNib() {
        super.awakeFromNib()

        // pageControl 
        pageControl.numberOfPages = 2
        pageControl.currentPage = 0
        pageControl.pageIndicatorTintColor = UIColor.white.withAlphaComponent(0.3)
        pageControl.currentPageIndicatorTintColor = UIColor(named: "7A7BDA")
        pageControl.transform = CGAffineTransform(scaleX: 1.3, y: 1.3)
    }
}

extension HomeTableViewCell: UICollectionViewDelegate, UICollectionViewDataSource {
    func scrollViewWillEndDragging(_ scrollView: UIScrollView, withVelocity velocity: CGPoint, targetContentOffset: UnsafeMutablePointer<CGPoint>) {
        let page = Int(targetContentOffset.pointee.x / self.frame.width)
        self.pageControl.currentPage = page
      }
    
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let width = scrollView.bounds.size.width
        let x = scrollView.contentOffset.x + (width/2)
        
        let newPage = Int(x/width)
        if pageControl.currentPage != newPage {
            pageControl.currentPage = newPage
        }
    }
}
```

이때 여기서 가장 중요한 포인트는 코드에 있지않습니다. 

일반적으로 생각해보면 페이지컨트롤이 컬렉션뷰 안에 존재할것같다고 생각할수도 있습니다. <br>
그렇지만 그렇지 않습니다. 컬렉션뷰 바깥에 같은 동일선상에 존재하고 있어야 합니다. 

![UIPageControl]({{ site.url }}{{ site.baseurl }}/images/2022/iOS/docstep8.png)
