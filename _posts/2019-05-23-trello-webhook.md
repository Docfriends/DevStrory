---
layout: post
title: "트렐로 웹훅 받기"
description: "트렐로에서 웹훅으로 데이터 받기"
date: 2019-05-23
tags: [Trello, Webhook]
writer: pikachu987
category: server
comments: true
share: true
---

<a href='https://developers.trello.com/page/webhooks' target='blank'>트렐로 웹훅 사이트</a>

### 1.Key, Token

##### 1) 트렐로 Key 받기

<a href='https://trello.com/' target='blank'>트렐로 사이트</a> 에서 로그인을 해줍니다.

<a href='https://trello.com/app-key/' target='blank'>트렐로 AppKey 사이트</a> 에서 API Key를 받습니다.

![Key]({{ site.url }}{{ site.baseurl }}/images/2019/trello-webhook/key.png)

AWS 사이트 상단에서 자기와 가까운 리전을 설정합니다.

![GetKey]({{ site.url }}{{ site.baseurl }}/images/2019/trello-webhook/getKey.png)

트렐로 웹훅 Key를 받았습니다 🎉🎉🎉

##### 2) 트렐로 Token 받기

<a href='https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=' target='blank'>https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=${key}</a>

${key}는 방금 받은 트렐로 Key를 입력해 줍니다.

![Token]({{ site.url }}{{ site.baseurl }}/images/2019/trello-webhook/token.png)

Allow 를 합니다.

![GetToken]({{ site.url }}{{ site.baseurl }}/images/2019/trello-webhook/getToken.png)

트렐로 웹훅 Token을 받았습니다 🎉🎉🎉

### 2.보드 리스트 찾기

##### 1) 트렐로 username 찾기

![Username]({{ site.url }}{{ site.baseurl }}/images/2019/trello-webhook/username.png)

이름옆에 회색글자가 username입니다.

##### 2) 트렐로 ID 찾기

<a href='https://api.trello.com/1/members/' target='blank'>https://api.trello.com/1/members/${username}</a>

${username}은 username을 입력해 줍니다.

![Id]({{ site.url }}{{ site.baseurl }}/images/2019/trello-webhook/id.png)

제일 앞에 ID가 있네요.

<span>username을 입력</span><br>
(결과값 간단히 보기 <input id="check_find_id" checked="true" type="checkbox">)<br>
<input id="input_username_id" type="text" value="" placeholder="username을 입력해 주세요." style="height: 40px; width: 80%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<button id="find_id" style="height:44px; width: 15%; border-top: 2px solid black; border-radius: 5px; font-size: 16px; background-color: black; color: white;">ID 찾기</button>
<pre id="print_id" style="padding: 0px; margin: 0px;"></pre>

##### 3) 보드 리스트 검색

<a href='https://api.trello.com/1/members//boards?key=&token=' target='blank'>https://api.trello.com/1/members/${id}/boards?key=${key}&token=${token}</a>

${id}은 방금 찾은 ID를 입력해 줍니다.<br>
${key}은 트렐로 Key를 입력해 줍니다.<br>
${token}은 트렐로 Token을 입력해 줍니다.

![BoardList]({{ site.url }}{{ site.baseurl }}/images/2019/trello-webhook/boardList.png)

복잡합니다. 필요한건 보드의 shortLink입니다.

<span>Key 입력</span><br>
<input id="input_key_board" type="text" value="" placeholder="키를 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>Token 입력</span><br>
<input id="input_token_board" type="text" value="" placeholder="토큰을 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>ID 입력</span><br>
<input id="input_id_board" type="text" value="" placeholder="ID를 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
(결과값 간단히 보기 <input id="check_find_board" checked="true" type="checkbox">)<br>
<button id="search_board" style="height:44px; width: 15%; border-top: 2px solid black; border-radius: 5px; font-size: 16px; background-color: black; color: white;">트렐로 보드 찾기</button>
<pre id="print_board" style="padding: 0px; margin: 0px;"></pre>

##### 4) 보드의 리스트 검색

