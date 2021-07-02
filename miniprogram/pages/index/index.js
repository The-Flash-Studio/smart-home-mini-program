"use strict";
var app = getApp();
import {getUserDeviceInfo,wechatLogin,queryHouseByUser} from '../../api/index'

Page({
    data: {
        sceneList:[]
    }, 
    onLoad: function () {
        let _this = this,
            user_token = wx.getStorageSync('user_token');

        // 存在Token
        if(user_token){
            console.log('token:',user_token)
            queryHouseByUser({
                'token':user_token
            },{},(res)=>{
                console.log(res)
            })
        }
        // 不存在Token
        else{
            // 获取用户信息
            wx.login({
                success: function (res) {
                    const userCode = res.code;
                    app.userCode = userCode;
                    getUserDeviceInfo(userCode).then(e=>{
                        _this.setData(e)
                        console.log(e.sceneList);
                    })
                    // 微信登录
                    wechatLogin({
                        params:userCode
                    },(res)=>{
                        const {data:_token} = res.data;
                        !!_token && wx.setStorage({
                            key:"user_token",
                            data:_token
                        })
                    })
                }
            });
        }
    },  

    // 切换标签
    onChange: function (e) {
    }
});