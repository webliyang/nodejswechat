
var Koa = require('koa');
var path = require('path')
var wechat_file = path.join(__dirname,'./config/wechat.txt')
var util = require('./libs/util.js')
var wechat = require('./wechat/g.js')
var config = {
    wechat : {
        appID:'wxd45c9f972c360b86',
        appSecret:'361bbbc56d1c14f7767a22f2c45ed130',
        token:'yangzaiyichenglocaltunnelme',
        getAccessToken:function(){
            return util.readFileAsync(wechat_file,'utf-8')
        },
        saveAccessToken:function(data){
            return util.writeFileAsync(wechat_file,data)
        }
    }
}




var app = new Koa();
app.use(wechat(config.wechat))



app.listen(3200);
console.log('listening 3200')