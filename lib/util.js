var jsSHA     = require('jssha');
var qs        = require('querystring');
var request   = require('request');
var config    = require('../config.js');
var redis     = require('../model/redis.js');

var raw = function(args){
  var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

exports.getNonceStr = function(){
  return Math.random().toString(36).substr(2, 15);
}

exports.getTimestamp = function(){
  return new Date().valueOf();
}

exports.getSignature = function(ticket, noncestr, timestamp, url){
  var data = {
    jsapi_ticket: ticket,
    noncestr: noncestr,
    timestamp: timestamp,
    url: url
  };

  var sortData    = raw(data);
  var shaObj      = new jsSHA('SHA-1', 'TEXT');
  shaObj.update(data);
  var signature   = shaObj.getHash('HEX');
  return signature;
}

exports.getAccessToken = function(){
  var context = this;
  return new Promise(function(resolve, reject){
    redis.get('access_token', function(err, obj){
      if(err) {
        resolve(err);
      } else {
        if(obj) {
            resolve(obj);
        } else {
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

          request.get(wechatURL, function(error, res, body){
            if(res) {
              console.log(body);
              var data = JSON.parse(body);
              context.saveAccessToken(data['access_token'], data['expires_in']);
              resolve(data['access_token']);
            } else {
              reject(error);
            }
          });
        }
      }
    });
  });
}

exports.saveAccessToken = function(token, expires){
  redis.set('access_token', token, 'EX', expires);
  redis.get('access_token', function(err, obj){
    console.log('保存 access_token 成功: ', obj);
  });
}

exports.getAPITicket = function(){
  var context = this;
  return new Promise(function(resolve, reject){
    context.getAccessToken()
    .then(function(token){
      var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi';

      var options = {
        methods: 'get',
        url: url
      };

      redis.get('jsapi_ticket', function(err, obj){
        if(err) {
          resolve(err);
        } else {
          if(obj) {
            resolve(obj);
          } else {
            request(options, function(err, res, body){
              if(res) {
                var data = JSON.parse(body);
                context.saveAPITicket(data['ticket'], data['expires_in']);
                resolve(data['ticket']);
              } else {
                reject(err);
              }
            });
          }
        }
      });
    });
  });
}

exports.saveAPITicket = function(ticket, expires){
  redis.set('jsapi_ticket', ticket, 'EX', expires);
  redis.get('jsapi_ticket', function(err, obj){
    console.log('保存 jsapi_ticket 成功: ', obj);
  });
}