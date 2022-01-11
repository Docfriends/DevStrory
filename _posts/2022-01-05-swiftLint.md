---
layout: post
title: "SwiftLint"
description: "SwiftLint를 적용하며 마주한 경고 정리"
date: 2021-01-05
tags: [Swift, iOS, SwiftLint]
writer: zehye
category: iOS
comments: true
share: true
---

## SwiftLint

저희 닥톡에서는 SwiftLint를 사용하고 있습니다.

일반적으로 Lint는 다른 언어에서도 소스코드를 분석하여 코드 스타일이나 프로그램 오류가 발생할 수 있는 부분을 찾아주는 도구로 사용되어집니다. SwiftLint는 Swift 언어의 스타일 규칙에 맞지 않는 코드를 찾아내어 경고 또는 에러를 표시해주는 도구입니다.

이러한 SwiftLint를 적용함으로써 발견한 에러를 정리해보았습니다.<br>
덧붙여 앞으로 마주할 에러 또한 추가 정리해나갈 예정입니다 :)


<br/>


### Vertical Whitespace Violation: Limit vertical whitespace to a single empty line. Currently 2. (vertical_whitespace) 2946 (999+, 9)

코드 사이 한 줄씩만 띄도록 수정해야합니다.


<br/>


### Colon Violation: Colons should be next to the identifier when specifying a type and next to the key in dictionary literals. (colon)

타입 정의나 딕셔너리에서 `:`을 사용할때 앞은 붙이고 뒤는 한칸 스페이스를 넣어야합니다.

```swift
let a: Int?
let b: [String: Int]
```


<br/>


### Unused Closure Parameter Violation: Unused parameter "timer" in a closure should be replaced with _. (unused_closure_parameter)

사용하지 않는 클로저 파아미터들은 `_` 와일드카드 식별자로 변경해야합니다.


<br/>


### Opening Brace Spacing Violation: Opening braces should be preceded by a single space and on the same line as the declaration. (opening_brace)  (741, 9)

함수 등에서 앞의 대괄호를 열때 `{`, 앞 쪽 공백이 한칸 들어가야 합니다.

```swift
func setA() { }
```


<br/>


### Control Statement Violation: if, for, guard, switch, while, and catch statements shouldn't unnecessarily wrap their conditionals or arguments in parentheses. (control_statement) (757, 8)

if 구문등의 조건 부분을 소괄호로 묶지 않아도 됩니다.

```swift
if (a > b) { }  // 변경 전
if a > b { }  // 변경 후
```


<br/>


### Comma Spacing Violation: There should be no space before and one after any comma. (comma)

콤마 `,`를 사용한 경우, 그 앞은 붙고 그 뒤는 한칸 공백이 있어야 합니다.


<br/>


### Statement Position Violation: Else and catch should be on the same line, one space after the previous declaration. (statement_position)

else 구문은 이전 괄호와 동일한 줄에 표시하는 것을 권장합니다.

```swift
if {

} else {

}
```


<br/>


### Returning Whitespace Violation: Return arrow and return type should be separated by a single space or on a separate line. (return_arrow_whitespace) (441, 8)

반환타입을 주는 화살표 `->`와 반환 타입 사이 공백이 한칸씩 필요합니다.

```swift
func setA() -> Int { }
```


<br/>


### Redundant Optional Initialization Violation: Initializing an optional variable with nil is redundant. (redundant_optional_initialization)

옵셔널 변수라면 최초에 자동으로 nil로 초기화 되기 때문에 명시해주지 않아도 됩니다.

```swift
var frame: CGRect? = nil  // 적용 전
var dimFrame: CGRect?  // 적용 후
```
