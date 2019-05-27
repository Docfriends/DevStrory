---
layout: post
title: "텔레그램 웹훅 받기"
description: "텔레그램에서 웹훅으로 데이터 받고 텔레그램으로 데이터 보내기"
date: 2019-05-22
tags: [Telegram, Webhook]
writer: pikachu987
category: server
comments: true
share: true
---

<a href='https://core.telegram.org/bots/api' target='blank'>텔레그램 봇 사이트</a>

### 1.봇 만들기

##### 1) BotFather

![BotFather]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/botFather.png)

텔레그램에서 BotFather를 찾습니다.

![BotFatherStart]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/botFatherStart.png)

BotFather를 선택하고 Start 버튼을 누릅니다.

![BotFatherStartInput]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/botFatherStartInput.png)

여러가지 메뉴가 나옵니다.

![NewBot]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/newBot.png)

`/newbot`을 입력합니다.

![Name]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/name.png)

봇의 이름을 적습니다.<br>
원하는 이름을 적으면 됩니다.

![BotId]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/botId.png)

봇의 유저네임을 입력합니다.<br>
봇의 유저네임은 중복이 안됩니다.<br>
봇의 토큰이 나왔습니다 🎉🎉🎉

##### 2) 채팅방 ID

봇과 대화한 채팅방 ID는 <a href="https://api.telegram.org/bot/getUpdates" target='blank'>https://api.telegram.org/bot${telegramBotToken}/getUpdates</a> 에서 알수 있습니다.<br>
${telegramBotToken}은 아까 얻은 token을 입력해 줍니다.

![EmptyValue]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/emptyValue.png)

아무값이 없네요.

![MyBot]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/myBot.png)

텔레그램에서 방금 만든 봇을 검색합니다.

![MyBotChat]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/myBotChat.png)

Start 버튼을 눌러줍니다.

![Start]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/start.png)

다시 <a href="https://api.telegram.org/bot/getUpdates" target='blank'>https://api.telegram.org/bot${telegramBotToken}/getUpdates</a> 여기에서 봇 토큰을 입력하고 들어가 봅니다.

![ChatId]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/chatId.png)

데이터가 나왔습니다 🎉🎉🎉<br>
ID는 result - message - chat - id 에서 볼 수 있습니다.

##### 3) ID 찾기

<span>봇 토큰 입력</span><br>
(결과값 간단히 보기 <input id="check_find_bot_id" checked="true" type="checkbox">)<br>
<input id="input_bot_token" type="text" value="" placeholder="봇 토큰을 입력해 주세요." style="height: 40px; width: 80%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<button id="search_bot_id" style="height:44px; width: 15%; border-top: 2px solid black; border-radius: 5px; font-size: 16px; background-color: black; color: white;">찾기</button>
<pre id="print_bot_id" style="padding: 0px; margin: 0px;"></pre>

### 3.텔레그램에 메시지 보내기

##### 1) 메시지 보내기

<a href="https://api.telegram.org/bot/sendMessage?chat_id=&text=" target='blank'>https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${text}</a>

${telegramBotToken}은 봇 token을 입력해 줍니다.<br>
${telegramChatId}은 채팅 ID를 입력해 줍니다.<br>
${text}은 보낼 메시지를 입력해 줍니다.

![SendMessageURL]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/sendMessageURL.png)

![SendMessage]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/sendMessage.png)

메시지 보내기 성공 🎉🎉🎉

##### 2) 메시지 보내기 테스트

<span>봇 토큰 입력</span><br>
<input id="input_send_message_bot_token" type="text" value="" placeholder="봇 토큰을 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>보내질 채팅방 ID 입력</span><br>
<input id="input_send_message_chat_id" type="text" value="" placeholder="보내질 채팅방 ID를 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>보낼 메시지 입력</span><br>
<input id="input_send_message_text" type="text" value="" placeholder="보낼 메시지를 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">

<button id="send_message" style="height:44px; width: 15%; border-top: 2px solid black; border-radius: 5px; font-size: 16px; background-color: black; color: white;">메시지 보내기</button>
<pre id="print_message" style="padding: 0px; margin: 0px;"></pre>

### 3.웹훅 등록하기


##### 1) 웹훅을 받을 URL만들기

<a href='{{ site.url }}{{ site.baseurl }}/2019-05-20/make-lambda#temp1' target='blank'>AWS Lambda 만들기</a> 로 가서 Lambda 함수와 APIGateway를 만듭니다.

##### 2) 웹훅 등록

<a href="https://api.telegram.org/bot/setWebhook?url=" target='blank'>https://api.telegram.org/bot${telegramBotToken}/setWebhook?url=${callbackURL}</a>

