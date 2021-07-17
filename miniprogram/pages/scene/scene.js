// miniprogram/pages/scene/scene.js
var app = getApp();
import {
  addGateWay, queryGateWaryByHouseId, queryGatewayById, removeGateway, prepareDevice, addDevice
} from '../../api/gatewayApi';
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
    sceneTypeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    const _this = this;

    let user_token = wx.getStorageSync('user_token');

    // 存在Token
    if (user_token) {
      app.token = user_token
      console.log('token from storage:', user_token)
      this.loginSuccessAction(user_token)
    }
    // 不存在Token
    else {

      // 获取用户信息
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
              data: _token
            })
            app.token = _token
            console.log('token From Server:', _token)
            _this.loginSuccessAction(_token)
          })
        }
      });
    }

  },

  loginSuccessAction: function (user_token) {
    getAllMockDevices(user_token).then(e => {
      this.setData(e)
    })
    wx.connectSocket({
      url: "ws://10.32.33.151:5388/smart-iot/webSocket/" + app.token
    })
    wx.onSocketOpen(function (res) {
      console.log("onSocketOpen " + res)
    })
    wx.onSocketMessage(function (res) {
      console.log("onSocketMessage " + res)
    })
    wx.onSocketError(function (res) {
      console.log("onSocketError " + res)
    })

    wx.onSocketClose(function (res) {
      console.log("onSocketClose " + res)
    })

    queryHouseByUser((data) => {
      const _this = this
      console.log(data.userId)
      app.userId = data.userId
      app.houseList = data.houseList
      _this.setData({
        houseList: data.houseList

      })
      console.log("queryHouseByUser userId ->" + app.userId)
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
    addDevice((data) => {
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
      url: "detail/detail?sceneName=" + sceneName + "&sceneType=" + sceneType + "&hasSet=" + hasSet
    })

  },

  executeScene: function (e) {
    console.log("executeScene")
    let sceneName = e.currentTarget.dataset.item.name
    let sceneType = e.currentTarget.dataset.item.sceneType
    let hasSet = e.currentTarget.dataset.item.hasSet == true
    wx.navigateTo({
      url: "detail/detail?sceneName=" + sceneName + "&sceneType=" + sceneType + "&hasSet=" + hasSet
    })

  },

  onTitleClose: function (event) {
    header.onTitleClose(event)
  },

  onTitleAdd: function (event) {
    console.log(app.houseList)
    if (app.houseList) {
      console.log("执行添加house")
      addHouse({
        'address': "长征路21号",
        'name': "新家",
        'userId': app.userId
      }, (data) => {
        console.log("doAddHouse result ->" + data)
      }, (error) => {
        console.log("error->" + error.status.code + " - " + error.status.message)
      })
    } else {
      console.log("未获取houseList")
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.socketTask.onClose((result) => {
      console.log("wx.closeSocket()")
    })
    wx.closeSocket()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})