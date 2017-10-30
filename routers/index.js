var router  = require('express').Router();  //get an instance of the express Router
var request = require('request');
var fs      = require('fs');
var cache   = require('memory-cache');
var crypto  = require('crypto');
var config  = require('../config.js');

router.use(function(req, res, next){
    console.log('index router');
    next();
});

router.get('/', function(req, res){

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

router.get('/wechatAuth', function(req, res){
    var url = req.query.url;
    // var 
});


module.exports = router;

    // router.route('/api/:bear_id')
    //     //get a single bear
    //     .get(function(req, res){

    //         Bear.findById(req.params.bear_id, function(err, bear){
    //             if(err)
    //                 res.send(err);
                
    //             res.json(bear);
    //         });
    //     })
    //     //updated bears
    //     .put(function(req, res){

    //         Bear.findById(req.params.bear_id, function(err, bear){

    //             if(err)
    //                 res.send(err);
                
    //             bear.name = req.body.name;

    //             bear.save(function(err){

    //                 if(err)
    //                     res.send(err);
                    
    //                 res.json({message: 'Bear updated!'});
    //             });
    //         });
    //     })
    //     //delete bears
    //     .delete(function(req, res){

    //         Bear.remove({
    //             _id: req.params.bear_id
    //         }, function(err, bear){

    //             if(err)
    //                 res.send(err);
                
    //             res.json({message: 'Successfully deleted!'});
    //         });
    //     });