<a href='https://api.trello.com/1/boards//lists?key=&token=' target='blank'>https://api.trello.com/1/boards/${shortLink}/lists?key=${key}&token=${token}</a>

${shortLink}는 원하는 보드의 shortLink를 입력해 줍니다.<br>
${key}은 트렐로 Key를 입력해 줍니다.<br>
${token}은 트렐로 Token을 입력해 줍니다.

![List]({{ site.url }}{{ site.baseurl }}/images/2019/trello-webhook/list.png)

리스트까지 가져왔습니다.

<span>Key 입력</span><br>
<input id="input_key_list" type="text" value="" placeholder="키를 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>Token 입력</span><br>
<input id="input_token_list" type="text" value="" placeholder="토큰을 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>ID 입력</span><br>
<input id="input_shortLink_list" type="text" value="" placeholder="shortLink를 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
(결과값 간단히 보기 <input id="check_find_list" checked="true" type="checkbox">)<br>
<button id="search_list" style="height:44px; width: 25%; border-top: 2px solid black; border-radius: 5px; font-size: 16px; background-color: black; color: white;">트렐로 보드의 리스트 찾기</button>
<pre id="print_list" style="padding: 0px; margin: 0px;"></pre>


### 3.웹훅 등록, 삭제하기

##### 1) 웹훅을 받을 URL만들기

<a href='{{ site.url }}{{ site.baseurl }}/2019-05-20/make-lambda#temp1' target='blank'>AWS Lambda 만들기</a> 로 가서 Lambda 함수와 APIGateway를 만듭니다.

##### 2) 웹훅 등록

```javascript
$.ajax({
    type: "POST",
    url: https://api.trello.com/1/tokens/${token}/webhooks/?key=${key},
    data: {
      description: ${description},
      callbackURL: ${callbackURL},
      idModel: ${idModel},
    },
    success: function(args) {

    },
    error: function(e) {

    }
});
```

${token}은 트렐로 Token을 입력해 줍니다.<br>
${key}은 트렐로 Key를 입력해 줍니다.<br>
${description}은 웹훅 별칭을 입력해 줍니다.<br>
${callbackURL}은 callback을 받을 URL을 입력해 줍니다.<br>
${idModel}은 리스트의 ID를 입력해 줍니다.

<span>Key 입력</span><br>
<input id="input_key_webhook" type="text" value="" placeholder="키를 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>Token 입력</span><br>
<input id="input_token_webhook" type="text" value="" placeholder="토큰을 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>Description 입력</span><br>
<input id="input_description_webhook" type="text" value="" placeholder="description을 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>callbackURL 입력</span><br>
<input id="input_callbackURL_webhook" type="text" value="" placeholder="callbackURL을 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>idModel 입력</span><br>
<input id="input_idModel_webhook" type="text" value="" placeholder="idModel을 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">

<button id="register_webhook" style="height:44px; width: 25%; border-top: 2px solid black; border-radius: 5px; font-size: 16px; background-color: black; color: white;">웹훅 등록</button>
<pre id="print_register_webhook" style="padding: 0px; margin: 0px;"></pre>

##### 3) 웹훅 리스트 조회

<a href='https://api.trello.com/1/members/me/tokens?webhooks=true&key=&token=' target='blank'>https://api.trello.com/1/members/me/tokens?webhooks=true&key=${key}&token=${token}</a>

${key}은 트렐로 Key를 입력해 줍니다.<br>
${token}은 트렐로 Token을 입력해 줍니다.

![WebhookList]({{ site.url }}{{ site.baseurl }}/images/2019/trello-webhook/webhookList.png)

등록된 웹훅 리스트를 가져왔습니다.<br>
등록된 웹훅을 삭제하려면 webhooks 안의 id 값이 필요합니다.

