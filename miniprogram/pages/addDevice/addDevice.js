
var app = getApp();
import commonRequestFunction from "../../api/index";
import { prepareDevice, addDevice, openDevicePairing } from '../../api/gatewayApi';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';




Page({
  data: {
    isPrepareDevice: true,
    nickName: "",
    deviceId:'',
    roomId:'',
  },
  onLoad(options) {
  
    let { houseId, roomId, gatewayId } = options;
    console.log('houseId,roomId,gatewayId: ', houseId, roomId, gatewayId);
    this.setData({roomId})
    this.doPrepareDevice(houseId, roomId, gatewayId);
    this.onSocketMessage();
  },
  doPrepareDevice(houseId, roomId, gatewayId) {
    openDevicePairing({
      houseId: houseId,
      gatewayId: gatewayId,
      roomId: roomId,
    }, (data) => {
      console.log('data:>>> ', data);
      this.setData({ isPrepareDevice: false })
    }, (error) => {
      console.log('error: ', error);
    })
    // prepareDevice({
    //   houseId: houseId,
    //   roomId: roomId,
    //   gatewayId:gatewayId
    // }, (data) => {
    //   console.log('data:>>> ', data);
    //   this.setData({ isPrepareDevice:false })
    // }, (error) => {
    //   console.log('error: ', error);
    // })
  },
  onSocketMessage: function () {
    const _this = this;
    app.socketInfo.callback = function (res) {
      const respone =  JSON.parse(res);
      const messageBody = respone?.messageBody || {};
      const {id} = messageBody;
      _this.setData({deviceId:id})
      console.log('messageBody: ', messageBody);


    }
  },
  addDeviceFun() {
    addDevice({
      roomId:this.data.roomId,
      nickName: this.data.nickName,
      deviceId:this.data.deviceId,
    }, (data) => {
      Dialog.alert({
        title: '提示',
        message: '添加设备成功',
      }).then(() => {
        wx.navigateBack();
      })
    }, (error) => {  Dialog.alert({
      title: '提示',
      message: '添加设备失败',
    }).then(() => {
      wx.navigateBack();
    }) })
  },
  bindKeyInput: function (e) {
    this.setData({ nickName: e.detail.value })
  },
})
