"use strict";
import { wechatLogin } from './api/index';
App({
    openid: '',
    token: '',
    userId: '',
    houseList: [],
    gatewayList: [],
    socketInfo: {
        isSocketConnect: false,
        heartBeatTime: 20000,
        loginCheckTime: 30000,
        url: "ws://api.koudaibook.com/smart-iot/webSocket/",
        // url: "ws://10.32.33.151:5388/smart-iot/webSocket/",
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
        if (this.token) {//有效期检查
            if (!this.socketInfo.isSocketConnect) {
                _this.doSocketConnectFunction(this.token)
            }
            console.log('App token AlreadExist ')
            return
        }

        let user_token = wx.getStorageSync('user_token');

        if (user_token) {
            this.token = user_token
            console.log('App token from Storage')
            if (!this.socketInfo.isSocketConnect) {
                this.doSocketConnectFunction(user_token)
            }
            return
        }
        this.doSocketCloseFunction()
        let _this = this;
        wx.login({
            success: function (res) {
                const userCode = res.code;
                _this.userCode = userCode;
                console.log('App userCode from From WeChat:', userCode)
                // 微信登录
                wechatLogin({
                    params: userCode
                }, (res) => {
                    const { data: _token } = res.data;
                    !!_token && wx.setStorage({
                        key: "user_token",
                        data: _token.token
                    })
                    _this.token = _token.token
                    _this.doSocketConnectFunction(user_token)
                    console.log('App token From Server:', _token)
                }, (error) => {
                    console.log("App login error :", error)
                })
            }
        });
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
            that.startHeart()
        })
        wx.onSocketClose((res) => {
            if (that.socketInfo.isSocketConnect) {
                that.doSocketConnectFunction()
            }
        })
        wx.onSocketMessage((res) => {
            console.log("App onSocketMessage : ", res)
            that.socketInfo.callback(res.data)
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