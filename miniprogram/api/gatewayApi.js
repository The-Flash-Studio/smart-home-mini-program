"use strict";
// import baseUrl from './config'
let baseUrl = 'http://10.32.33.151:5388/'
let app = getApp();

/**
 * prepare收到消息后，添加设备 - 未测试
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
 export function addDevice(successCallback, failCallback) {
  wx.request({
    url: baseUrl + 'smart-iot/gateway/addDevice',
    header: { token: app.token },
    data: { params: {} },
    method: 'post',
    success(data) {
      console.log(data)
      if (data.data.status.code == 200) {
        successCallback && successCallback(data.data.data)
      } else {
        failCallback && failCallback(data.data)
      }
    },
    fail(error) {
      console.log(error)
      failCallback && failCallback(error)
    }
  })
}
/**
 * 进入准备配对状态，socket接收消息
 * 
 * @param {*} params 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function prepareDevice(params, successCallback, failCallback) {
  wx.request({
    url: baseUrl + 'smart-iot/gateway/openDevicePairing',
    header: { token: app.token },
    data: { params: params },
    method: 'post',
    success(data) {
      console.log(data)
      if (data.data.status.code == 200) {
        successCallback && successCallback(data.data.data)
      } else {
        failCallback && failCallback(data.data)
      }
    },
    fail(error) {
      console.log(error)
      failCallback && failCallback(error)
    }
  })
}
/**
 * 删除网关
 * @param {*} gatewayId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function removeGateway(gatewayId, successCallback, failCallback) {
  wx.request({
    url: baseUrl + 'smart-iot/gateway/remove',
    header: { token: app.token },
    data: { params: gatewayId },
    method: 'post',
    success(data) {
      console.log(data)
      if (data.data.status.code == 200) {
        successCallback && successCallback(data.data.data)
      } else {
        failCallback && failCallback(data.data)
      }
    },
    fail(error) {
      console.log(error)
      failCallback && failCallback(error)
    }
  })
}
/**
 * 查询房子的网关列表
 * @param {*} houseId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function queryGateWaryByHouseId(houseId, successCallback, failCallback) {
  wx.request({
    url: baseUrl + 'smart-iot/gateway/queryGatewaysByHouseId',
    header: { token: app.token },
    data: { params: houseId },
    method: 'post',
    success(data) {
      console.log(data)
      if (data.data.status.code == 200) {
        successCallback && successCallback(data.data.data)
      } else {
        failCallback && failCallback(data.data)
      }
    },
    fail(error) {
      console.log(error)
      failCallback && failCallback(error)
    }
  })
}

/**
 * 根据Id查询指定网关信息
 * @param {*} gatewayId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function queryGatewayById(gatewayId, successCallback, failCallback) {
  wx.request({
    url: baseUrl + 'smart-iot/gateway/findById',
    header: { token: app.token },
    data: { params: gatewayId },
    method: 'post',
    success(data) {
      console.log(data)
      if (data.data.status.code == 200) {

        successCallback && successCallback(data.data.data)
      } else {
        failCallback && failCallback(data.data)
      }
    },
    fail(error) {
      console.log(error)
      failCallback && failCallback(error)
    }
  })
}
/**
 * 添加网关
 * @param {*} requestObj 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function addGateWay(requestObj = {}, successCallback, failCallback) {
  wx.request({
    url: baseUrl + 'smart-iot/gateway/addGateway',
    header: { token: app.token },
    data: { params: requestObj },
    method: 'post',
    success(data) {
      console.log(data)
      if (data.data.status.code == 200) {

        successCallback && successCallback(data.data.data)
      } else {
        failCallback && failCallback(data.data)
      }
    },
    fail(error) {
      console.log(error)
      failCallback && failCallback(error)
    }
  })
}

export default {
  addGateWay,
  prepareDevice,
  addDevice,
  queryGatewayById,
  queryGateWaryByHouseId,
  removeGateway,
}