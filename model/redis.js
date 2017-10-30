var redis = require('redis');
var client = redis.createClient('6379', '127.0.0.1');

client.on('ready', function(res){
  console.log('[redis message]: resdis server is ready.');
});

client.on('connect', function(){
  console.log('[redis message]: redis server had connected.');
});

client.on('error', function(error){
  console.log('[redis message]: error', error);
});

module.exports = client;