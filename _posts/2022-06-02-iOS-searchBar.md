---
layout: post
title: "iOS SearchBar 사용해보기"
description: "iOS SearchBar 사용 방법에 대해 설명합니다."
date: 2022-06-02
tags: [Swift, iOS, Docstep, searchBar]
writer: zehye
category: iOS
comments: true
share: true
---

## UISearchBar 사용해보기

닥스텝의 searchVC에서는 searchBar를 사용해 구현하였습니다<br>
초기에는 searchController를 사용하였지만, 뷰컨 위에 searchController가 하나 더 위에 쌓이는 구조보다, 서치바 자체만을 놓고 구현하는 것이 훨씬 간단하고 커스텀 하기 쉽다고 판단하여 결국적으로는 서치바를 사용하게 되었습니다.


서치바는 아래와 같이 사용했습니다. 

```swift 
class SearchViewController: UIViewController {
    @IBOutlet weak var searchBar: UISearchBar!
    // 서치바를 통해 arr가 필터링 되어졌는 지에 대한 bool 값 변수 
    var isFiltering: Bool = false

    var arr = ["docStep", "hi", "hello", "nice", "to", "meet", "you"]
    // filter(서치바를 통해 작성한 무언가)를 담는 리스트 
    var filterredArr: [String] = []

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
        self.searchBar.delegate = self
        self.searchBar.showsCancelButton = false
    }
}

extension SearchViewController: UITableViewDelegate, UITableViewDataSource {
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // 서치바를 통해 무언가 검색했다면 filterredArr의 갯수로, 그렇지 않다면 arr의 갯수로 
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

extension SearchViewController: UISearchBarDelegate {
    // 서치바에서 검색을 시작할 때 호출 
    func searchBarTextDidBeginEditing(_ searchBar: UISearchBar) {
        self.isFiltering = true
        self.searchBar.showsCancelButton = true
        self.tableView.reloadData()
    }
    
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
        guard let text = searchController.searchBar.text?.lowercased() else { return }
        self.filterredArr = self.arr.filter { $0.localizedCaseInsensitiveContains(text) }
       
        self.tableView.reloadData()
    }
    
    // 서치바에서 검색버튼을 눌렀을 때 호출 
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        dismissKeyboard()

        guard let text = searchController.searchBar.text?.lowercased() else { return }
        self.filterredArr = self.arr.filter { $0.localizedCaseInsensitiveContains(text) }
       
        self.tableView.reloadData()
    }
    
    // 서치바에서 취소 버튼을 눌렀을 때 호출 
    func searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
        self.searchBar.text = ""
        self.searchBar.resignFirstResponder()
        self.isFiltering = false
        self.tableView.reloadData()
    }
    
    // 서치바 검색이 끝났을 때 호출
    func searchBarTextDidEndEditing(_ searchBar: UISearchBar) {
        self.tableView.reloadData()
    }
    
    // 서치바 키보드 내리기 
    func dismissKeyboard() {
        searchBar.resignFirstResponder()
    }
}
```