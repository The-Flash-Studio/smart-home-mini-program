"use strict";
var app = getApp();
import {getUserDeviceInfo} from '../../api/index'

Page({
    data: {
        
    },
    onLoad: function () {
        // 获取用户openid
        wx.login({
            success: function (res) {
                const openid = res.code;
                app.openid = openid;
                getUserDeviceInfo(openid).then(e=>{
                    console.log(e);
                })
            }
        });
    },  
    // 切换标签
    onChange: function (e) {
        console.log(app.openid);
    }
});