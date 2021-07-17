"use strict";
// import baseUrl from './config'
let baseUrl = 'http://10.32.33.151:5388/'
let app = getApp();
import commonRequestFunction from "./index"


/**
 * 删除房子
 * @param {*} houseId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function removeHouse(houseId, successCallback, failCallback) {
  commonRequestFunction('smart-iot/house/remove', { houseId }, successCallback, failCallback)
}
/**
 * 查询用户所有房子列表
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function queryHouseByUser(successCallback, failCallback) {
  commonRequestFunction('smart-iot/house/queryHouseByUser', {}, successCallback, failCallback)
}
/**
 * 根据ID查询指定房子信息  - 未测试
 * 
 * @param {*} houseId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function getHouseByHouseId(houseId, successCallback, failCallback) {
  commonRequestFunction('smart-iot/house/findById', { houseId }, successCallback, failCallback)
}
/**
 * 添加房子
 * @param {*} requestObj 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function addHouse(requestObj = {}, successCallback, failCallback) {
  commonRequestFunction('smart-iot/house/addHouse', requestObj, successCallback, failCallback)
}


export default {
  addHouse,
  removeHouse,
  getHouseByHouseId,
  queryHouseByUser,
}