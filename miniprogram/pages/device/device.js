import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
    props:{},
    houseId: 0,
    houseName: "梅川路",
    roomId: 0,
    roomName: "客厅",
    operateType: 0,//0 详情，1 添加  
    currentCheckValue: false,
    currentValue: 48,
    currentValueShow: 48,
    circleGradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24',

    },
    steps: [
    ],
    stepsActive: 2,
    deviceInfo: {
      id: '122',
      gatewayId: '30',
      roomId: '',
      deviceId: "0x0402",
      description: "IAS Zone",
      profileId: "0x0104",
      modelId: null,
      manufacturer: null,
      shortAddress: "0x7E14",
      ieee: "0x000D6FFFFED209BF",
      nickName: "水浸传感器",
      endpoint: "0x01",
      powerSource: "true",
      security: "false",
      receiveWhenIdle: "false",
      status: 0,
      upTime: null,
      createTime: null,
      clusterAttributes: {
        deviceId: 78,
        ieee: "0x000D6FFFFED209BF",
        statusCluster: [
          {
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
            controlType: null
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
    },
    isRequesting: false,
    requestTask: '',
  },

  onLoad: function (options) {
    if(options.props){
      this.setData({
        props:JSON.parse(options.props) 
      })
      console.log("1 "+this.data.props.houseId)
      console.log("2 "+this.data.props.gatewayId)
      console.log("3 "+this.data.props.roomId)
      console.log("4 "+this.data.props.deviceId)
    }
    this.makeUpSteps();
  },

  makeUpSteps() {
    let steps = this.data.operateType == 1 ? [
      {
        text: this.data.houseName,
        activeIcon: 'arrow',
        inactiveIcon: 'arrow',
      }, {
        text: this.data.roomName,
        activeIcon: 'arrow',
        inactiveIcon: 'arrow',
      }, {
        text: "添加设备",
        activeIcon: 'add-o',
        inactiveIcon: 'add-o',
      }, {
        text: "添加成功",
        activeIcon: 'passed',
        inactiveIcon: 'passed',
      },
    ] : [
      {
        text: this.data.houseName,
        activeIcon: 'circle',
        inactiveIcon: 'circle',
      }, {
        text: this.data.roomName,
        activeIcon: 'circle',
        inactiveIcon: 'circle',
      }, {
        text: this.data.deviceInfo.nickName ? this.data.deviceInfo.nickName : "设备详情",
        activeIcon: 'setting-o',
        inactiveIcon: 'setting-o',
      },]
    this.setData({
      steps: steps,
    })
  },

  onCheckChange: function (event) {
    this.setData({ currentCheckValue: event.detail })
    console.log('onCheckChange', event.detail)
  },
  onSliderChange: function (event) {
    this.setData({ currentValue: event.detail })
  },

  onSliderDrag: function (event) {
    this.setData({ currentValueShow: event.detail.value })
  },

  onConfirmSet: function (event) {
    this.setData({ isRequesting: true })
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
      .then(() => {//confirm
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