"use strict";
var app = getApp();
import { wechatLogin,houseQueryAll,queryRoomsByHouseId,findDevicesByRoomId,queryHouseByUser } from '../../api/index'
import { sendCommand } from '../../api/gatewayApi'
import { updateDeviceInfo } from '../../api/devcieApi'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
    data: {
        userId:null,
        houseList:[],
        houseNameList:[],
        currHouseData:null,
        currRoomData:null,
        roomList:[],
        devicesList:[],
        showPopup:false,
        popupContent:null,
        showOverlay:false,
        overlayContent:null,
        houseIdRadio:0
    }, 
    onLoad: function () {
        let _this = this,
            user_token = wx.getStorageSync('user_token');

        // 存在Token
        if(user_token){
            _this.fetchData(null,user_token)
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
                        _this.fetchData(null,_token)
                    })
                }
            });
        }
    },  

    fetchData: function(house_id,token){
        let _this = this
        _this.setData({
            houseList:[],
            houseNameList:[],
            currHouseData:null,
            currRoomData:null,
            roomList:[],
            devicesList:[],
            userId:null
        })

        // queryHouseByUser({token:token.token},{},(e)=>{
        //     console.log(e);
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
            console.log('--- 当前房子 ---',currHouseData)

            // 获取当前房子的房间列表
            queryRoomsByHouseId(curr_house_id,(e)=>{
                const {roomList = []} = e.data.data;
                const currRoomData = roomList.length>0 ? roomList[0] : {};
                console.log('--- 当前房间 ---',currRoomData)
                const {id:roomId} = currRoomData

                // 获取当前房间的设备列表
                findDevicesByRoomId(roomId,(e)=>{
                    const devicesList = e.data.data;
                    console.log('--- 当前设备 ---',devicesList)
                    _this.setData({
                        houseList,
                        houseNameList,
                        currHouseData,
                        currRoomData,
                        roomList,
                        devicesList,
                        userId,
                        houseIdRadio:currHouseData.id
                    },()=>{
                        _this.selectComponent('#tabs').resize();
                    })
                })
            })
        })
    },

    // 切换房间
    onChange: function (e) {
        const _this = this;
        const {index=0} = e.detail;
        const {id:roomId} = this.data.roomList[index]
        // 获取当前房间的设备列表
        findDevicesByRoomId(roomId,(e)=>{
            const devicesList = e.data.data;
            console.log('--- 当前设备列表 ---',devicesList)
            _this.setData({devicesList},()=>{
                _this.selectComponent('#tabs').resize();
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
        // wx.scanCode({
        //     success (res) {
        //         console.log(res)
        //     }
        // })
    },

    // 配置选项
    onConfigClick: function(e) {
        const { id } = e.currentTarget.dataset;
        this.setData({
            houseIdRadio:id
        })
    },

    // 切换房子
    onHounseChange:function(e){
        this.selectComponent('#tabs').resize();
        const changedHouseInfo = this.data.houseList[e.detail.index]
        const {id} = changedHouseInfo;
        this.fetchData(id);
        this.onPopupClose()
    },

    // 打开popup
    onPopupOpen:function(e){
        const { popupcontent } = e.currentTarget.dataset
        const popupContent = popupcontent ? popupcontent : null
        console.log('popupContent:',popupContent)
        this.setData({
            showPopup:true,
            popupContent
        })
    },

    // 关闭popup
    onPopupClose: function(){
        this.setData({
            showPopup:false,
            popupContent:null
        })
    },

    // 打开overlay
    onOverlayOpen:function(e){
        const { overlaycontent } = e.currentTarget.dataset
        const overlayContent = overlaycontent ? overlaycontent : null
        console.log('popupContent:',overlayContent)
        this.setData({
            showOverlay:true,
            overlayContent
        })
    },

    // 关闭overlay
    onOverlayClose: function(){
        this.setData({
            showOverlay:false,
            overlayContent:null
        })
    },
});
