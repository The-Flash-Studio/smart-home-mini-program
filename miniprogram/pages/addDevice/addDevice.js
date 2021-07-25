
var app = getApp();
import commonRequestFunction from "../../api/index";
import {  prepareDevice,addDevice  } from '../../api/gatewayApi';


Page({
  data: {
    isPrepareDevice:true,
    nickName:"",
  },
  onLoad(options) {
    let {houseId,roomId,gatewayId} = options;
    houseId = 24;
    roomId = 22;
    this.doPrepareDevice(houseId,roomId);
    this.onSocketMessage();
  },
  doPrepareDevice(houseId,roomId) {
    prepareDevice({
      houseId: houseId,
      roomId: roomId
    }, (data) => {
      console.log('data:>>> ', data);
      this.setData({ isPrepareDevice:false })
    }, (error) => {
      console.log('error: ', error);
    })
  },
  onSocketMessage: function () {
    app.socketInfo.callback = function (res) {
      console.log("onSocketMessage Scene :", res);
    }
  },
  addDeviceFun(){
    addDevice({
      nickName:this.data.nickName
    },(data)=>{
      console.log('data:>>>||| ', data);
    },(error)=>{ console.log('error: ', error) })
  },
  bindKeyInput: function (e) {
    this.setData({ nickName:e.detail.value })
  },
})