${telegramBotToken}은 봇 token을 입력해 줍니다.<br>
${callbackURL}은 Lambda함수와 연결되어 있는 APIGateway URL을 입력해 줍니다.

![WebhookSuccess]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/webhookSuccess.png)

웹훅 등록 성공 🎉🎉🎉

##### 3) 웹훅 삭제

<a href="https://api.telegram.org/bot/setWebhook?url=" target='blank'>https://api.telegram.org/bot${telegramBotToken}/setWebhook?url=</a>

${telegramBotToken}은 봇 token을 입력해 줍니다.<br>
url을 비우면 웹훅 삭제가 됩니다.

![WebhookDelete]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/webhookDelete.png)

웹훅 삭제 성공 🎉🎉🎉

##### 4) 웹훅 등록/삭제

<span>봇 토큰 입력</span><br>
<input id="input_webhook_bot_token" type="text" value="" placeholder="봇 토큰을 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>callbackURL 입력</span><br>
<input id="input_webhook_callbackURL" type="text" value="" placeholder="callbackURL을 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">

<button id="webhook_set" style="height:44px; width: 15%; border-top: 2px solid black; border-radius: 5px; font-size: 16px; background-color: black; color: white;">웹훅 등록</button>
<button id="webhook_delete" style="height:44px; width: 15%; border-top: 2px solid black; border-radius: 5px; font-size: 16px; background-color: black; color: white;">웹훅 삭제</button>
<button id="webhook_info" style="height:44px; width: 15%; border-top: 2px solid black; border-radius: 5px; font-size: 16px; background-color: black; color: white;">웹훅 정보</button>
<pre id="print_webhook" style="padding: 0px; margin: 0px;"></pre>

### 4.웹훅

##### 1) 로그

![LambdaConsole]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/lambdaConsole.png)

callbackURL 에 등록된 Lambda함수에 event를 Log로 찍어보기 위해 `Console.log(event);` 를 적습니다.

![Chat]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/chat.png)

봇에게 채팅을 해봅니다.

![Log]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/log.png)

성공적으로 웹훅을 받고 로그에 출력했습니다 🎉🎉🎉

##### 2) 웹훅을 받고 텔레그램에 메시지 보내기

```javascript
// 텔레그램 봇 TOKEN
const TOKEN = '';
// 채팅방 ID
const SEND_ROOM_ID = '';

const https = require('https');
const util = require('util');

exports.handler = (event, context, callback) => {
    var item = new Item(event);
    sendRequest(`메시지를 보낸 사람: <b>${item.message.from.username}</b>`);
    callback(null, {
        statusCode: 200,
        headers: {"Access-Control-Allow-Origin": "*"},
        body: "Success"
    });
};

function sendRequest(message) {
  const req = https.request({
      method: 'POST',
      hostname: 'api.telegram.org',
      port: 443,
      headers: {"Content-Type": "application/json"},
      path: `/bot${TOKEN}/sendMessage`
  }, (res) => {
      res.setEncoding('utf8');
      var body = '';
      res.on('data', (chunk) => {
        body = body + chunk;
      });
      res.on('end',function() {
        console.log(body);
      });
  });
  req.on('error', function (e) {
      console.log('problem with request: ' + e.message);
  });
  req.write(util.format("%j", {
      "chat_id": SEND_ROOM_ID,
      "text": message,
      "parse_mode": "HTML"
  }));
  req.end();
}

// Model

function Item(element) {
  this.update_id = element["update_id"];
  this.message = new Message(element["message"] || {});
}

function Message(element) {
  this.message_id = element["message_id"];
  this.from = new From(element["from"] || {});
  this.chat = new Chat(element["chat"] || {});
  this.date = element["date"];
  this.text = element["text"];
  this.caption = element["caption"];
  var photo = element["photo"];
  var photos = [];
  if (photo != undefined) {
    photo.forEach(function(item) {
      if (item != undefined) {
        photos.push(new Photo(item || {}));
      }
    });
  }
  this.photo = photos;
}
function Chat(element) {
  this.id = element["id"];
  this.title = element["title"];
  this.first_name = element["first_name"];
  this.last_name = element["last_name"];
  this.username = element["username"];
  this.type = element["type"];
}

function From(element) {
  this.id = element["id"];
  this.is_bot = element["is_bot"];
  this.first_name = element["first_name"];
  this.last_name = element["last_name"];
  this.username = element["username"];
  this.language_code = element["language_code"];
}

function Photo(element) {
  this.file_id = element["file_id"];
  this.file_size = element["file_size"];
  this.width = element["width"];
  this.height = element["height"];
}
```

Lambda 소스를 수정해봅니다.

Chat은 Chat에 대해서 나옵니다.<br>
From은 채팅을 보낸 사람에 대해 나옵니다.

![TestComplete]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/testComplete.png)

