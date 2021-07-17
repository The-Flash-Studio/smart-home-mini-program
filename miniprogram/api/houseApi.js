"use strict";
// import baseUrl from './config'
let baseUrl = 'http://10.32.33.151:5388/'
let app = getApp();

/**
 * 删除房子
 * @param {*} houseId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function removeHouse(houseId, successCallback, failCallback) {
  wx.request({
    url: baseUrl + 'smart-iot/house/remove',
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
 * 查询用户所有房子列表
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function queryHouseByUser(successCallback, failCallback) {
  wx.request({
    url: baseUrl + 'smart-iot/house/queryHouseByUser',
    header: { token: app.token },
    data: Object.assign({ head: {} }, {}),
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
 * 根据ID查询指定房子信息  - 未测试
 * 
 * @param {*} houseId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function getHouseByHouseId(houseId, successCallback, failCallback) {
  wx.request({
    url: baseUrl + 'smart-iot/house/findById',
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
 * 添加房子
 * @param {*} requestObj 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function addHouse(requestObj = {}, successCallback, failCallback) {
  console.log("addHouse-> " + requestObj)
  wx.request({
    url: baseUrl + 'smart-iot/house/addHouse',
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
  addHouse,
  removeHouse,
  getHouseByHouseId,
  queryHouseByUser,
}