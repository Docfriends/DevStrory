---
layout: post
title: "iOS SearchController 사용해보기"
description: "iOS SearchController 사용 방법에 대해 설명합니다."
date: 2022-06-02
tags: [Swift, iOS, Docstep, searchBar, searchController]
writer: zehye
category: iOS
comments: true
share: true
---

## SearchController 첫번째, 기본 셋팅해보기

닥스텝의 초기 서치바 구현은 searchController로 구현하였었습니다. <br>
그때 사용했던 내용을 정리해 공유드립니다 :) 


<br/>


### UISearchController 

저는 서치 컨트롤러를 셋팅해주는 함수 하나를 만들어줄 예정이며, 이 함수를 viewDidLoad에서 불러서 사용할 것입니다.


```swift
func setSearchControllerUI() {
    let searchController = UISearchController(searchResultsController: nil)
    self.navigationItem.searchController = searchController
}
```

위와 같이 initialize를 해줍니다. 

서치 컨트롤러 안에 서치바가 있기 때문에 서치바와 관련된 설정 코드들을 추가해줄수도 있습니다. 

```swift 
func setSearchControllerUI() {
    let searchController = UISearchController(searchResultsController: nil)
    searchController.searchBar.placeholder = "검색창입니다"

    self.navigationItem.searchController = searchController
}
```


<br/>


### 예제 코드


기본적으로 우리가 서치 컨트롤러를 사용하면 알아야할 프로퍼티들입니다. 

```swift 
func setSearchControllerUI() {
    let searchController = UISearchController(searchResultsController: nil)
    
    // set placeholder
    let placeholder = "검색창입니다"
    searchController.searchBar.placeholder = placeholder
    // searchController가 검색하는 동안 네비게이션에 가려지지 않도록 
    searchController.hidesNavigationBarDuringPresentation = false
    // searchBar cancel button text change (cancel을 취소로 텍스트 변경)
    searchController.searchBar.setValue("취소", forKey: "cancelButtonText")
    
    // placeholder릐 글꼴과 글자 크기 변경 
    let attributedString = NSMutableAttributedString(string: placeholder, attributes: [
        NSAttributedString.Key.font: UIFont(name: "Spoqa Han Sans Neo", size: 16) as Any,
        NSAttributedString.Key.foregroundColor: UIColor(white: 255/255, alpha: 0.3)
    ])
    searchController.searchBar.searchTextField.attributedPlaceholder = attributedString
    // searchBar의 textField의 배경색, 폰트, 글자크기 변경
    searchController.searchBar.searchTextField.backgroundColor = .clear
    searchController.searchBar.searchTextField.font = UIFont(name: "Spoqa Han Sans Neo", size: 16)
    
    // clear button 설정 
    if let button = searchController.searchBar.searchTextField.value(forKey: "_clearButton") as? UIButton {
        let templateImage = button.imageView?.image?.withRenderingMode(.alwaysTemplate)
        button.setImage(templateImage, for: .normal)
        button.tintColor = .white
    }
    
    // 서치 컨트롤러 왼쪽에 back button color 변경 
    searchController.searchBar.searchTextField.leftView?.tintColor = UIColor.white
    // searchBar cancel button color
    searchController.searchBar.tintColor = UIColor.white
    
    // navigation title 
    self.navigationItem.searchController = searchController
    self.navigationItem.title = "검색하기"

    // searchBar back button color
    self.navigationItem.searchController?.searchBar.barTintColor = UIColor.white

    // navigation item 스크롤 될때 사라지지 않게 
    self.navigationItem.hidesSearchBarWhenScrolling = false

    // navigation item back button > back text remove (back 문구 없애기)
    self.navigationController?.navigationBar.topItem?.backButtonDisplayMode = .minimal

    // navigation item back button 이미지 변경
    self.navigationController?.navigationBar.backIndicatorImage = UIImage(named: "icBack")
    self.navigationController?.navigationBar.backIndicatorTransitionMaskImage = UIImage(named: "icBack")
}
```


<br/>


## SearchController 두번째, 검색바 데이터 filtering 처리 해보기 

사실 우리가 검색 컨트롤러를 사용하는 이유는 아래와 같습니다. 

> 내가 검색한 내용이 실제 검색이 되어야한다.

제일 중요한 부분입니다. <br>
그러면 이제 그 제일 중요한 부분을 다뤄보도록 하겠습니다. 


<br/>


### 우선...

우선 기본적으로 제가 한 셋팅을 보여드리겠습니다. 

