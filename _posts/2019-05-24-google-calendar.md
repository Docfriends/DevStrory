---
layout: post
title: "구글 캘린더 API"
description: "구글 캘린더 데이터 받기"
date: 2019-05-24
tags: [Google, Calendar]
writer: pikachu987
category: server
comments: true
share: true
---

### 1.Google Console에서 API키 얻기

<a href='https://console.developers.google.com/' target='blank'>Google Console 사이트</a>

##### 1) 캘린더 라이브러리

![Lib]({{ site.url }}{{ site.baseurl }}/images/2019/google-calendar/lib.png)

라이브러리를 누릅니다.

![Calendar]({{ site.url }}{{ site.baseurl }}/images/2019/google-calendar/calendar.png)

calendar를 검색하고

![CalendarStart]({{ site.url }}{{ site.baseurl }}/images/2019/google-calendar/calendarStart.png)

사용설정을 합니다.

![Lib]({{ site.url }}{{ site.baseurl }}/images/2019/google-calendar/lib.png)

사용자 인증 정보로 갑니다.

![Key]({{ site.url }}{{ site.baseurl }}/images/2019/google-calendar/key.png)

**사용자 인증 정보 만들기** 에서 **API 키** 를 만듭니다.

![KeyValue]({{ site.url }}{{ site.baseurl }}/images/2019/google-calendar/keyValue.png)

키 제한을 할 수 있습니다.

![KeyRole]({{ site.url }}{{ site.baseurl }}/images/2019/google-calendar/keyRole.png)

calendar만 사용할수 있게 제한을 할 수 있습니다.

### 2.캘린더에서 ID 얻기

<a href='https://calendar.google.com/calendar/' target='blank'>Google Calendar 사이트</a>

##### 1) 캘린더

![Cal]({{ site.url }}{{ site.baseurl }}/images/2019/google-calendar/cal.png)

원하는 캘린더에 **설정 및 공유** 를 들어갑니다.

![CalAuth]({{ site.url }}{{ site.baseurl }}/images/2019/google-calendar/calAuth.png)

캘린더 엑세스 권한을 설정합니다.

![CalID]({{ site.url }}{{ site.baseurl }}/images/2019/google-calendar/calID.png)

캘린더 ID를 얻었습니다 🎉🎉🎉

<a href='https://www.googleapis.com/calendar/v3/calendars//events?orderBy=startTime&singleEvents=true&timeMax=&timeMin=&key=' target='blank'>https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events?orderBy=startTime&singleEvents=true&timeMax=${maxTime}&timeMin=${minTime}&key=${googleKey}</a>

${calendarID}는 찾은 calendarID 를 입력해 줍니다.<br>
${googleKey}는 googleKey를 입력해 줍니다.<br>
${minTime}검색할 최소 날짜를 입력해 줍니다.<br>
${maxTime}검색할 최대 날짜를 입력해 줍니다.

시간은 RFC3339 룰을 사용합니다.

minTime를 2019-05-23T00:00:00Z<br>
maxTime 2019-05-25T00:00:00Z

를 해보겠습니다.

![CalJson]({{ site.url }}{{ site.baseurl }}/images/2019/google-calendar/calJson.png)

<span>calendarID 입력</span><br>
<input id="input_id" type="text" value="" placeholder="calendarID를 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>googleKey 입력</span><br>
<input id="input_googleKey" type="text" value="" placeholder="googleKey를 입력해 주세요." style="height: 40px; width: 100%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
<span>최소 ~ 최대 일정 입력</span><br>
<input id="input_min" type="date" value="" style="height: 40px; width: 48%; border: 2px solid black; border-radius: 5px; font-size: 15px;"> ~
<input id="input_max" type="date" value="" style="height: 40px; width: 48%; border: 2px solid black; border-radius: 5px; font-size: 15px;">
(결과값 간단히 보기 <input id="check_find" checked="true" type="checkbox">)<br>
<button id="search_cal" style="height:44px; width: 15%; border-top: 2px solid black; border-radius: 5px; font-size: 16px; background-color: black; color: white;">캘린더 조회</button>
<pre id="print_json" style="padding: 0px; margin: 0px;"></pre>

### 3.Lambda 코드

##### 1) Code

