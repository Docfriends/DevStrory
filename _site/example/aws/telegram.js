const https = require('https');
const http = require('http');
const util = require('util');

exports.telegramSendMessageRequest = function(token, sendRoomId, message, callback, errorCallback) {
  exports.request({
    'method': 'POST',
    'port': 443,
    'hostname': 'api.telegram.org',
    'path': `/bot${token}/sendMessage`,
    'content': {
        'chat_id': sendRoomId,
        'text': message,
        'parse_mode': 'HTML',
    },
  }, callback, errorCallback);
};

exports.request = function (request, callback, errorCallback) {
  const options = {
      method: (request['method'] || 'GET'),
      hostname: (request['hostname'] || ''),
      port: (request['port'] || 443),
      headers: (request['headers'] || {'Content-Type': 'application/json'}),
      path: (request['path'] || '')
  };
  const requestPort = options['port'] == 80 ? http : https
  const req = requestPort.request(options, (res) => {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', (chunk) => {
      body = body + chunk;
    });
    res.on('end',function() {
      if (res.statusCode == 200 || res.statusCode == '200') {
        if (callback) {
            callback(body);
        }
      } else {
        if (errorCallback) {
          console.log(res);
            errorCallback(`statusCode Error: ${res.statusCode}`, res);
        }
      }
    });
  });
  req.on('error', function (e) {
    if (errorCallback) {
        errorCallback(e.responseText, e);
    }
  });
  req.write(util.format('%j', (request['content'] || '')));
  req.end();
};
