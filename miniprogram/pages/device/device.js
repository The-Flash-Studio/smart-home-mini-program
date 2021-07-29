var app = getApp();
import {
  getDeviceInfo,
  getDeviceStatus,
  getDeviceSupportAttribute
} from '../../api/devcieApi';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
    props: {},
    currentCheckValue: false,
    currentValue: 48,
    currentValueShow: 48,
    circleGradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24',

    },
    deviceInfo: {},
    deviceStatus: {},
    deviceAttribute: {},
    isRequesting: false,
    requestTask: '',
  },

  onLoad: function (options) {
    if (!options.props) {
      return
    }
    this.onSocketMessage();
    this.setData({
      props: JSON.parse(options.props)
    })
    let props = this.data.props;
    this.initDeviceInfo(props.roomId, props.gatewayId, props.roomId, props.deviceId)
  },

  onSocketMessage: function () {
    app.socketInfo.callback = function (res) {
      console.log("onSocketMessage Device :", res)
    }
  },

  onReady:function(options){
    this.statusItem = this.selectComponent("#statusItem")
  },

  initDeviceInfo(houseId, gatewayId, roomId, deviceId) {
    getDeviceInfo(deviceId, (data) => {
        this.setData({
          deviceInfo: data
        })
      },
      (error) => {

      });
    // getDeviceStatus(deviceId, (data) => {
    //     this.setData({
    //       deviceStatus: data
    //     })
    //   },
    //   (error) => {
    //     console.log("getDeviceStatus error" + error);
    //   });
    getDeviceSupportAttribute(122, (data) => {
        console.log("getDeviceSupportAttribute " + data.deviceId)
        if (data.statusCluster && data.statusCluster.length > 0) {
          this.setData({
            deviceAttribute: data
          })
        } else {
          this.setData({
            deviceAttribute: []
          })
        }

      },
      (error) => {

      });
  },

  onDevcieItemClick:function(event){
    console.log("onDevcieItemClick ")
  },
  onCheckChange: function (event) {
    this.setData({
      currentCheckValue: event.detail
    })
    console.log('onCheckChange', event.detail)
  },
  onSliderChange: function (event) {
    this.setData({
      currentValue: event.detail
    })
  },

  onSliderDrag: function (event) {
    this.setData({
      currentValueShow: event.detail.value
    })
  },

  onConfirmSet: function (event) {
    this.setData({
      isRequesting: true
    })
    var _this = this
    _this.data.requestTask = setTimeout(function () {
      _this.setData({
        isRequesting: false
      })
    }, 3000)
  },

  onClickLeft: function (event) {
    wx.navigateBack({
      delta: 1,
    })
  },

  onClickRight: function (event) {
    Dialog.confirm({
        message: '是否确认删除此设备',
      })
      .then(() => { //confirm
        console.log('do delete device')
      })
      .catch(() => {

      })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.data.requestTask)
  },

})