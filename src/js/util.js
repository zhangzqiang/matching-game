"use strict";
var Util = function () { }


Util.prototype.getRandomArray = function (count) {
    var array = [];
    while (array.length < count) {
        var random = Math.floor(Math.random() * count) + 1;
        if (array.indexOf(random) < 0) {
            array.push(random);
        }
    }
    return array;
}


/**
 * 获取随机字符串
 * @param {*长度} n 
 */
Util.prototype.generateMixed = function (n) {
    var res = "";
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}

Util.prototype.getRequest = function () {
    var url = decodeURI(location.search);
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

Util.prototype.initContent = function (count) {
    var left = [];
    var right = [];

    var data = this.getRandomArray(count);
    for (var i = 0; i < count; i++) {
        right[i] = {};
    }

    data.forEach(function (item, index) {
        left.push({
            c: "<img src='./image/left/" + (index + 1) + ".jpg' alt=''/>",
            aw: item - 1
        });
        right[item - 1] = {
            c: "<img src='./image/right/" + (index + 1) + ".jpg' alt=''/>"
        }
    });

    return {
        left: left,
        right: right
    }
}

//格式化参数     
Util.prototype.formatParams = function (data) {
    var arr = [];
    for (var name in data) {
        //encodeURIComponent用于对 URI 中的某一部分进行编码  
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    };
    // 添加一个随机数参数，防止缓存     
    arr.push('v=' + Math.floor(Math.random() * 10000 + 500));
    return arr.join('&');
}

module.exports = new Util();