/**
 * Created by ZhaoBoWen on 2016/11/19.
 */

"use strict";

const connect = require('./connect');
const loadAsset = require('./loadAsset');
const ajax = require('./ajax');
const util = require('./util');

//玩家信息
var begintiem, endtime, host_url;
var userInfo = {
    openid: '',
    nickName: '',
    playTime: 0,
    score: 0
}


var submitAnswer = function (content) {
    var maskEl = document.getElementsByClassName('mask')[0];
    var submitEl = document.getElementsByClassName('submit')[0];
    var scorePanelEl = document.getElementsByClassName('scorePanel')[0];
    var outGameEl = document.getElementsByClassName('outGame')[0];
    var retryEl = document.getElementsByClassName('retry')[0];
    var scoreEl = document.getElementsByClassName('score')[0];
    var sortEl = document.getElementsByClassName('sort')[0];
    var sortPanelEl = document.getElementsByClassName('sortPanel')[0];
    var contentEl = document.getElementsByClassName('content')[0];
    var closeEl = document.getElementsByClassName('close')[0];

    var submitInteval = setInterval(function () {
        var reslut = connect.getUserAnswer();
        if (reslut) {
            submitEl.classList.remove('hide');
            //判断是否已经配对完成
            if (content["left"].length == reslut.length) {
                submitEl.classList.add('submit-enable');
                submitEl.onclick = function (e) {
                    submitEl.classList.add('hide');
                    submitEl.classList.remove('submit-enable');

                    maskEl.classList.remove('hide');
                    scorePanelEl.classList.remove('hide');

                    var error_reslut = reslut.filter(function (item) { return item["correct"] == 0 });
                    var right_reslut = reslut.filter(function (item) { return item["correct"] == 1 });

                    //正确率
                    userInfo.score = right_reslut.length / reslut.length;
                    //耗时
                    endtime = new Date().getTime();
                    userInfo.playTime = ((endtime - begintiem) / 1000).toFixed(2);

                    //提交玩家游戏数据
                    if (userInfo.openid.length > 0) {
                        ajax({
                            url: host_url + 'uploadUser',    // 请求地址  
                            jsonp: 'jsonpCallback',  // 采用jsonp请求，且回调函数名为"jsonpCallbak"，可以设置为合法的字符串  
                            data: userInfo,
                            time: 2000,
                            success: function (res) {   // 请求成功的回调函数  
                                endtime = null;
                                scoreEl.innerHTML = "正确" + right_reslut.length + "对，错误" + error_reslut.length + "对";
                            },
                            error: function (error) {  // 请求失败的回调函数  
                                scoreEl.innerHTML = "正确" + right_reslut.length + "对，错误" + error_reslut.length + "对";
                            }
                        });
                    }
                    else {
                        scoreEl.innerHTML = "正确" + right_reslut.length + "对，错误" + error_reslut.length + "对";
                    }
                }
                clearInterval(submitInteval);
            }
        }
    }, 200);

    outGameEl.onclick = function (e) {
        maskEl.classList.add('hide');
        scorePanelEl.classList.add('hide');
        var reslut = connect.getUserAnswer();
        if (reslut) {
            connect.init(reslut, content, true);
        }

        retryEl.classList.remove('hide');
        if (userInfo.openid.length > 0) {
            //点击排行榜按钮
            sortEl.classList.remove('hide');
            sortEl.onclick = function () {
                //获取玩家排行信息
                ajax({
                    url: host_url + 'sortUser',    // 请求地址  
                    jsonp: 'jsonpCallback',  // 采用jsonp请求，且回调函数名为"jsonpCallbak"，可以设置为合法的字符串  
                    time: 2000,
                    success: function (res) {   // 请求成功的回调函数  

                        var content = "";
                        if (res.length > 0) {
                            for (var i = 0; i < res.length; i++) {
                                var item = res[i];
                                content = content + "<tr><td>" + (i + 1) + "</td><td><img src='" + item.headimgurl + "'/></td><td>" + item.nickName + "</td><td>" + parseFloat(item.score) * 100 + "%</td><td>" + parseFloat(item.playTime).toFixed(2) + "s</td></tr>"
                            }
                        }
                        contentEl.innerHTML = "<table>" + content + "</table>";
                        sortPanelEl.classList.remove('hide');
                    },
                    error: function (error) {  // 请求失败的回调函数  
                        sortPanelEl.classList.remove('hide');
                    }
                });
                closeEl.onclick = function () {
                    sortPanelEl.classList.add('hide');
                }
            }
        }
        else {
            retryEl.style.left = '2rem';
        }
        retryEl.onclick = function (e) {
            sortEl.classList.add('hide');
            retryEl.classList.add('hide');
            retryEl.style.left = '';
            submitEl.classList.remove('hide');
            submitEl.onclick = function (e) { return false }
            content = util.initContent(count);
            begintiem = new Date().getTime();
            connect.init([], content, false);
            submitAnswer(content);
        }
    }
}

