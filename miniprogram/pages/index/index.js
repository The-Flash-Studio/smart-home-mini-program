"use strict";
var app = getApp();
import {getUserDeviceInfo,wechatLogin,houseQueryAll,roomQueryAll,gatewayQueryAll,queryDevicesByGatewayId} from '../../api/index'

Page({
    data: {
        userId:null,
        houseList:[],
        houseNameList:[],
        currHouseData:null,
        roomList:[],
        gatewayList:[],
        currGateway:null,
        showPopup:false,
    }, 
    onLoad: function () {
        let _this = this,
            user_token = wx.getStorageSync('user_token');

        // 存在Token
        if(user_token){
            // console.log('token:',user_token)
            _this.fetchData()
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
                        _this.fetchData()
                    })
                }
            });
        }
    },  

    fetchData: function(house_id){
        let _this = this

        // getUserDeviceInfo().then(e=>{
        //     _this.setData(e)
        //     console.log(e.sceneList);
        // })

        // 当前房子集合（用于测试）
        houseQueryAll((e)=>{
            const data = e.data.data;
            const {houseList,userId} = data

            let curr_house_id = house_id ? house_id : wx.getStorageSync('curr_house_id');
            if(!curr_house_id || house_id){
                curr_house_id = house_id ? house_id : houseList[0].id
                wx.setStorage({
                    key:"curr_house_id",
                    data:curr_house_id
                })
            }
            const currHouseData = houseList.filter(e=>e.id===curr_house_id)[0];
            const houseNameList = houseList.map(e=>e.name)

            this.setData({
                houseList,
                userId,
                currHouseData,
                houseNameList
            })
            
            // // 当前房间集合（用于测试）
            // roomQueryAll((e)=>{
            //     const data = e.data.data;
            //     const {roomList} = data;
            //     _this.setData({roomList})
            // })

            // 当前网关组（用于测试）
            gatewayQueryAll((e)=>{
                const data = e.data.data;
                const {gatewayList} = data;
                const {id} = gatewayList[0]
                queryDevicesByGatewayId({
                    params:id
                },(res)=>{
                    _this.setData({gatewayList})
                })
            })
        })
    },

    // 切换标签
    onChange: function (e) {
        const index = e.detail.index;
        const data = this.data.gatewayList[index];
        const {id} = data;

        queryDevicesByGatewayId({
            params:id
        },(res)=>{
            console.log(res)
        })
    },

    // 添加设备
    clickToAddDevice: function(e){
        wx.scanCode({
            success (res) {
                console.log(res)
            }
        })
    },

    // 切换房子
    onHounseChange:function(e){
        const changedHouseInfo = this.data.houseList[e.detail.index]
        const {id} = changedHouseInfo;
        this.fetchData(id);
        this.onPopupClose()
    },

    // 打开popup
    onPopupOpen:function(){
        this.setData({
            showPopup:true
        })
    },

    // 关闭popup
    onPopupClose: function(e){
        this.setData({
            showPopup:false
        })
    }
});