var jsSHA     = require('jssha');
var qs        = require('querystring');
var request   = require('request');

exports.getNonceStr = function(){
  return Math.random().toString(36).substr(2, 15);
}

exports.getTimestamp = function(){
  return new Date().valueOf();
}

exports.getSignature = function(ticket, noncestr, timestamp, url){
  var data = {
    jsapi_ticket: ticket,
    noncestr: noncestrm,
    timestamp: timestamp,
    url: url
  };

  var sortData    = raw(data);
  var shaObj      = new jsSHA(sortData, 'TEXT');
  var signature  = shaObj.getHash('SHA-1', 'HEX');
  return signature;
}

exports.getAccessToken = function(){
  var accessTokenParams = {
    grant_type: 'client_credential',
    appid: config.appID,
    secret: config.appsecret
  };

  var wechatURL = 'https://api.weixin.qq.com/cgi-bin/token?' + qs.stringify(accessTokenParams);
  var options = {
    method: 'GET',
    url: wechatURL
  };

  return new Promise(function(resolve, reject){
    request.get(wechatURL, function(error, res, body){
      if(res) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  });
}

exports.getTicket = function(){

}