//初始化游戏
window.initGame = function (count, hosturl) {
    host_url = hosturl;
    var loadingEl = document.getElementsByClassName('loading')[0];
    var homeEl = document.getElementsByClassName('home-page')[0];
    var gameBgEl = document.getElementsByClassName('gameBg')[0];
    var maskEl = document.getElementsByClassName('mask')[0];
    var startEl = document.getElementsByClassName('start')[0];
    var logoEl = document.getElementsByClassName('logo')[0];

    var content = util.initContent(count);
    var asset = {
        bg0: 'image/bg0.jpg',
        home: 'image/home.jpg',
        home1: 'image/home1.jpg',
        bgm1: 'music/bgm1.mp3',
        bgm2: 'music/bgm2.mp3',
        ready: 'music/ready.mp3'
    };
    //获取url中的参数（"?"符后的字串）
    var openid = util.getRequest().openid;


    //加载资源
    loadAsset.load(asset, function (percent) {
        if (percent == 100) { //图片、音乐加载完后
            setTimeout(function () {
                loadingEl.classList.add('hide');
                homeEl.classList.remove('hide');

                loadAsset.config.bgm1.play();
                loadAsset.config.bgm1.loop = true;

                // 获取玩家微信信息
                ajax({
                    url: host_url + 'userInfo',    // 请求地址  
                    jsonp: 'jsonpCallback',  // 采用jsonp请求，且回调函数名为"jsonpCallbak"，可以设置为合法的字符串  
                    data: { 'openid': openid },   // 传输数据  
                    time: 2000,
                    success: function (res) {   // 请求成功的回调函数  
                        logoEl.classList.add('wx');
                        logoEl.style["background-image"] = 'url("' + res.headimgurl + '")';
                        logoEl.querySelector('span').innerHTML = res.nickName
                        userInfo.openid = openid;
                        userInfo.nickName = res.nickName
                    },
                    error: function (error) {  // 请求失败的回调函数  
                        logoEl.classList.add('unkown');
                        logoEl.querySelector('span').innerHTML = util.generateMixed(10);
                    }
                });

                //首页监听事件，点击进入模式选择
                homeEl.onclick = function (e) {
                    homeEl.classList.add('hide');
                    gameBgEl.classList.remove('hide');
                    maskEl.classList.remove('hide');

                    loadAsset.config.bgm1.pause();
                    loadAsset.config.bgm1.loop = false;

                    loadAsset.config.bgm2.play();
                    loadAsset.config.bgm2.loop = true;

                    setTimeout(function () {
                        loadAsset.config.ready.play();
                        startEl.classList.add('start-left');
                    }, 500);
                    setTimeout(function () {
                        maskEl.classList.add('hide');
                        startEl.classList.add('start-right');
                        loadAsset.config.ready.pause();
                        setTimeout(function () {
                            startEl.classList.add('hide');
                            begintiem = new Date().getTime();
                            connect.init([], content, false);
                            submitAnswer(content);
                        }, 1000);
                    }, 2000);
                };
            }, 2000);
        }
    });
}