<span>Key 입력</span><br>
<input id="input_key_webhook_list" type="text" value="" placeholder="키를 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>Token 입력</span><br>
<input id="input_token_webhook_list" type="text" value="" placeholder="토큰을 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
(결과값 간단히 보기 <input id="check_find_webhook_list" checked="true" type="checkbox">)<br>
<button id="search_webhook_list" style="height:44px; width: 25%; border-top: 2px solid black; border-radius: 5px; font-size: 16px; background-color: black; color: white;">등록 웹훅 리스트 찾기</button>
<pre id="print_webhook_list" style="padding: 0px; margin: 0px;"></pre>


##### 4) 웹훅 삭제

```javascript
$.ajax({
    type: "DELETE",
    url: https://api.trello.com/1/tokens/${token}/webhooks/${webhookID}?key=${key},
    success: function(args) {

    },
    error: function(e) {

    }
});
```

${token}은 트렐로 Token을 입력해 줍니다.<br>
${key}은 트렐로 Key를 입력해 줍니다.<br>
${webhookID}은 웹훅의 ID를 입력해 줍니다.

<span>Key 입력</span><br>
<input id="input_key_delete_webhook" type="text" value="" placeholder="키를 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>Token 입력</span><br>
<input id="input_token_delete_webhook" type="text" value="" placeholder="토큰을 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>webhookID 입력</span><br>
<input id="input_webhook_id_delete_webhook" type="text" value="" placeholder="webhookID을 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">

<button id="delete_webhook" style="height:44px; width: 25%; border-top: 2px solid black; border-radius: 5px; font-size: 16px; background-color: black; color: white;">웹훅 삭제</button>
<pre id="print_delete_webhook" style="padding: 0px; margin: 0px;"></pre>


### 4.웹훅 테스트

##### 1) Lambda에 Log 찍기

```javascript
exports.handler = (event, context, callback) => {
    console.log(event);
    callback(null, {
        statusCode: 200,
        headers: {"Access-Control-Allow-Origin": "*"},
        body: "Success"
    });
};
```

간단하게 로그를 찍어봅니다.

##### 2) Log

![Log]({{ site.url }}{{ site.baseurl }}/images/2019/trello-webhook/log.png)

type에 트렐로 타입들이 나옵니다.

##### 3) Type

```
action_renamed_list: 리스트 제목 변경
action_archived_list: 리스트 아카이브
action_sent_list_to_board: 리스트 아카이브 복구
action_create_card: 리스트 카드 생성
action_renamed_card: 카드 제목 변경
action_changed_description_of_card: 카드 Description 수정
action_add_attachment_to_card: 카드 Attachment 추가
action_comment_on_card: 카드 댓글 추가
action_convert_to_card_from_checkitem: 카드 체크리스트를 카드로 추가
action_added_a_due_date: 카드 일정 추가
action_changed_a_due_date: 카드 일정 수정
action_removed_a_due_date: 카드 일정 삭제
action_marked_the_due_date_complete: 카드 일정 완료
action_marked_the_due_date_incomplete: 카드 일정 완료 취소
action_moved_card_lower: 카드 순서 상단으로 변경
action_moved_card_higher: 카드 순서 하단으로 변경
action_move_card_from_list_to_list: 카드의 리스트 위치 변경
action_archived_card: 카드 아카이브
action_sent_card_to_board: 카드 아카이브 복구
action_delete_card: 카드 삭제
```

##### 4) 구조

