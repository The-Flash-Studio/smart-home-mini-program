"use strict";
// import baseUrl from './config'
let baseUrl = 'http://10.32.33.151:5388/'
let app = getApp();
import commonRequestFunction from "./index"


/**
 * 删除房间
 * @param {*} roomId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function removeRoom(roomId, successCallback, failCallback) {
  commonRequestFunction('smart-iot/room/remove', { id:roomId }, successCallback, failCallback)
}

export function addHouseOwner(houseId, successCallback, failCallback) {
  commonRequestFunction('smart-iot/house/addHouseOwner', { id:houseId }, successCallback, failCallback)
}


/**
 * 根据roomID查询指定房间
 * 
 * @param {*} roomId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function getRoomByRoomId(roomId, successCallback, failCallback) {
  commonRequestFunction('smart-iot/room/findById', { id:roomId }, successCallback, failCallback)
}

/**
 * 根据houseID查询房间
 * 
 * @param {*} houseId 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function queryRoomsByHouseId(houseId, successCallback, failCallback) {
  commonRequestFunction('smart-iot/room/queryRoomsByHouseId', { id:houseId }, successCallback, failCallback)
}

/**
 * 添加房间
 * @param {*} requestObj 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function addRoom(requestObj = {}, successCallback, failCallback) {
  commonRequestFunction('smart-iot/room/addRoom', requestObj, successCallback, failCallback)
}

/**
 * 修改房间
 * @param {*} requestObj 
 * @param {*} successCallback 
 * @param {*} failCallback 
 */
export function updateRoom(requestObj = {}, successCallback, failCallback) {
  commonRequestFunction('smart-iot/room/update', requestObj, successCallback, failCallback)
}

export default {
  addRoom,
  removeRoom,
  getRoomByRoomId,
  queryRoomsByHouseId,
  updateRoom,
}