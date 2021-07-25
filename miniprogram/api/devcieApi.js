"use strict";
// import baseUrl from './config'
import commonRequestFunction from './index'
let baseUrl = 'http://10.32.33.151:5388/'
let app = getApp();
/**
 * Device相关暂时无用，均使用gatewayApi、houseApi中接口
 * @param {*} deviceId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function deleteDeviceById(deviceId = -1, successCallback, failCallback) {
  console.log("deleteDeviceById-> " + requestObj)
  commonRequestFunction('smart-iot/device/remove', { deviceId }, successCallback, failCallback)
}

export function updateDeviceInfo(requestObj = {}, successCallback, failCallback) {
  console.log("updateDeviceInfo-> " + requestObj)
  commonRequestFunction('smart-iot/device/update', requestObj, successCallback, failCallback)
}

export function getAllDevicesByGateway(requestObj = {}, successCallback, failCallback) {
  console.log("getAllDevicesByGateway-> " + requestObj)
  commonRequestFunction('smart-iot/device/queryDevicesByGatewayId', requestObj, successCallback, failCallback)
}

export function getDeviceStatus(requestObj = {}, successCallback, failCallback) {
  console.log("getDeviceStatus-> " + requestObj)
  commonRequestFunction('smart-iot/device/findStatusByDeviceId', requestObj, successCallback, failCallback)
}

export function getDeviceById(requestObj = {}, successCallback, failCallback) {
  console.log("getDeviceById-> " + requestObj)
  commonRequestFunction('smart-iot/device/findById', requestObj, successCallback, failCallback)
}

export function findDevicesByRoomId(id=0,successCallback,failCallback){
  console.log("findDevicesByRoomId-> " + id)
  commonRequestFunction('smart-iot/device/findDevicesByRoomId', {id}, successCallback, failCallback)
}

/**
 * 测试用
 */
export function getAllMockDevices() {
  const res = {}
  res.sceneTypeList = [{
    name: '推荐场景',
    sceneList: [{
      name: "回家开灯",
      description: "回家自动开灯，打开空调",
      sceneType: 1,
      equipmentList: [
        {
          name: '智能空调',
          position: '客厅',
          img: '',
          linkType: 1
        },
        {
          name: 'LED灯泡',
          position: '客厅',
          img: '',
          linkType: 1
        },
      ]
    },
    {
      name: "我出门了",
      description: "关灯并打开扫地机，打开扫地机，关灯和窗帘，空调调至睡眠模式关",
      sceneType: 2,
      equipmentList: [
        {
          name: '智能空调',
          position: '客厅',
          img: '',
          linkType: 1
        },
        {
          name: 'LED灯泡',
          position: '客厅',
          img: '',
          linkType: 1
        },
      ]
    },
    {
      name: "晚安",
      description: "关灯和窗帘，空调调至睡眠模式关灯和窗帘",
      hasSet: true,
      sceneType: 3,
      equipmentList: [
        {
          name: '智能空调',
          position: '客厅',
          img: '',
          linkType: 1
        },
        {
          name: 'LED灯泡',
          position: '客厅',
          img: '',
          linkType: 1
        },
      ]
    },
    ]
  },
  {
    name: '更多玩法',
    sceneList: [{
      name: "碰碰贴的智能玩法",
      description: "一碰尽享智能联动",
      sceneType: 4,
    },
    ]
  },
  ]
  return Promise.resolve(res);
};

export default {
  getDeviceById,
  getDeviceStatus,
  getAllDevicesByGateway,
  getAllMockDevices,
}