```javascript
const https = require('https');
const util = require('util');

exports.handler = (event, context, callback) => {
  var todayDate = new Date();
  // var yesterdayDate = new Date(todayDate.getTime() - 1000*60*60*24);
  // var tomorrowDate = new Date(todayDate.getTime() + 1000*60*60*24);
  // var twoDayAgoDate = new Date(todayDate.getTime() + 1000*60*60*24*2);

  var calendarID = "";
  var googleKey = "";
  requestAPI({
    "method": "GET",
    "port": 443,
    "hostname": "www.googleapis.com",
    "path": `/calendar/v3/calendars/${calendarID}/events?orderBy=startTime&singleEvents=true&timeMax=${maxRFC3339(todayDate)}&timeMin=${minRFC3339(todayDate)}&key=${googleKey}`,
    "content": "",
  }, function(data) {
    var data = JSON.parse(data);
    console.log(data);
  }, function(e) {
    console.log(e);
  });

  const response = {
    statusCode: 200,
    headers: {"Access-Control-Allow-Origin": "*"},
    body: "Success"
  };
  callback(null, response);
};

// 통신 API
function requestAPI(request, callback, errorCallback) {
  const options = {
      method: (request["method"] || "GET"),
      hostname: (request["hostname"] || ""),
      port: (request["port"] || 443),
      headers: (request["headers"] || {"Content-Type": "application/json"}),
      path: (request["path"] || "")
  };
  const req = https.request(options, (res) => {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', (chunk) => {
      body = body + chunk;
    });
    res.on('end',function() {
      if (res.statusCode == 200 || res.statusCode == '200') {
        callback(body);
      } else {
        errorCallback(`statusCode Error: ${res.statusCode}`);
      }
    });
  });
  req.on('error', function (e) {
      errorCallback(e.responseText)
  });
  req.write(util.format("%j", (request["content"] || "")));
  req.end();
}

// 시간
function minRFC3339(date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  var day  = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
  return `${year}-${month}-${day}T00:00:00Z`;
}

// 시간
function maxRFC3339(date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  var day  = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
  return `${year}-${month}-${day}T23:59:59Z`;
}
```


<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script type="text/javascript">
$(document).ready(function() {

  $("#search_cal").click(function() {
    const id = $("#input_id").val();
    if (id == "" || id == undefined) {
      $("#print_json").empty();
      $("#print_json").append("id를 입력하세요.");
      return
    }

    const googleKey = $("#input_googleKey").val();
    if (googleKey == "" || googleKey == undefined) {
      $("#print_json").empty();
      $("#print_json").append("googleKey를 입력하세요.");
      return
    }

    const min = $("#input_min").val();
    if (min == "" || min == undefined) {
      $("#print_json").empty();
      $("#print_json").append("최소 날짜를 입력하세요.");
      return
    }

    const max = $("#input_max").val();
    if (max == "" || max == undefined) {
      $("#print_json").empty();
      $("#print_json").append("최대 날짜를 입력하세요.");
      return
    }

    var minDate = new Date(min);
    var maxDate = new Date(max);

    if (minDate > maxDate) {
      $("#print_json").empty();
      $("#print_json").append("최소 날짜가 최대 날짜를 넘으면 안됩니다.");
      return
    }

    const urlPath = `https://www.googleapis.com/calendar/v3/calendars/${id}/events?orderBy=startTime&singleEvents=true&timeMax=${maxRFC3339(maxDate)}&timeMin=${minRFC3339(minDate)}&key=${googleKey}`;

    $.ajax({
          type: "GET",
          url: urlPath,
          success: function(args) {
            $("#print_json").empty();
            if ($("#check_find").is(':checked')) {
              var json = JSON.stringify(args["items"], null, 4);
              $("#print_json").append(document.createTextNode(json));
            } else {
              var json = JSON.stringify(args, null, 4);
              $("#print_json").append(document.createTextNode(json));
            }
          },
          error: function(e) {
            var json = JSON.stringify(e, null, 4);
            $("#print_json").empty();
            $("#print_json").append(document.createTextNode(json));
          }
      });
  });

  // 시간
  function minRFC3339(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    var day  = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
    return `${year}-${month}-${day}T00:00:00Z`;
  }

  // 시간
  function maxRFC3339(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    var day  = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
    return `${year}-${month}-${day}T23:59:59Z`;
  }
});
</script>
