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
    isOffLine: false,
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
    noticeViewTask: '',
    showNotice: false,
  },

  onLoad: function (options) {
    if (!options.props) {
      return
    }
    let _this = this
    app.socketInfo.callback = function (res) {
      _this.onSocketMessage(res);
    };
    this.setData({
      props: JSON.parse(options.props)
    })
    let props = this.data.props;
    this.initDeviceInfo(props.roomId, props.gatewayId, props.roomId, props.deviceId)
  },

  onSocketMessage: function (res) {
    let _this = this
    if (!res) return
    var receiveData = JSON.parse(res)
    if (!receiveData) return
    if (receiveData.messageBody === 'offline') { //gateway-status
      _this.showNotice(true)
      console.log("return by messageType offline")
      return
    }
    if (receiveData.messageBody === 'online') { //gateway-status
      _this.showNotice(false)
      console.log("return by messageType online")
      return
    }

    if (receiveData.messageBody.upTime) { //似乎不是设备的upTime
      _this.setData({
        ["deviceInfo.upTime"]: receiveData.messageBody.upTime
      })
    }
    if (receiveData.messageType !== 'device-status') {
      console.log("return by messageType Not device-status")
      return
    }
    // if (_this.data.deviceInfo.id !== receiveData.deviceId) {
    //   console.log("return by message DeviceId Not Matched Current DeviceId" + receiveData.deviceId + _this.data.deviceInfo.id)
    //   return
    // }
    console.log("PageDevice onReceiveSocketMessage Json : ", receiveData)
    _this.parseSocketClusterData(receiveData.messageBody, _this.data.deviceAttribute)

  },

  parseSocketClusterData: function (messageBody, deviceAttribute) {
    if (!deviceAttribute || !deviceAttribute.statusCluster) return
    console.log("Parse Data From Socket Message Start -> ", messageBody)
    for (var clusterIndex = 0; clusterIndex < deviceAttribute.statusCluster.length; ++clusterIndex) {
      var cluster = deviceAttribute.statusCluster[clusterIndex]
      if (cluster.clusterAttributes && cluster.clusterAttributes.length > 0) {
        for (var attributeIndex = 0; attributeIndex < deviceAttribute.statusCluster[clusterIndex].clusterAttributes.length; ++attributeIndex) {
          var attribute = deviceAttribute.statusCluster[clusterIndex].clusterAttributes[attributeIndex];
          var value = messageBody[attribute.attributeName];
          console.log("parseSocketData try GetValue " + attribute.attributeName + ' --> ' + value)
          if (value || value == 0) {
            deviceAttribute.statusCluster[clusterIndex].clusterAttributes[attributeIndex].clusterValue = this.parseValueToShow(attribute, value)
          }
        }
      }
    }
    this.setData({
      deviceAttribute: deviceAttribute
    })
  },

  showNotice: function (isOffLine) {
    var _this = this
    _this.setData({
      isOffLine: isOffLine,
      showNotice: true,
    })
    _this.data.noticeViewTask = setTimeout(function () {
      _this.setData({
        showNotice: false
      })
    }, 3000)
  },

  onReady: function (options) {
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
    getDeviceSupportAttribute(deviceId, (data) => {
        console.log("getDeviceSupportAttribute " + data.deviceId)
        if (data.statusCluster && data.statusCluster.length > 0) {
          this.setData({
            deviceAttribute: data
          })
        } else {
          console.log("request DeviceSupportAttribute Empty statusCluster" + data.deviceId)
        }
      },
      (error) => {
        console.log("request DeviceSupportAttribute error" + data.deviceId)
      });
  },

  onDevcieItemClick: function (event) {
    console.log("onDevcieItemClick ")
    let messageString = "{\"messageBody\":{\"0500<00\":\"310000010000\",\"Water\":1,\"Endpoint\":1,\"ZoneStatusChange\":49,\"Device\":\"0x7E14\",\"LinkQuality\":92,\"ZoneStatusChangeZone\":1},\"messageType\":\"device-status\",\"target\":\"eyJraWQiOiJzaW1wbGVfaWQiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzaW1wbGVfaXNzdWVyIiwiaWF0IjoxNjI3NjY0ODAwLCJlbWFpbCI6Im1hc3RlckBleGFtcGxlLmNvbSIsIkF1dGhvcml6YXRpb24iOiJndWVzdCJ9.TbQQ5aMw-mfDrP2BzwsCY1qthH6Fe5Rkj6aklqKYGT62Prnb2pACcia0n2UGwriOerqYu6j-sHE4yLGBmKXVmi4ixvbD6dR0GoJYVhmA_TsImt_JyQDalGdaj4tq1VJ0-9nhSO1DQxx_gTzoGWM4XyiQqiv2UJADRks6kjyS2A5Bkih-Vozsn1jvINEwc0u52LUGEmbgJXMdvCLQ4H395DrFl3LFeMipBoWc4vtKLOohCdBc_3F4AwseVdL-I6mY15iK7LNlm-VD6bNtOoYHGVM8ivzp2B2U_iJSrdwGetHSPUh7z4sU5LRl_Xy6rI34RcSGIX7sLCMOIOp2yERYfg\"}";
    this.onSocketMessage(messageString);
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
  parseValueToShow: function (clusterAttribute, value) {
    if (!clusterAttribute) return '';
    console.log("parseValueToShow  cluster -> ", clusterAttribute)
    var valueType = clusterAttribute.valueType;
    if (valueType === "text" || valueType === "number") {
      console.log("parseValueToShow  value -> ", value)
      return value
    }
    var valueArray = JSON.parse(clusterAttribute.valueRange)
    if (!valueArray) return '';

    var valueString = ''
    for (var i = 0; i < valueArray.length; ++i) {
      var valueKV = valueArray[i]
      if (valueKV.key == value) {
        valueString = valueKV.val;
      }
    }
    console.log("parseValueToShow  value -> ", valueString)
    return valueString
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.data.requestTask)
    clearTimeout(this.data.noticeViewTask)
  },

})