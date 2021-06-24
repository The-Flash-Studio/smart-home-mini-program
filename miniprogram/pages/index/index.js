"use strict";
var app = getApp();
import {getUserDeviceInfo} from '../../api/index'

Page({
    data: {
        sceneList:[]
    },
    onLoad: function () {
        const _this = this;
        wx.login({
            success: function (res) {
                const openid = res.code;
                app.openid = openid;
                getUserDeviceInfo(openid).then(e=>{
                    _this.setData(e)
                    console.log(e.sceneList);
                })
            }
        });
    },  
    // 切换标签
    onChange: function (e) {
    }
});