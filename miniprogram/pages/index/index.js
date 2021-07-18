"use strict";
var app = getApp();
import { wechatLogin,houseQueryAll,roomQueryAll,gatewayQueryAll } from '../../api/index'
import { queryDevicesByGatewayId,sendCommand } from '../../api/gatewayApi'
import { updateDeviceInfo } from '../../api/devcieApi'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
    data: {
        userId:null,
        houseList:[],
        houseNameList:[],
        currHouseData:null,
        roomList:[],
        devicesList:[],
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
        _this.setData({
            houseList:[],
            houseNameList:[],
            currHouseData:null,
            roomList:[],
            devicesList:[],
        })

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
            console.log(currHouseData)
            
            // 当前房间集合（用于测试）
            roomQueryAll((e)=>{
                const data = e.data.data;
                const {roomList} = data;
                console.log(roomList)
                _this.setData({roomList})

                // 查询网关下设备列表
                queryDevicesByGatewayId({id:30},(e)=>{
                    const {devices:devicesList} = e;
                    console.log(devicesList)
                    _this.setData({
                        devicesList
                    })
                })


            })
        })
    },

    // 切换标签
    onChange: function (e) {
        // 查询网关下设备列表
        queryDevicesByGatewayId({id:30},(e)=>{
            const {devices:devicesList} = e;
            console.log(devicesList)
            this.setData({
                devicesList
            })
        })
    },

    // 切换设备状态
    onDeviceStatusChange: function(e){
        let {changeddeviceid} = e.target.dataset,currDeviceData;

        const newDvicesList = this.data.devicesList.map((e)=>{
            const item = e;
            if(e.id === changeddeviceid){
                item.powerSource = e.powerSource == 'false' ? 'true' : 'false'
                currDeviceData = item;
            }
            return item;
        });

        // 发送控制命令
        // sendCommand(currDeviceData,()=>{
            // 更新设备信息
            !!currDeviceData && updateDeviceInfo(currDeviceData,(e)=>{
                Toast.success(`${currDeviceData.powerSource === 'true' ? '打开' : '关闭'}${currDeviceData.nickName}`);
                this.setData({
                    devicesList:newDvicesList
                })
            },(err)=>{
                Toast.fail('状态切换失败');
            })
        // },(err)=>{
        //     Toast.fail('控制命令失败');
        // })
        
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
