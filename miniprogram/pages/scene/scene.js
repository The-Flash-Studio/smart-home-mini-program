// miniprogram/pages/scene/scene.js
var app = getApp();

import { addDevice, addGateWay, prepareDevice, queryDevicesByGatewayId, queryGateWaryByHouseId, queryGatewayById, removeGateway } from '../../api/gatewayApi';
import {
  addHouse, queryHouseByUser, removeHouse
} from '../../api/houseApi';
import { wechatLogin } from '../../api/index';
import {
  getAllMockDevices
} from '../../api/devcieApi';
import header from './templates/header';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseList: [],
    sceneTypeList: [],
    inputHouseName: "AAA",
    inputHouseAddress: "BBBB",
    showHouseAddDialog: false,
    showHouseChangeDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onSocketMessage();
    const _this = this;
    let user_token = app.token

    // 存在Token
    if (user_token) {
      
      console.log('token from App:', user_token)
      this.loginSuccessAction(user_token)
    }
    // 不存在Token
    else {
      let storageToken = wx.getStorageSync('user_token');
      // 获取用户信息
      if (storageToken) {
        app.token = user_token
        console.log('token from Storage:', user_token)
        this.loginSuccessAction(user_token)
        return
      }
      wx.login({
        success: function (res) {
          const userCode = res.code;
          app.userCode = userCode;

          console.log('userCode from From WeChat:', userCode)
          // 微信登录
          wechatLogin({
            params: userCode
          }, (res) => {
            const { data: _token } = res.data;
            !!_token && wx.setStorage({
              key: "user_token",
              data: _token.token
            })
            app.token = _token.token
            console.log('token From Server:', _token)
            _this.loginSuccessAction(_token.token)
          })
        }
      });
    }

  },

  onSocketMessage: function () {
    var that = this
    app.socketInfo.callback = function (res) {
      console.log("onSocketMessage Scene :", res)
    }
  },

  loginSuccessAction: function (user_token) {
    getAllMockDevices(user_token).then(e => {
      this.setData(e)
    })

    queryHouseByUser((data) => {
      const _this = this
      console.log(data.userId)
      app.userId = data.userId
      app.houseList = data.houseList
      _this.setData({
        houseList: data.houseList

      })
      console.log("queryHouseByUser houseList -> " + app.houseList)
    }, (error) => {
      console.log("error->" + error.status.code + " - " + error.status.message)
    })
  },

  doPrepareDevice() {
    prepareDevice({
      // houseId: app.houseList[0].id,
      id: app.gatewayList[0].id,
    }, (data) => {
      console.log(data)
    }, (error) => {
      console.log(error)
    })
  },
  doAddDevice() {
    addDevice({}, (data) => {
      console.log(data)
    }, (error) => {
      console.log(error)
    })
  },

  gotoSceneDetail: function (e) {
    console.log("gotoSceneDetail")
    let sceneName = e.currentTarget.dataset.item.name
    let sceneType = e.currentTarget.dataset.item.sceneType
    let hasSet = e.currentTarget.dataset.item.hasSet == true
    wx.navigateTo({
      url: "../device/device?sceneName=" + sceneName + "&sceneType=" + sceneType + "&hasSet=" + hasSet
    })

  },

  executeScene: function (e) {
    console.log("executeScene")
    let sceneName = e.currentTarget.dataset.item.name
    let sceneType = e.currentTarget.dataset.item.sceneType
    let hasSet = e.currentTarget.dataset.item.hasSet == true
    wx.navigateTo({
      url: "../device/device?sceneName=" + sceneName + "&sceneType=" + sceneType + "&hasSet=" + hasSet
    })

  },

  onTitleClose: function (event) {
    header.onTitleClose(event)
  },

  onTitleAdd: function (event) {
    console.log(app.houseList)
    this.setData({
      showHouseAddDialog: true
    })
  },
  onEditHouseName: function (event) {
    this.setData({
      inputHouseName: event.detail
    })
  },
  onEditHouseAddress: function (event) {
    this.setData({
      inputHouseAddress: event.detail
    })
  },

  doHouseAddRequest: function (event) {
    console.log("添加前", this.data.inputHouseName)
    if (app.houseList) {
      console.log("执行添加house")
      addHouse({
        'userId': app.userId,
        'name': this.data.inputHouseName,
        'address': this.data.inputHouseAddress,
      }, (data) => {
        app.houseList.push({
          id: data.id,
          name: data.name,
          address: data.address,
          userId: data.userId,
        })
        console.log(app.houseList)
        wx.showToast({
          title: '添加成功',
          icon: ''
        })
        this.setData({
          inputHouseName: "",
          inputHouseAddress: "",
        })
      }, (error) => {
        console.log("error->" + error.status.code + " - " + error.status.message)
      })
    } else {
      wx.showToast({
        title: '未获取houseList',
        icon: ''
      })
    }
  },

  removeHouse: function (event) {
    if (!app.houseList) {
      console.log("app.houseList is undefined")
      return
    }
    if (app.houseList.length < 1) {
      console.log("房间已经为空")
      return
    }
    removeHouse(app.houseList[app.houseList.length - 1].id,
      (data) => {
        console.log("removeHouse data -> " + data)//删除后重置houseList
      }, (error) => {
        console.log("removeHouse error -> " + error)
      })
  },
  onTitleVolume: function (event) {
    console.log("onTitleVolume")
  },


  doRemoveGateWay: function (event) {
    if (!app.gatewayList) {
      console.log("app.gatewayList is undefined")
      return
    }
    if (app.gatewayList.length < 1) {
      console.log("请先添加一个网关，或查询赋值")
      return
    }
    console.log("doRemoveGateWay")
    removeGateway(app.gatewayList[app.gatewayList.length - 1].id, (data) => {
      console.log("doRemoveGateWay -> " + data)
    }, (error) => {
      console.log("doRemoveGateWay -> " + error)
    })
  },


  doQuerySingleGateway: function (event) {
    if (!app.gatewayList) {
      console.log("app.houseList is undefined")
      return
    }
    if (app.gatewayList.length < 1) {
      console.log("请先添加一个网关，或查询赋值")
      return
    }
    queryGatewayById(app.gatewayList[0].id, (data) => {
      console.log("queryGatewayById result ->" + data)
    }, (error) => {
      console.log("error->" + error.status.code + " - " + error.status.message)
    })
  },

  queryDevicesByGatewayId: function (event) {
    queryDevicesByGatewayId(30, (data) => {
      console.log("queryDevicesByGatewayId result ->" + data)
    }, (error) => {
      console.log("error->" + error.status.code + " - " + error.status.message)
    })
  },

  doAddGateway: function (event) {
    console.log("doAddGateway")
    if (!app.houseList) {
      console.log("doAddGateway app.houseList is undefined")
      return
    }
    if (app.houseList.length < 1) {
      console.log("请先添加一个房间")
      return
    }
    addGateWay({
      "houseId": app.houseList[0].id,
      "macAddress": "oO5Ay5ZSGlsaiga3rSIbOV_WPwKs:CCCCCCCCE2ABF498",
    }, (data) => {
      console.log("doAddGateWay result ->" + data)
    }, (error) => {
      console.log("error->" + error.status.code + " - " + error.status.message)
    })
  },

  queryGateWays: function () {
    console.log("queryGateWays")
    if (!app.houseList) {
      console.log("app.houseList is undefined")
      return
    }
    if (app.houseList.length < 1) {
      console.log("请先添加一个房间")
      return
    }
    queryGateWaryByHouseId(app.houseList[0].id,
      (data) => {
        app.gatewayList = data.gatewayList
        console.log("queryGateWaryByHouseId result ->" + data)
      }, (error) => {
        console.log("error->" + error.status.code + " - " + error.status.message)
      })
  },

  bindHouseList: function () {
    if (!app.houseList) {
      return []
    }
    let houseNameList = []
    for (let index = 0; index < app.houseList.length; index++) {
      const houseInfo = app.houseList[index];
      houseNameList.push(houseInfo.name)
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

})