```swift 
class SearchViewController: UIViewController {
    @IBOutlet weak var tableView: UITableView!
    var arr = ["docstep", "hi", "hello", "nice", "to", "meet", "you"]

    override func viewDidLoad() {
        super.viewDidLoad()
        self.initUI()
        self.setSearchControllerUI()
    }
    
    func initUI() {
        self.tableView.delegate = self 
        self.tableView.dataSource = self 
    }

    func setSearchControllerUI() {
        let searchController = UISearchController(searchResultsController: nil)
        
        // set placeholder
        let placeholder = "검색창입니다"
        searchController.searchBar.placeholder = placeholder
        // searchController가 검색하는 동안 네비게이션에 가려지지 않도록 
        searchController.hidesNavigationBarDuringPresentation = false
        // searchBar cancel button text change (cancel을 취소로 텍스트 변경)
        searchController.searchBar.setValue("취소", forKey: "cancelButtonText")
        
        // placeholder릐 글꼴과 글자 크기 변경 
        let attributedString = NSMutableAttributedString(string: placeholder, attributes: [
            NSAttributedString.Key.font: UIFont(name: "Spoqa Han Sans Neo", size: 16) as Any,
            NSAttributedString.Key.foregroundColor: UIColor(white: 255/255, alpha: 0.3)
        ])
        searchController.searchBar.searchTextField.attributedPlaceholder = attributedString
        // searchBar의 textField의 배경색, 폰트, 글자크기 변경
        searchController.searchBar.searchTextField.backgroundColor = .clear
        searchController.searchBar.searchTextField.font = UIFont(name: "Spoqa Han Sans Neo", size: 16)
        
        // clear button 설정 
        if let button = searchController.searchBar.searchTextField.value(forKey: "_clearButton") as? UIButton {
            let templateImage = button.imageView?.image?.withRenderingMode(.alwaysTemplate)
            button.setImage(templateImage, for: .normal)
            button.tintColor = .white
        }
        
        // 서치 컨트롤러 왼쪽에 back button color 변경 
        searchController.searchBar.searchTextField.leftView?.tintColor = UIColor.white
        // searchBar cancel button color
        searchController.searchBar.tintColor = UIColor.white
        
        // navigation title 
        self.navigationItem.searchController = searchController
        self.navigationItem.title = "검색하기"

        // searchBar back button color
        self.navigationItem.searchController?.searchBar.barTintColor = UIColor.white

        // navigation item 스크롤 될때 사라지지 않게 
        self.navigationItem.hidesSearchBarWhenScrolling = false

        // navigation item back button > back text remove (back 문구 없애기)
        self.navigationController?.navigationBar.topItem?.backButtonDisplayMode = .minimal

        // navigation item back button 이미지 변경
        self.navigationController?.navigationBar.backIndicatorImage = UIImage(named: "icBack")
        self.navigationController?.navigationBar.backIndicatorTransitionMaskImage = UIImage(named: "icBack")
    }
}

extension SearchViewController: UITableViewDelegate, UITableViewDataSource {
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.arr.count
    }

    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "SeachListCell") as! SearchListTableViewCell
        cell.textLabel?.text = self.arr[indexPath.row]

        return cell
    }
}
```

1. initUI()를 통해 테이블뷰 셋팅을 진행했고
2. setSearchControllerUI()를 통해 서치 컨트롤러 셋팅을 진행했습니다.
3. 나머지 tableview delegate, datasource 처리를 하였구요.


그럼 이제 중요한건 무엇일까요?

1. 유저가 서치바에 무언가를 검색한다.
2. 그러면 입력할때마다 해당되는 검색 내용이 아래 리로드 될 수 있도록 한다.



<br/>



### Filtering 진행

우선 서치바에 텍스트가 업데이트 될때 마다 불리는 메소드가 있어야 합니다. 

```swift 
searhController.searchResultsUpdater = self 
```

위 코드를 setSearchControllerUI에 추가해 줍니다. 

그리고 아래 코드도 같이 추가해 줍니다. 

```swift 
extension SearchController: UISearchResultsUpdating {
    func updateSearchResults(for searchController: UISearchController) { 
        // code
    }
}
```
위 코드는 우리가 서치바에 무언가를 검색할때마다 불려지는 함수입니다.<br>
이 함수 안에서 우리가 서치바에 무언가 검색할때 무엇을 처리할지 적어주면 됩니다. 


