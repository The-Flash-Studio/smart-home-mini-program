"use strict";
import { isLoginCheck } from './api/index';
App({
    token: '',
    userId: '',
    houseList: [],
    gatewayList: [],
    socketInfo: {
        needHeartBeat:false,
        heartBeatTime: 20000,
        isSocketConnect: false,
        loginCheckTime: 120000,
        url: "wss://api.koudaibook.com/smart-iot/webSocket/",
        // url: "wss://10.32.33.151:5388/smart-iot/webSocket/",
        callback: function () { },
        clientTimer: null,
        heartTimer: null,
    },

    onLaunch: function () {
        const _this = this
    },

    onShow: function () {
        let _this = this;
        this.checkUserLoginStatus();
        this.socketInfo.socketClientTimer = setInterval(() => {
            _this.checkUserLoginStatus();
        }, this.socketInfo.loginCheckTime)
    },

    onHide: function () {
        clearInterval(this.socketInfo.socketClientTimer)
        this.doSocketCloseFunction()
    },

    checkUserLoginStatus: function () {
        let _this = this;
        isLoginCheck((isLogin, token) => {
            if (isLogin == true && token) {
                _this.token = token
                console.log('App token from callback')
                if (!_this.socketInfo.isSocketConnect) {
                    _this.doSocketConnectFunction(token)
                }
            } else {
                _this.doSocketCloseFunction()
            }
        })
    },

    doSocketConnectFunction: function (token) {
        var that = this
        wx.connectSocket({
            url: that.socketInfo.url + token,
            success: (res => {
                that.socketInfo.isSocketConnect = true
                that.initEventHandler()
            }),
            fail: (fail => {
                console.log("socket connect fail ", fail)
            })
        })
    },

    initEventHandler: function () {
        var that = this
        wx.onSocketOpen((result) => {
            if (that.socketInfo.needHeartBeat){
                that.startHeart()
            }
        })
        wx.onSocketClose((res) => {
            if (that.socketInfo.isSocketConnect) {
                that.doSocketConnectFunction(that.token)
            }
        })
        wx.onSocketMessage((res) => {
            console.log("App onSocketMessage : ", res)

            that.socketInfo.callback(res.data.replace('已收到',''))
        })
    },

    startHeart: function () {
        if (this.socketInfo.isSocketConnect) {
            this.socketInfo.socketHeartTimer = setInterval(() => {
                var msg = JSON.stringify({
                    'data': 'ping'
                })
                wx.sendSocketMessage({
                    data: msg,
                    success: function (res) { },
                    fail: function (res) { }
                })
            }, this.socketInfo.heartBeatTime)
        } else {
            clearTimeout(this.socketInfo.socketHeartTimer)
        }
    },

    doSocketCloseFunction: function () {
        if (this.socketInfo.isSocketConnect) {
            this.socketInfo.isSocketConnect = false
            wx.closeSocket()
            clearInterval(this.socketInfo.socketHeartTimer)
        }
    }

});