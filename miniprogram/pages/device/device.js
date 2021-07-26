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
    this.setData({
      props: JSON.parse(options.props)
    })
    let props = this.data.props;
    this.initDeviceInfo(props.roomId, props.gatewayId, props.roomId, props.deviceId)
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
            deviceAttribute: this.mockAttribute()
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
    let _this = this
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


  mockStatus() {
    return {}
  },
  mockAttribute() {
    let attribute = {
      clusterAttributes: {
        deviceId: 78,
        ieee: "0x000D6FFFFED209BF",
        statusCluster: [{
            "cluster": "0x0500",
            "statusOrCommand": "status",
            "attribute": null,
            "attributeName": "BatteryPercentage",
            "valueType": "number",
            "valueUnit": "%",
            "valueRange": " [{key:\"min\",val:\"0\"},{key:\"max\",val:\"100\"}]",

          },
          {
            "cluster": "0x0500",
            "statusOrCommand": "status",
            "attribute": null,
            "attributeName": "BatteryVoltage",
            "valueType": "number",
            "valueUnit": "伏特",
            "valueRange": " [{key:\"min\",val:\"0\"},{key:\"max\",val:\"200\"}]",
            "controlType": null
          },
          {
            "cluster": "0x0500",
            "statusOrCommand": "status",
            "attribute": null,
            "attributeName": "Dimmer",
            "valueType": "number",
            "valueUnit": "度",
            "valueRange": " [{key:\"min\",val:\"0\"},{key:\"max\",val:\"100\"}]",
            "controlType": null
          },
          {
            "cluster": "0x0500",
            "statusOrCommand": "status",
            "attribute": null,
            "attributeName": "Illuminance",
            "valueType": "number",
            "valueUnit": "流明",
            "valueRange": " [{key:\"min\",val:\"0\"},{key:\"max\",val:\"1000\"}]",
            "controlType": null
          },
          {
            "cluster": "0x0500",
            "statusOrCommand": "status",
            "attribute": null,
            "attributeName": "LinkQuality",
            "valueType": "number",
            "valueUnit": "%",
            "valueRange": " [{key:\"min\",val:\"0\"},{key:\"max\",val:\"300\"}]",
            "controlType": null
          },
          {
            "cluster": "0x0500",
            "statusOrCommand": "status",
            "attribute": null,
            "attributeName": "Manufacturer",
            "valueType": "text",
            "valueUnit": "",
            "valueRange": " [{key:\"min\",val:\"0\"},{key:\"max\",val:\"300\"}]",
            "controlType": null
          },
          {
            "cluster": "0x0500",
            "statusOrCommand": "status",
            "attribute": null,
            "attributeName": "ModelId",
            "valueType": "text",
            "valueUnit": null,
            "valueRange": " [{key:\"min\",val:\"0\"},{key:\"max\",val:\"300\"}]",
            "controlType": null
          },
          {
            "cluster": "0x0500",
            "statusOrCommand": "status",
            "attribute": null,
            "attributeName": "Power",
            "valueType": "list",
            "valueUnit": "",
            "valueRange": " [{key:\"0\",val:\"开\"},{key:\"1\",val:\"关\"}]",
            "controlType": null
          },
          {
            "cluster": "0x0500",
            "statusOrCommand": "status",
            "attribute": null,
            "attributeName": "Water",
            "valueType": "list",
            "valueUnit": "",
            "valueRange": " [{key:\"0\",val:\"干燥\"},{key:\"1\",val:\"湿润\"}]",
            "controlType": null
          }
        ],
      }
    }
    return attribute
  },

})