성공 🎉🎉🎉

##### 3) 텔레그램 그룹방에 봇 추가

![GroupInfo]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/groupInfo.png)

그룹방 Info에서 **Add Members** 를 선택합니다.

![GroupBotSearch]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/groupBotSearch.png)

추가할 봇을 찾습니다.

![GroupBotAdd]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/groupBotAdd.png)

봇을 추가합니다.

**또는**

![BotInfo]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/botInfo.png)

봇 Info에서 Add To Group를 선택합니다.

![BotGroup]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/botGroup.png)

그룹을 찾고 추가를 합니다.

<br><br><br>

![GroupEdit]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/groupEdit.png)

그룹방 Info에서 Administrators를 누릅니다.

![GroupAddAdmin]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/groupAddAdmin.png)

Add Admin(관리자 추가)를 합니다.

![GroupAddBotAdmin]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/groupAddBotAdmin.png)

테스트봇에 관리자 권한을 줍니다.

메시지를 받으면 그룹방에 바로 보내도록 Lambda 소스를 수정합니다.

```javascript
// 텔레그램 봇 TOKEN
const TOKEN = '';

const https = require('https');
const util = require('util');

exports.handler = (event, context, callback) => {
    var item = new Item(event);
    sendRequest(item.message.chat.id, `메시지를 보낸 사람: <b>${item.message.from.username}</b>`);
    callback(null, {
        statusCode: 200,
        headers: {"Access-Control-Allow-Origin": "*"},
        body: "Success"
    });
};

function sendRequest(chatId, message) {
  const req = https.request({
      method: 'POST',
      hostname: 'api.telegram.org',
      port: 443,
      headers: {"Content-Type": "application/json"},
      path: `/bot${TOKEN}/sendMessage`
  }, (res) => {
      res.setEncoding('utf8');
      var body = '';
      res.on('data', (chunk) => {
        body = body + chunk;
      });
      res.on('end',function() {
        console.log(body);
      });
  });
  req.on('error', function (e) {
      console.log('problem with request: ' + e.message);
  });
  req.write(util.format("%j", {
      "chat_id": chatId,
      "text": message,
      "parse_mode": "HTML"
  }));
  req.end();
}

// Model

function Item(element) {
  this.update_id = element["update_id"];
  this.message = new Message(element["message"] || {});
}

function Message(element) {
  this.message_id = element["message_id"];
  this.from = new From(element["from"] || {});
  this.chat = new Chat(element["chat"] || {});
  this.date = element["date"];
  this.text = element["text"];
  this.caption = element["caption"];
  var photo = element["photo"];
  var photos = [];
  if (photo != undefined) {
    photo.forEach(function(item) {
      if (item != undefined) {
        photos.push(new Photo(item || {}));
      }
    });
  }
  this.photo = photos;
}
function Chat(element) {
  this.id = element["id"];
  this.title = element["title"];
  this.first_name = element["first_name"];
  this.last_name = element["last_name"];
  this.username = element["username"];
  this.type = element["type"];
}

function From(element) {
  this.id = element["id"];
  this.is_bot = element["is_bot"];
  this.first_name = element["first_name"];
  this.last_name = element["last_name"];
  this.username = element["username"];
  this.language_code = element["language_code"];
}

function Photo(element) {
  this.file_id = element["file_id"];
  this.file_size = element["file_size"];
  this.width = element["width"];
  this.height = element["height"];
}
```

![GroupMessageSuccess]({{ site.url }}{{ site.baseurl }}/images/2019/telegram-webhook/groupMessageSuccess.png)

성공 🎉🎉🎉

> 만약 봇이 작동을 안하면 /start 를 적어주시면 됩니다.

