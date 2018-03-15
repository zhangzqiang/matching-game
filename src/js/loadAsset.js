"use strict";

function Asset() {

}

Asset.prototype.config = {
    bg0: new Image(),
    home: new Image(),
    home1: new Image(),
    bgm1: new Audio(),
    bgm2: new Audio(),
    ready: new Audio(),
}

//加载资源
Asset.prototype.load = function (asset, callback) {
    var self = this;
    var assetNumbers = Object.getOwnPropertyNames(asset).length;
    var loadNumbers = 1;
    for (var key in asset) {
        var obj = self.config[key];
        obj.src = asset[key];
        if (obj.tagName.toLowerCase() == 'img') {
            obj.onload = function () {
                loadNumbers++;
                callback(parseInt((loadNumbers / assetNumbers) * 100));
            }
        }
        else if (obj.tagName.toLowerCase() == 'audio') {
            obj.onloadedmetadata = function () {
                loadNumbers++;
                callback(parseInt((loadNumbers / assetNumbers) * 100));
            }
        }
    }
}

module.exports = new Asset();