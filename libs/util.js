var fs = require('fs')
var Promise = require('bluebird')
var xml2js = require('xml2js')
function formatMessage(result){
    var message = {};
    if(typeof result =='object'){
        var keys = Object.keys(result);
        for(var i = 0;i<keys.length;i++){
            var item = result[keys[i]];
            if(!(item instanceof Array)||item.length==0){
                continue;
            }
            if(item.length==1){
                var ms = item[0];
                if(typeof ms =="object"){
                    ms = formatMessage(ms);
                    message[keys[i]] = ms;
                }else{
                    message[keys[i]] = (ms||'').trim();
                }
            }else{
                message[keys[i]] = [];
                for(var j=0;j<item.length;j++){
                    message[keys[i]].push(formatMessage(itme[j]));
                }
            }
        }
    }

    return message;
}

module.exports = {
    readFileAsync: function (fpath, encoding) {
        
        return new Promise(function (resolve, reject) {
            try {
                fs.readFile(fpath, encoding, function (err, content) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(content)
                    }
                })
            } catch (e) {
              
            }
        })
    },
    writeFileAsync: function (fpath, content) {
        content = JSON.stringify(content)
        return new Promise(function (resolve, reject) {
            try {
                fs.writeFile(fpath, content, function (err) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            }catch(e){

            }
        })
    },
    parseXMLAsync : function(xml){
        return new Promise(function(reslove,reject){
            xml2js.parseString(xml,{trim:true},function(err,content){
                if(err){
                    reject(err)
                }else{
                    reslove(content)
                }

            })
        })
    },
    formatMessage
}