var router  = require('express').Router();  //get an instance of the express Router
var request = require('request');
var fs      = require('fs');
var crypto  = require('crypto');
var config  = require('../config.js');
var Util    = require('../lib/util.js');

Util.getAccessToken()
.then(function(token){
    console.log('获取 token 成功:', token);
});

router.use(function(req, res, next){
    console.log('index router');
    next();
});

// 微信认证接口
router.get('/wxauth', function(req, res){

    var token = config.token;
    
    var signature   = req.query.signature;	    //微信加密签名
   	var timestamp   = req.query.timestamp;   	//时间戳
   	var nonce       = req.query.nonce;        	//随机数
   	var echostr     = req.query.echostr;    	//随机字符串


   	/*  加密/校验流程如下： */

   	//1. 将token、timestamp、nonce三个参数进行字典序排序
   	var array = new Array(token,timestamp,nonce);
   	array.sort();
   	var str = array.toString().replace(/,/g,"");

   	//2. 将三个参数字符串拼接成一个字符串进行sha1加密
   	var sha1Code = crypto.createHash("sha1");
   	var code = sha1Code.update(str,'utf-8').digest("hex");

   	
   	//3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
   	if(code === signature){
      	res.send(echostr)
   	}else{
      	res.send("error");
   	}
});

// 将签名信息传给客户端
router.get('/wechatConfig', function(req, res){
    var url = req.query.url;
    Util.getAPITicket()
    .then(function(ticket){
        var nonceStr = Util.getNonceStr();
        var timestamp = Util.getTimestamp();
        var signature = Util.getSignature(ticket, nonceStr, timestamp, url);
        
        var data = {
            nonceStr: nonceStr,
            timestamp: timestamp,
            appId: config.appID,
            signature: signature,
            url: url
        };

        res.status(200).jsonp(data);
    });
});


module.exports = router;