<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script type="text/javascript">
$(document).ready(function() {

  $("#search_bot_id").click(function() {
    const telegramBotToken = $("#input_bot_token").val();

    if (telegramBotToken == "" || telegramBotToken == undefined) {
      $("#print_bot_id").empty();
      $("#print_bot_id").append("Bot 토큰을 입력하세요.");
      return
    }
    const urlPath = "https://api.telegram.org/bot"+telegramBotToken+"/getUpdates";

    $.ajax({
          type: "GET",
          url: urlPath,
          success: function(args) {
            $("#print_bot_id").empty();
            if ($("#check_find_bot_id").is(':checked')) {
              var results =  args["result"] || [];
              var chats = [];
              results.forEach(function (item, index, array) {
                var chat = (item["message"] || {})["chat"];

                var found = false;
                for(var i = 0; i < chats.length; i++) {
                    if (chats[i]["id"] == chat["id"]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                  var data = {};
                  if (chat["title"] == undefined) {
                    data = {
                      "id": chat["id"],
                      "isGroup": false,
                      "username": chat["username"],
                    };
                  } else {
                    data = {
                      "id": chat["id"],
                      "isGroup": true,
                      "title": chat["title"],
                    };
                  }
                  chats.push(data);
                }
              });
              var json = JSON.stringify(chats, null, 4);
              $("#print_bot_id").append(document.createTextNode(json));
            } else {
              var json = JSON.stringify(args, null, 4);
              $("#print_bot_id").append(document.createTextNode(json));
            }
          },
          error: function(e) {
            var json = JSON.stringify(e, null, 4);
            $("#print_bot_id").empty();
            $("#print_bot_id").append(document.createTextNode(json));
          }
      });
  });

  $("#send_message").click(function() {
    const telegramBotToken = $("#input_send_message_bot_token").val();
    if (telegramBotToken == "" || telegramBotToken == undefined) {
      $("#print_message").empty();
      $("#print_message").append("Bot 토큰을 입력하세요.");
      return
    }
    const chatID = $("#input_send_message_chat_id").val();
    if (chatID == "" || chatID == undefined) {
      $("#print_message").empty();
      $("#print_message").append("보내질 채팅방 ID를 입력하세요.");
      return
    }
    const text = $("#input_send_message_text").val();
    if (text == "" || text == undefined) {
      $("#print_message").empty();
      $("#print_message").append("보낼 메시지를 입력하세요.");
      return
    }
    const urlPath = "https://api.telegram.org/bot"+telegramBotToken+"/sendMessage?chat_id="+chatID+"&text="+text;
    $.ajax({
        type: "GET",
        url: urlPath,
        success: function(args) {
          var json = JSON.stringify(args, null, 4);
          $("#print_message").empty();
          $("#print_message").append(document.createTextNode(json));
        },
        error: function(e) {
          var json = JSON.stringify(e, null, 4);
          $("#print_message").empty();
          $("#print_message").append(document.createTextNode(json));
        }
      });
  });

  $("#webhook_set").click(function() {
    const telegramBotToken = $("#input_webhook_bot_token").val();
    if (telegramBotToken == "" || telegramBotToken == undefined) {
      $("#print_webhook").empty();
      $("#print_webhook").append("Bot 토큰을 입력하세요.");
      return
    }
    const callbackURL = $("#input_webhook_callbackURL").val();
    if (callbackURL == "" || callbackURL == undefined) {
      $("#print_webhook").empty();
      $("#print_webhook").append("callbackURL을 입력하세요.");
      return
    }
    const webhookUrlPath = "https://api.telegram.org/bot"+telegramBotToken+"/setWebhook?url="+callbackURL;
    $.ajax({
        type: "GET",
        url: webhookUrlPath,
        success: function(args) {
          var json = JSON.stringify(args, null, 4);
          $("#print_webhook").empty();
          $("#print_webhook").append(document.createTextNode(json));
        },
        error: function(e) {
          var json = JSON.stringify(e, null, 4);
          $("#print_webhook").empty();
          $("#print_webhook").append(document.createTextNode(json));
        }
    });
  });

  $("#webhook_delete").click(function() {
    const telegramBotToken = $("#input_webhook_bot_token").val();
    if (telegramBotToken == "" || telegramBotToken == undefined) {
      $("#print_webhook").empty();
      $("#print_webhook").append("Bot 토큰을 입력하세요.");
      return
    }
    const webhookUrlPath = "https://api.telegram.org/bot"+telegramBotToken+"/setWebhook?url=";
    $.ajax({
        type: "GET",
        url: webhookUrlPath,
        success: function(args) {
          var json = JSON.stringify(args, null, 4);
          $("#print_webhook").empty();
          $("#print_webhook").append(document.createTextNode(json));
        },
        error: function(e) {
          var json = JSON.stringify(e, null, 4);
          $("#print_webhook").empty();
          $("#print_webhook").append(document.createTextNode(json));
        }
    });
  });

  $("#webhook_info").click(function() {
    const telegramBotToken = $("#input_webhook_bot_token").val();
    if (telegramBotToken == "" || telegramBotToken == undefined) {
      $("#print_webhook").empty();
      $("#print_webhook").append("Bot 토큰을 입력하세요.");
      return
    }
    const webhookUrlPath = "https://api.telegram.org/bot"+telegramBotToken+"/getWebhookInfo";
    $.ajax({
          type: "GET",
          url: webhookUrlPath,
          success: function(args) {
            var json = JSON.stringify(args, null, 4);
            $("#print_webhook").empty();
            $("#print_webhook").append(document.createTextNode(json));
          },
          error: function(e) {
            var json = JSON.stringify(e, null, 4);
            $("#print_webhook").empty();
            $("#print_webhook").append(document.createTextNode(json));
          }
      });
  });

});
</script>
