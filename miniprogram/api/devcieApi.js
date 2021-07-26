"use strict";

import commonRequestFunction from './index'
/**
 * Device相关暂时无用，均使用gatewayApi、houseApi中接口
 * @param {*} deviceId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function getDeviceInfo(id, successCallback, failCallback) {
  commonRequestFunction('smart-iot/device/findById', {
    id: id
  }, successCallback, failCallback)
}

export function findDevicesByRoomId(roomId, successCallback, failCallback) {
  commonRequestFunction('smart-iot/device/findDevicesByRoomId', {
    id: roomId
  }, successCallback, failCallback)
}

export function getDeviceStatus(id, successCallback, failCallback) {
  commonRequestFunction('smart-iot/device/findStatusByDeviceId', {
    id
  }, successCallback, failCallback)
}

export function getDeviceSupportAttribute(id, successCallback, failCallback) {
  commonRequestFunction('smart-iot/device/queryDeviceSupportAttributeById', {
    id
  }, successCallback, failCallback)
}

export function deleteDeviceById(deviceId = -1, successCallback, failCallback) {
  console.log("deleteDeviceById-> " + requestObj)
  commonRequestFunction('smart-iot/device/remove', {
    deviceId
  }, successCallback, failCallback)
}

export function updateDeviceInfo(requestObj = {}, successCallback, failCallback) {
  console.log("updateDeviceInfo-> " + requestObj)
  commonRequestFunction('smart-iot/device/update', requestObj, successCallback, failCallback)
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
          equipmentList: [{
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
          equipmentList: [{
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
          equipmentList: [{
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
      }, ]
    },
  ]
  return Promise.resolve(res);
};

export default {
  getDeviceInfo,
  findDevicesByRoomId,
  getDeviceStatus,
  getDeviceSupportAttribute,
  deleteDeviceById,
  updateDeviceInfo,
  getAllMockDevices,
}