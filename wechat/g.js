
var sha1 = require('sha1');
var Promise = require('bluebird')
var request = Promise.promisify(require('request'));
var api = {
    access_token : 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential'
}
function Wechat(opts){
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.getAccessToken().then(function(data){
        try{
            data = JSON.parse(data)
        }catch(e){
            return that.updateAccessToken()
        }
        if(that.isValidAccessToken(data)){
            Promise.resolve(data)
        }else{
            return that.updateAccessToken()
        }
    }).then(function(data){
        that.access_token = data.access_token
        that.expires_in = data.expires_in
        that.saveAccessToken(data)
    })
}
Wechat.prototype.isValidAccessToken = function(data){
    if(!data || !data.access_token || !data.expires_in){
        return false
    }
    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = new Date().getTime();
    if(now<expires_in){
        return ture;
    }else{
        return false;
    }
}
Wechat.prototype.updateAccessToken = function(data){
    var appID = this.appID;
    var appSecret = this.appSecret;
    var url = api.access_token + '&appid='+appID+'&secret='+appSecret
    return new Promise(function(resolve,reject){
        request({url:url,json:true}).then(function(response){
            var data = response[1]
            var now = new Date().getTime()
            var expires_in = now + (data.expires_in-20)*1000
            data.expires_in = expires_in
            resolve(data)
        })
    })
}


module.exports = function(opts){
    var wechat = new Wechat(opts)
    return function*(next){
        console.log(this.query);
        var token = opts.token;
        var signature = this.query.signature;
        var timestamp = this.query.timestamp;
        var nonce = this.query.nonce;
        var echostr = this.query.echostr;
        var str = [token,nonce,timestamp].sort().join('')
        var sha = sha1(str)
        if(sha===signature){
            this.body = echostr+'';
        }else{
            this.body = 'wrong';
        }
    
    }
}