```
var trelloInfo = new TrelloInfo(event);

// trello
function TrelloInfo(event) {
  this.model = new EventModel(event["model"] || {});
  this.action = new EventAction(event["action"] || {});
}

// model
function EventModel(element) {
  this.id = element["id"];
  this.name = element["name"];
  this.closed = element["closed"];
  this.idBoard = element["idBoard"];
  this.pos = element["pos"];
}

// action
function EventAction(element) {
  this.id = element["id"];
  this.idMemberCreator = element["idMemberCreator"];
  this.type = element["type"];
  this.date = element["date"];

  this.limits = new EventActionLimit(element["limits"] || {});
  this.data = new EventActionData(element["data"] || {});
  this.display = new EventActionDisplay(element["display"] || {});
  this.memberCreator = new EventActionMemberCreator(element["memberCreator"] || {});
}

// action - limit
function EventActionLimit(element) {
  this.reactions = new EventActionLimitReactions(element["reactions"] || {});
}

// action - limit - reactions
function EventActionLimitReactions(element) {
  this.perAction = new EventActionLimitPerAction(element["perAction"] || {});
  this.uniquePerAction = new EventActionLimitUniquePerAction(element["uniquePerAction"] || {});
}

// action - limit - reactions - perAction
function EventActionLimitPerAction(element) {
  this.status = element["status"];
  this.disableAt = element["disableAt"];
  this.warnAt = element["warnAt"];
}

// action - limit - reactions - uniquePerAction
function EventActionLimitUniquePerAction(element) {
  this.status = element["status"];
  this.disableAt = element["disableAt"];
  this.warnAt = element["warnAt"];
}

// action - data
function EventActionData(element) {
  this.cardSource = new EventActionDataCardSource(element["cardSource"] || {});
  this.checklist = new EventActionDataChecklist(element["checklist"] || {});
  this.listAfter = new EventActionDataListAfter(element["listAfter"] || {});
  this.listBefore = new EventActionDataListBefore(element["listBefore"] || {});
  this.board = new EventActionDataBoard(element["board"] || {});
  this.list = new EventActionDataList(element["list"] || {});
  this.card = new EventActionDataCard(element["card"] || {});
  this.old = new EventActionDataOld(element["old"] || {});
  this.attachment = new EventActionDataAttachment(element["attachment"] || {});
  this.text = element["text"];
}

// action - data - cardSource
function EventActionDataCardSource(element) {
  this.shortLink = element["shortLink"];
  this.idShort = element["idShort"];
  this.name = element["name"];
  this.id = element["id"];
}

// action - data - checklist
function EventActionDataChecklist(element) {
  this.name = element["name"];
  this.id = element["id"];
}

// action - data - listAfter
function EventActionDataListAfter(element) {
  this.creationMethod = element["creationMethod"];
  this.name = element["name"];
  this.id = element["id"];
}

// action - data - listBefore
function EventActionDataListBefore(element) {
  this.name = element["name"];
  this.id = element["id"];
}

// action - data - board
function EventActionDataBoard(element) {
  this.creationMethod = element["creationMethod"];
  this.shortLink = element["shortLink"];
  this.name = element["name"];
  this.id = element["id"];
}

// action - data - list
function EventActionDataList(element) {
  this.id = element["id"];
  this.name = element["name"];
}

// action - data - card
function EventActionDataCard(element) {
  this.shortLink = element["shortLink"];
  this.idShort = element["idShort"];
  this.name = element["name"];
  this.id = element["id"];
  this.idList = element["idList"];
  this.due = element["due"];
  this.dueComplete = element["dueComplete"];
  this.pos = element["pos"];
}

// action - data - old
function EventActionDataOld(element) {
  this.idList = element["idList"];
  this.name = element["name"];
  this.desc = element["desc"];
  this.due = element["due"];
  this.dueComplete = element["dueComplete"];
  this.pos = element["pos"];
  this.closed = element["closed"];
}

// action - data - attachment
function EventActionDataAttachment(element) {
  this.previewUrl2x = element["previewUrl2x"];
  this.previewUrl = element["previewUrl"];
  this.url = element["url"];
  this.name = element["name"];
  this.id = element["id"];
}

// action - display
function EventActionDisplay(element) {
  this.translationKey = element["translationKey"];
  this.entities = new EventActionDisplayEntities(element["entities"] || {});
}

// action - display - entities
function EventActionDisplayEntities(element) {
  this.date = new EventActionDisplayEntitiesDate(element["date"] || {});
  this.cardSource = new EventActionDisplayEntitiesCardSource(element["cardSource"] || {});
  this.card = new EventActionDisplayEntitiesCard(element["card"] || {});
  this.list = new EventActionDisplayEntitiesList(element["list"] || {});
  this.name = new EventActionDisplayEntitiesName(element["name"] || {});
  this.contextOn = new EventActionDisplayEntitiesContextOn(element["contextOn"] || {});
  this.comment = new EventActionDisplayEntitiesComment(element["comment"] || {});
  this.listBefore = new EventActionDisplayEntitiesListBefore(element["listBefore"] || {});
  this.listAfter = new EventActionDisplayEntitiesListAfter(element["listAfter"] || {});
  this.attachment = new EventActionDisplayEntitiesAttachment(element["attachment"] || {});
  this.attachmentPreview = new EventActionDisplayEntitiesAttachmentPreview(element["attachmentPreview"] || {});
  this.memberCreator = new EventActionDisplayEntitiesMemberCreator(element["memberCreator"] || {});
}

// action - display - entities - date
function EventActionDisplayEntitiesDate(element) {
  this.type = element["type"];
  this.date = element["date"];
}

// action - display - entities - cardSource
function EventActionDisplayEntitiesCardSource(element) {
  this.type = element["type"];
  this.id = element["id"];
  this.idShort = element["idShort"];
  this.text = element["text"];
}

// action - display - entities - card
function EventActionDisplayEntitiesCard(element) {
  this.type = element["type"];
  this.idList = element["idList"];
  this.id = element["id"];
  this.shortLink = element["shortLink"];
  this.text = element["text"];
  this.desc = element["desc"];
  this.dueComplete = element["dueComplete"];
  this.pos = element["pos"];
}

// action - display - entities - list
function EventActionDisplayEntitiesList(element) {
  this.type = element["type"];
  this.id = element["id"];
  this.text = element["text"];
}

// action - display - entities - name
function EventActionDisplayEntitiesName(element) {
  this.type = element["type"];
  this.text = element["text"];
}

// action - display - entities - contextOn
function EventActionDisplayEntitiesContextOn(element) {
  this.type = element["type"];
  this.translationKey = element["translationKey"];
  this.hideIfContext = element["hideIfContext"];
  this.idContext = element["idContext"];
}

// action - display - entities - comment
function EventActionDisplayEntitiesComment(element) {
  this.type = element["type"];
  this.id = element["id"];
  this.username = element["username"];
  this.text = element["text"];
}

// action - display - entities - listBefore
function EventActionDisplayEntitiesListBefore(element) {
  this.type = element["type"];
  this.id = element["id"];
  this.text = element["text"];
}

// action - display - entities - listAfter
function EventActionDisplayEntitiesListAfter(element) {
  this.type = element["type"];
  this.id = element["id"];
  this.text = element["text"];
  this.creationMethod = element["creationMethod"];
}

// action - display - entities - attachment
function EventActionDisplayEntitiesAttachment(element) {
  this.type = element["type"];
  this.id = element["id"];
  this.previewUrl = element["previewUrl"];
  this.previewUrl2x = element["previewUrl2x"];
  this.link = element["link"];
  this.text = element["text"];
  this.url = element["url"];
}

// action - display - entities - attachmentPreview
function EventActionDisplayEntitiesAttachmentPreview(element) {
  this.type = element["type"];
  this.originalUrl = element["originalUrl"];
  this.id = element["id"];
  this.previewUrl = element["previewUrl"];
  this.previewUrl2x = element["previewUrl2x"];
}

// action - display - entities - memberCreator
function EventActionDisplayEntitiesMemberCreator(element) {
  this.type = element["type"];
  this.id = element["id"];
  this.username = element["username"];
  this.text = element["text"];
}

// action - memberCreator
function EventActionMemberCreator(element) {
  this.id = element["id"];
  this.avatarHash = element["avatarHash"];
  this.avatarUrl = element["avatarUrl"];
  this.fullName = element["fullName"];
  this.idMemberReferrer = element["idMemberReferrer"];
  this.initials = element["initials"];
  this.nonPublic = element["nonPublic"] || {};
  this.nonPublicAvailable = element["nonPublicAvailable"];
  this.username = element["username"];
}
```