```swift 
class SearchViewController: UIViewContoller {
    ...
    var filterredArr: [String] = []
    ...
}

extension SearchController: UISearchResultsUpdating {
    func updateSearchResults(for searchController: UISearchController) { 
        guard let text = searchController.searchBar.text?.lowercased() else { return }
        self.filterredArr = self.arr.filter { $0.localizedCaseInsensitiveContains(text) }
        dump(filterredArr)
    }
}
```

이러면 로그에는 서치바가 업데이트 될때마다 반응을 하지만 실제 화면에서는 이루어지질 않죠?

그 이유는 아직 테이블 뷰에서 필터링된 데이터들에 대한 처리를 해주고 있지 않기 때문입니다. 


```swift 
class SearchViewController: UIViewController {
    @IBOutlet weak var tableView: UITableView!
    var arr = ["docstep", "hi", "hello", "nice", "to", "meet", "you"]

    var filterredArr: [String] = []

    var isFiltering: Bool {
        let searchController = self.navigationItem.searchController
        let isActive = searchController?.isActive ?? false
        let isSearchBarHasText = searchController?.serarchBar.text?.isEmpty == false
        return isActive && isSearchBarHasText 
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        self.initUI()
        self.setSearchControllerUI()
    }
    
    func initUI() {
        self.tableView.delegate = self 
        self.tableView.dataSource = self 
    }

    func setSearchControllerUI() {
        let searchController = UISearchController(searchResultsController: nil)
        
        // set placeholder
        let placeholder = "검색창입니다"
        searchController.searchBar.placeholder = placeholder
        // searchController가 검색하는 동안 네비게이션에 가려지지 않도록 
        searchController.hidesNavigationBarDuringPresentation = false
        // searchBar cancel button text change (cancel을 취소로 텍스트 변경)
        searchController.searchBar.setValue("취소", forKey: "cancelButtonText")
        
        // placeholder릐 글꼴과 글자 크기 변경 
        let attributedString = NSMutableAttributedString(string: placeholder, attributes: [
            NSAttributedString.Key.font: UIFont(name: "Spoqa Han Sans Neo", size: 16) as Any,
            NSAttributedString.Key.foregroundColor: UIColor(white: 255/255, alpha: 0.3)
        ])
        searchController.searchBar.searchTextField.attributedPlaceholder = attributedString
        // searchBar의 textField의 배경색, 폰트, 글자크기 변경
        searchController.searchBar.searchTextField.backgroundColor = .clear
        searchController.searchBar.searchTextField.font = UIFont(name: "Spoqa Han Sans Neo", size: 16)
        
        // clear button 설정 
        if let button = searchController.searchBar.searchTextField.value(forKey: "_clearButton") as? UIButton {
            let templateImage = button.imageView?.image?.withRenderingMode(.alwaysTemplate)
            button.setImage(templateImage, for: .normal)
            button.tintColor = .white
        }
        
        // 서치 컨트롤러 왼쪽에 back button color 변경 
        searchController.searchBar.searchTextField.leftView?.tintColor = UIColor.white
        // searchBar cancel button color
        searchController.searchBar.tintColor = UIColor.white
        
        // navigation title 
        self.navigationItem.searchController = searchController
        self.navigationItem.title = "검색하기"

        // searchBar back button color
        self.navigationItem.searchController?.searchBar.barTintColor = UIColor.white

        // navigation item 스크롤 될때 사라지지 않게 
        self.navigationItem.hidesSearchBarWhenScrolling = false

        // navigation item back button > back text remove (back 문구 없애기)
        self.navigationController?.navigationBar.topItem?.backButtonDisplayMode = .minimal

        // navigation item back button 이미지 변경
        self.navigationController?.navigationBar.backIndicatorImage = UIImage(named: "icBack")
        self.navigationController?.navigationBar.backIndicatorTransitionMaskImage = UIImage(named: "icBack")

        searhController.searchResultsUpdater = self 
    }
}

extension SearchViewController: UITableViewDelegate, UITableViewDataSource {
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.isFilterting ? self.filterredArr.count : self.arr.count
    }

    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "SeachListCell") as! SearchListTableViewCell
        if self.isFiltering {
            cell.textLabel?.text = self.filterredArr[indexPath.row]
        } else {
            cell.textLabel?.text = self.arr[indexPath.row]
        }

        return cell
    }
}

extension SearchController: UISearchResultsUpdating {
    func updateSearchResults(for searchController: UISearchController) { 
        guard let text = searchController.searchBar.text?.lowercased() else { return }
        self.filterredArr = self.arr.filter { $0.localizedCaseInsensitiveContains(text) }
       
        self.tableView.reloadData()
    }
}
```
