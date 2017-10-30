var jsSHA = require('jssha');

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

exports.getTicket = function(){
  
}