<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script type="text/javascript">
$(document).ready(function() {

  $("#find_id").click(function() {
    const username = $("#input_username_id").val();

    if (username == "" || username == undefined) {
      $("#print_id").empty();
      $("#print_id").append("username을 입력하세요.");
      return
    }
    const urlPath = "https://api.trello.com/1/members/"+username;

    $.ajax({
          type: "GET",
          url: urlPath,
          success: function(args) {
            $("#print_id").empty();
            if ($("#check_find_id").is(':checked')) {
              var json = JSON.stringify({"id": args["id"]}, null, 4);
              $("#print_id").append(document.createTextNode(json));
            } else {
              var json = JSON.stringify(args, null, 4);
              $("#print_id").append(document.createTextNode(json));
            }
          },
          error: function(e) {
            var json = JSON.stringify(e, null, 4);
            $("#print_id").empty();
            $("#print_id").append(document.createTextNode(json));
          }
      });
  });

  $("#search_board").click(function() {
    const key = $("#input_key_board").val();
    if (key == "" || key == undefined) {
      $("#print_board").empty();
      $("#print_board").append("key를 입력하세요.");
      return
    }

    const token = $("#input_token_board").val();
    if (token == "" || token == undefined) {
      $("#print_board").empty();
      $("#print_board").append("token을 입력하세요.");
      return
    }

    const id = $("#input_id_board").val();
    if (id == "" || id == undefined) {
      $("#print_board").empty();
      $("#print_board").append("id를 입력하세요.");
      return
    }
    const urlPath = "https://api.trello.com/1/members/"+id+"/boards?key="+key+"&token="+token;

    $.ajax({
          type: "GET",
          url: urlPath,
          success: function(args) {
            $("#print_board").empty();
            if ($("#check_find_board").is(':checked')) {
              var items = [];
              args.forEach(function(item) {
                items.push({
                  "name": item["name"],
                  "shortLink": item["shortLink"],
                });
              });
              var json = JSON.stringify(items, null, 4);
              $("#print_board").append(document.createTextNode(json));
            } else {
              var json = JSON.stringify(args, null, 4);
              $("#print_board").append(document.createTextNode(json));
            }
          },
          error: function(e) {
            var json = JSON.stringify(e, null, 4);
            $("#print_board").empty();
            $("#print_board").append(document.createTextNode(json));
          }
      });
  });


  $("#search_list").click(function() {
    const key = $("#input_key_list").val();
    if (key == "" || key == undefined) {
      $("#print_board").empty();
      $("#print_board").append("key를 입력하세요.");
      return
    }

    const token = $("#input_token_list").val();
    if (token == "" || token == undefined) {
      $("#print_board").empty();
      $("#print_board").append("token을 입력하세요.");
      return
    }

    const shortLink = $("#input_shortLink_list").val();
    if (shortLink == "" || shortLink == undefined) {
      $("#print_list").empty();
      $("#print_list").append("shortLink를 입력하세요.");
      return
    }
    const urlPath = "https://api.trello.com/1/boards/"+shortLink+"/lists?key="+key+"&token="+token;

    $.ajax({
          type: "GET",
          url: urlPath,
          success: function(args) {
            $("#print_list").empty();
            if ($("#check_find_list").is(':checked')) {
              var items = [];
              args.forEach(function(item) {
                items.push({
                  "id": item["id"],
                  "name": item["name"],
                  "closed": item["closed"]
                });
              });
              var json = JSON.stringify(items, null, 4);
              $("#print_list").append(document.createTextNode(json));
            } else {
              var json = JSON.stringify(args, null, 4);
              $("#print_list").append(document.createTextNode(json));
            }
          },
          error: function(e) {
            var json = JSON.stringify(e, null, 4);
            $("#print_list").empty();
            $("#print_list").append(document.createTextNode(json));
          }
      });
  });




  $("#register_webhook").click(function() {
    const key = $("#input_key_webhook").val();
    if (key == "" || key == undefined) {
      $("#print_register_webhook").empty();
      $("#print_register_webhook").append("key를 입력하세요.");
      return
    }

    const token = $("#input_token_webhook").val();
    if (token == "" || token == undefined) {
      $("#print_register_webhook").empty();
      $("#print_register_webhook").append("token을 입력하세요.");
      return
    }

    const description = $("#input_description_webhook").val();
    if (description == "" || description == undefined) {
      $("#print_register_webhook").empty();
      $("#print_register_webhook").append("description을 입력하세요.");
      return
    }

    const callbackURL = $("#input_callbackURL_webhook").val();
    if (callbackURL == "" || callbackURL == undefined) {
      $("#print_register_webhook").empty();
      $("#print_register_webhook").append("callbackURL을 입력하세요.");
      return
    }

    const idModel = $("#input_idModel_webhook").val();
    if (idModel == "" || idModel == undefined) {
      $("#print_register_webhook").empty();
      $("#print_register_webhook").append("idModel을 입력하세요.");
      return
    }

    const urlPath = "https://api.trello.com/1/tokens/"+token+"/webhooks/?key="+key;
    $.ajax({
        type: "POST",
        url: urlPath,
        data: {
          description: description,
          callbackURL: callbackURL,
          idModel: idModel,
        },
        success: function(args) {
          $("#print_register_webhook").empty();
          var json = JSON.stringify(args, null, 4);
          $("#print_register_webhook").append(document.createTextNode(json));
        },
        error: function(e) {
          var json = JSON.stringify(e, null, 4);
          $("#print_register_webhook").empty();
          $("#print_register_webhook").append(document.createTextNode(json));
        }
    });
  });


  $("#search_webhook_list").click(function() {
    const key = $("#input_key_webhook_list").val();
    if (key == "" || key == undefined) {
      $("#print_webhook_list").empty();
      $("#print_webhook_list").append("key를 입력하세요.");
      return
    }

    const token = $("#input_token_webhook_list").val();
    if (token == "" || token == undefined) {
      $("#print_webhook_list").empty();
      $("#print_webhook_list").append("token을 입력하세요.");
      return
    }
    const urlPath = "https://api.trello.com/1/members/me/tokens?webhooks=true&key="+key+"&token="+token;
    $.ajax({
        type: "GET",
        url: urlPath,
        success: function(args) {
          $("#print_webhook_list").empty();
          if ($("#check_find_webhook_list").is(':checked')) {
            var webhooks = [];
            args.forEach(function (item) {
              item["webhooks"].forEach(function(element) {
                webhooks.push(element);
              });
            });
            var json = JSON.stringify(webhooks, null, 4);
            $("#print_webhook_list").append(document.createTextNode(json));
          } else {
            var json = JSON.stringify(args, null, 4);
            $("#print_webhook_list").append(document.createTextNode(json));
          }
        },
        error: function(e) {
          var json = JSON.stringify(e, null, 4);
          $("#print_webhook_list").empty();
          $("#print_webhook_list").append(document.createTextNode(json));
        }
    });
  });




  $("#delete_webhook").click(function() {
    const key = $("#input_key_delete_webhook").val();
    if (key == "" || key == undefined) {
      $("#print_delete_webhook").empty();
      $("#print_delete_webhook").append("key를 입력하세요.");
      return
    }

    const token = $("#input_token_delete_webhook").val();
    if (token == "" || token == undefined) {
      $("#print_delete_webhook").empty();
      $("#print_delete_webhook").append("token을 입력하세요.");
      return
    }

    const webhookID = $("#input_webhook_id_delete_webhook").val();
    if (webhookID == "" || webhookID == undefined) {
      $("#print_delete_webhook").empty();
      $("#print_delete_webhook").append("webhookID를 입력하세요.");
      return
    }
    const urlPath = "https://api.trello.com/1/token/"+token+"/webhooks/"+webhookID+"?key="+key;
    $.ajax({
        type: "DELETE",
        url: urlPath,
        success: function(args) {
          $("#print_delete_webhook").empty();
          var json = JSON.stringify(args, null, 4);
          $("#print_delete_webhook").append(document.createTextNode(json));
        },
        error: function(e) {
          var json = JSON.stringify(e, null, 4);
          $("#print_delete_webhook").empty();
          $("#print_delete_webhook").append(document.createTextNode(json));
        }
    });
  });

});
</script>
