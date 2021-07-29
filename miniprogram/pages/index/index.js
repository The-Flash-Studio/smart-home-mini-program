"use strict";
var app = getApp();
import { sendCommand } from '../../api/gatewayApi'
import { updateDeviceInfo,findDevicesByRoomId } from '../../api/devcieApi'
import { queryHouseByUser,update as updateHouse,getHouseByHouseId,addHouse,removeHouse } from '../../api/houseApi'
import { queryRoomsByHouseId,getRoomByRoomId,addRoom,updateRoom,removeRoom } from '../../api/roomApi'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
    data: {
        showLoading:true,
        userId:null,
        houseList:[],
        houseNameList:[],
        currHouseData:{},
        currRoomData:null,
        roomList:[],
        devicesList:[],
        showPopup:false,
        popupContent:null,
        showOverlay:false,
        overlayContent:null,
        houseIdRadio:-1,
        roomIdRadio:-1,
        houseIndexRadio:0,
        managementComConfig:null,
        settingComConfig:null,
        showConfirmBtn:false
    }, 
    onLoad: function () {
        this.fetchData()
    },  

    // 获取数据
    fetchData: function(house_id){
        let _this = this
        // 初始化data
        _this.setData({
            houseList:[],
            houseNameList:[],
            currHouseData:null,
            currRoomData:null,
            roomList:[],
            devicesList:[],
            userId:null,
            showLoading:true
        })

        // 当前房子集合
        queryHouseByUser((e)=>{
            const {houseList,userId} = e
            
            let houseIndexRadio = 0;
            let curr_house_id = house_id ? house_id : wx.getStorageSync('curr_house_id');
            if(!curr_house_id || house_id){
                curr_house_id = house_id ? house_id : houseList[0].id
                wx.setStorage({
                    key:"curr_house_id",
                    data:curr_house_id
                })
            }
            const currHouseData = houseList.filter(e=>e.id===curr_house_id)[0];
            const houseNameList = houseList.map((e,i)=>{
                if(e.id===curr_house_id) houseIndexRadio = i;
                return e.name
            })
            console.log('--- 当前房子 ---',currHouseData)
            this.setData({
                houseList,
                houseNameList,
                currHouseData,
                userId,
                houseIdRadio:currHouseData.id,
                houseIndexRadio
            },()=>{
                _this.selectComponent('#tabs').resize();
            })

            // 获取当前房子的房间列表
            !curr_house_id && this.setData({showLoading:false})
            queryRoomsByHouseId(curr_house_id,(e)=>{
                const {roomList = []} = e;
                const currRoomData = roomList.length>0 ? roomList[0] : {};
                console.log('--- 当前房间 ---',currRoomData)
                const {id:roomId} = currRoomData

                _this.setData({
                    currRoomData,
                    roomList,
                },()=>{
                    _this.selectComponent('#tabs').resize();
                })          

                // 获取当前房间的设备列表
                !roomId && this.setData({showLoading:false})
                findDevicesByRoomId(roomId,(e)=>{
                    const devicesList = e;
                    console.log('--- 当前设备 ---',devicesList)
                    _this.setData({
                        devicesList,
                        showLoading:false
                    })
                },(err)=>{this.setData({showLoading:false})})
            },(err)=>{this.setData({showLoading:false})})
        },(err)=>{this.setData({showLoading:false})})
    },

    // 切换房子
    onHounseChange:function(e){
        this.selectComponent('#tabs').resize();
        const changedHouseInfo = this.data.houseList[e.detail.index]
        const {id} = changedHouseInfo;
        this.fetchData(id);
        this.onPopupClose()
    },

    // 切换房间
    onChange: function (e) {
        const _this = this;
        const {index=0} = e.detail;
        const {id:roomId} = this.data.roomList[index]
        // 获取当前房间的设备列表
        findDevicesByRoomId(roomId,(e)=>{
            const devicesList = e;
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
            },()=>{
                Toast.fail('状态切换失败');
            })
        // },(err)=>{
        //     Toast.fail('控制命令失败');
        // })
        
    },

    // 添加设备
    addDevice: function(e){
        const _this = this;
        const {currHouseData={},currRoomData={}} = this.data;
        const {id:houseId,gatewayId=[]} = currHouseData;
        const {id:roomId} = currRoomData;
        if(typeof houseId === 'number' && gatewayId.length>0 && typeof roomId === 'number'){
            // 跳转至添加设备页
            const props = {
                houseId,
                gatewayId:gatewayId[0],
                roomId,
            }
            wx.navigateTo({
              url: 'pages/addDevice/addDevice?props='+JSON.stringify(props),
            })
        }else{
            // 关联网关
            _this.scanToConnectGateway()
        }
    },

    // 跳转至设备详情页
    jumpToDevicePage: function(e) {
        const {currHouseData={},currRoomData={}} = this.data;
        const {id:houseId,gatewayId=[]} = currHouseData;
        const {id:roomId} = currRoomData;
        const {deviceid} = e.currentTarget.dataset
        const props = {
            houseId,
            gatewayId:gatewayId,
            roomId,
            deviceId:deviceid
        }
        wx.navigateTo({
            url: `/pages/device/device?props=${JSON.stringify(props)}`,
        })
    },

    // 扫码关联网关
    scanToConnectGateway: function(){
        const _this = this;
        const {currHouseData} = this.data;
        Dialog.confirm({
            title: `关联网关`,
        }).then(() => {
            wx.scanCode({
                success (res) {
                    const params = Object.assign(currHouseData,{
                        gatewayId:!!currHouseData.gatewayId ? currHouseData.gatewayId.unshift(res) : [res]
                    })
                    updateHouse(params,()=>{
                        Toast.success(`【${currHouseData.name}】关联网关成功`);
                        _this.fetchData(currHouseData.id)
                    },()=>{
                        Toast.fail('关联网关失败');
                    })
                }
            })
        }).catch(() => {
            _this.fetchData(currHouseData.id)
            _this.setData({showPopup:false,showOverlay:false})
        });
        
    },

    // 配置切换
    onConfigClick: function(e) {
        const { id } = e.currentTarget.dataset;
        const { type } = this.data.managementComConfig ? this.data.managementComConfig : {}
        const _data = {}
        switch (type) {
            case 'house':
                _data.houseIdRadio = id;
                break;
            case 'room':
                _data.roomIdRadio = id;
                break;
        }
        this.setData(_data)
    },

    // 房子配置
    showHouseConfig :function(){
        const {currHouseData,houseList} = this.data;
        const managementComConfig = {
            radioId:currHouseData.id,
            contentList:houseList,
            type:'house'
        };
        this.setData({
            managementComConfig
        })
    },

    // 房间配置
    showRoomConfig :function(){
        const { houseIdRadio,currHouseData } = this.data;
        queryRoomsByHouseId(houseIdRadio,(e)=>{
            const { roomList } = e
            const managementComConfig = {
                radioId:roomList.length > 0 ? roomList[0].id : 9999,
                contentList:roomList,
                type:'room'
            };
            this.setData({
                managementComConfig,
                roomIdRadio:roomList.length > 0 ? roomList[0].id : 9999
            })
        },()=>{
            console.error('获取房间失败')
        })
        
    },

    // 删除House/Room
    deleteHouseOrRoom:function(){
        Dialog.confirm({
            title: '删除？',
        }).then(() => {
            this.settiingHouseOrRoom('delete')
        }).catch(() => {
        });
    },

    // 操作House/Room
    settiingHouseOrRoom(type){
        const _this = this;
        const { houseIdRadio,roomIdRadio,settingComConfig } = this.data;
        console.log(type,houseIdRadio,roomIdRadio,settingComConfig)
        // house
        if(roomIdRadio && roomIdRadio<0){
            switch (type) {
                case 'add':
                    addHouse(settingComConfig,(e)=>{
                        _success()
                    })
                    console.log('-- 添加房子 --',settingComConfig)
                    break;
                case 'update':
                    updateHouse(settingComConfig,(e)=>{
                        _success()
                    })
                    console.log('-- 修改房子 --',settingComConfig)
                    break;
                case 'delete':
                    removeHouse(houseIdRadio,(e)=>{
                        _success()
                    })
                    console.log('-- 删除房子 --',houseIdRadio)
                    break;
            }
        }
        // room
        else if(houseIdRadio && houseIdRadio>0 && roomIdRadio && roomIdRadio>0){
            switch (type) {
                case 'add':
                    addRoom(settingComConfig,(e)=>{
                        _success()
                    })
                    console.log('-- 添加房间 --',settingComConfig)
                    break;
                case 'update':
                    updateRoom(settingComConfig,(e)=>{
                        _success()
                    })
                    console.log('-- 修改房间 --',settingComConfig)
                    break;
                case 'delete':
                    removeRoom(roomIdRadio,(e)=>{
                        _success()
                    })
                    console.log('-- 删除房间 --',roomIdRadio)
                    break;
            }
        }

        function _success(){
            Toast.success(`操作成功`);
            _this.setData({
                showOverlay:false,
                showPopup:false,
                showConfirmBtn:false
            })
            _this.fetchData()
        }
    },

    // 配置信息变化
    onSettingChange:function(e){
        const type = e.currentTarget.dataset.type;
        const {settingComConfig} = this.data;
        const updateObj = {};
        updateObj[type] = e.detail;
        this.setData({
            settingComConfig:Object.assign(settingComConfig,updateObj),
            showConfirmBtn:true
        })
    },

    // 提交表单
    onConfirm:function(){
        const {overlayContent} = this.data;
        this.settiingHouseOrRoom(overlayContent)
    },

    // 打开popup
    onPopupOpen:function(e){
        // popup类型
        const { popupcontent } = e.currentTarget.dataset
        const popupContent = popupcontent ? popupcontent : null
        console.log('popupContent:',popupContent);

        switch (popupContent) {
            case 'houseSetting':
                this.showHouseConfig();
                break;
            case 'roomSetting':
                this.showRoomConfig();
                break;
        }

        this.setData({
            showPopup:true,
            popupContent
        })
    },

    // 关闭popup
    onPopupClose: function(){
        this.setData({
            showPopup:false,
            popupContent:null,
            managementComConfig:null,
            showConfirmBtn:false
        })
    },

    // 打开overlay
    onOverlayOpen:function(e){
        const { overlaycontent } = e.currentTarget.dataset
        const { houseIdRadio,roomIdRadio } = this.data
        const overlayContent = overlaycontent ? overlaycontent : null
        console.log('overlayContent:',overlayContent)

        let settingComConfig = {};        
        switch (overlayContent) {
            case 'update':
                // room
                if(roomIdRadio && roomIdRadio>0){
                    getRoomByRoomId(roomIdRadio,(e)=>{
                        settingComConfig = Object.assign(settingComConfig,e)
                        this.updateSettingConfig(overlayContent,settingComConfig)
                    },(err)=>{
                        console.log('获取房间信息失败',err)
                    })
                }
                // house
                else{
                    getHouseByHouseId(houseIdRadio,(e)=>{
                        settingComConfig = Object.assign(settingComConfig,e)
                        this.updateSettingConfig(overlayContent,settingComConfig)
                    },(err)=>{
                        console.log('获取房子信息失败',err)
                    })
                    
                }
                break;
            case 'add':
                // room
                if(roomIdRadio && roomIdRadio>0){
                    settingComConfig = {
                        floor:'',
                        houseId:houseIdRadio,
                        name:''
                    }
                }
                // house
                else{
                    settingComConfig = {
                        address:'',
                        name:''
                    }
                }
                this.updateSettingConfig(overlayContent,settingComConfig)
                break;
        }
    },

    updateSettingConfig:function(overlayContent,settingComConfig){
        console.log(settingComConfig)
        this.setData({
            showOverlay:true,
            overlayContent,
            settingComConfig
        },()=>{
            // this.settiingHouseOrRoom(overlayContent);
        })
    },

    // 关闭overlay
    onOverlayClose: function(){
        this.setData({
            showOverlay:false,
            overlayContent:null,
            settingComConfig:null,
            showConfirmBtn:false
        })
    },
});
