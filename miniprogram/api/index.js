"use strict";

import getUserDeviceInfo from './device-status-controller/getUserDeviceInfo'
import wechatLogin from './account-controller/wechatLogin'
import queryHouseByUser from './device-status-controller/queryHouseByUser'
import houseQueryAll from './device-status-controller/houseQueryAll'
import roomQueryAll from './device-status-controller/roomQueryAll'
import gatewayQueryAll from './device-status-controller/gatewayQueryAll'

export {
  getUserDeviceInfo,
  wechatLogin,
  queryHouseByUser,
  houseQueryAll,             //当前房子集合（用于测试）
  roomQueryAll,              //当前房间集合（用于测试）
  gatewayQueryAll,           //当前网关组（用于测试）
}