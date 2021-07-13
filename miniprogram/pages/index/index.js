"use strict";
var app = getApp();
import {getUserDeviceInfo,wechatLogin,queryHouseByUser} from '../../api/index'

Page({
    data: {
        sceneList:[],
        showPopup:false
    }, 
    onLoad: function () {
        let _this = this,
            user_token = wx.getStorageSync('user_token');

        // 存在Token
        if(user_token){
            // console.log('token:',user_token)
            getUserDeviceInfo().then(e=>{
                _this.setData(e)
                console.log(e.sceneList);
            })
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
    },

    // 添加设备
    clickToAddDevice: function(e){
        wx.scanCode({
            success (res) {
                console.log(res)
            }
        })
        // this.setData({
        //     showPopup:true
        // })
    },

    // 关闭popup
    onPopupClose: function(e){
        this.setData({
            showPopup:false
        })
    }
});