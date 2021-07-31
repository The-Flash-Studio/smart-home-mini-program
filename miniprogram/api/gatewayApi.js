"use strict";
import commonRequestFunction from "./index"

/**
 * prepare收到消息后，添加设备 - 未测试
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function addDevice(params,successCallback, failCallback) {
  commonRequestFunction('smart-iot/gateway/addDevice',params, successCallback, failCallback)
}
/**
 * 进入准备配对状态，socket接收消息
 * 
 * @param {*} params 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function prepareDevice(params, successCallback, failCallback) {
  commonRequestFunction('smart-iot/gateway/openDevicePairing', params, successCallback, failCallback)
}
export function openDevicePairing(params, successCallback, failCallback) {
  commonRequestFunction('smart-iot//gateway/openDevicePairing', params, successCallback, failCallback)
}



/**
 * 删除网关
 * @param {*} gatewayId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function removeGateway(gatewayId, successCallback, failCallback) {
  commonRequestFunction('smart-iot/gateway/remove', { gatewayId }, successCallback, failCallback)
}
/**
 * 查询房子的网关列表
 * @param {*} houseId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function queryGateWaryByHouseId(houseId, successCallback, failCallback) {
  commonRequestFunction('smart-iot/gateway/queryGatewaysByHouseId', { id:houseId }, successCallback, failCallback)
}

/**
 * 根据Id查询指定网关信息
 * @param {*} gatewayId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function queryGatewayById(gatewayId, successCallback, failCallback) {
  commonRequestFunction('smart-iot/gateway/findById', { gatewayId }, successCallback, failCallback)
}
/**
 * 添加网关
 * @param {*} requestObj 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function addGateWay(requestObj = {}, successCallback, failCallback) {
  commonRequestFunction('smart-iot/gateway/addGateway', requestObj, successCallback, failCallback)
}

/**
 * 查询网关下设备列表
 * @param {*} id 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function queryDevicesByGatewayId(id, successCallback, failCallback) {
  commonRequestFunction('smart-iot/gateway/queryDevicesByGatewayId', { id: 30 }, successCallback, failCallback)
}

/**
 * 发送控制命令进行控制设备
 * @param {*} requestObj 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function sendCommand(requestObj = {}, successCallback, failCallback) {
  console.log("sendCommand-> " + requestObj)
  commonRequestFunction('smart-iot/gateway/sendCommand', requestObj, successCallback, failCallback)
}

export default {
  addGateWay,
  prepareDevice,
  addDevice,
  queryGatewayById,
  queryGateWaryByHouseId,
  removeGateway,
  queryDevicesByGatewayId,
  sendCommand,
}
