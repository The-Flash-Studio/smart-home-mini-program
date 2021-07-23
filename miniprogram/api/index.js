"use strict";

import getUserDeviceInfo from './device-status-controller/getUserDeviceInfo'
import wechatLogin from './account-controller/wechatLogin'
import queryHouseByUser from './device-status-controller/queryHouseByUser'
import houseQueryAll from './device-status-controller/houseQueryAll'
import roomQueryAll from './device-status-controller/roomQueryAll'
import gatewayQueryAll from './device-status-controller/gatewayQueryAll'
import queryRoomsByHouseId from './device-status-controller/queryRoomsByHouseId'
import findDevicesByRoomId from './device-status-controller/findDevicesByRoomId'

import baseUrl from "./config";
const TOKEN_NAME = "__token__";
const CUSTOM_INTERNAL_ERROR_CODE = -999;

export {
  getUserDeviceInfo,
  wechatLogin,
  queryHouseByUser,
  houseQueryAll,             //当前房子集合（用于测试）
  roomQueryAll,              //当前房间集合（用于测试）
  gatewayQueryAll,           //当前网关组（用于测试）
  queryRoomsByHouseId,       //根据房子ID获取所属所有房间信息
  findDevicesByRoomId,       //根据房间ID获取设备信息
  isLoginCheck
}


/**
 * 小程序用户体系时序图 https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html 
 * 小程序用户登录逻辑 
 * 通过wx.login获取code，换取自定义登录态
 */
function wxLogin(loginSuccessCallBack) {
  const loginException = () => { wx.showToast({ title: '用户登录异常', icon: 'error', duration: 2000 }) }
  wx.login({
    success: function (res) {
      const userCode = res.code;
      wx.request({  // 调用业务接口换取自定义token
        url: baseUrl + 'simple-account/account/wechatLogin',
        data: { params: {"code":userCode} },
        method: 'post',
        success(data) {
          const token = data?.data?.data?.token || '';
          if(token) {
            wx.setStorageSync(TOKEN_NAME, token)
            loginSuccessCallBack(true, token);
          }else loginException();
        },
        fail(error) {
          console.log('error: ', error);
          loginException();
        }
      })
    }
  });
}

/**
 * 微信验证是否登录
 */

function isLoginCheck(logicFunction) {
  const token = wx.getStorageSync(TOKEN_NAME);
  if(!token) {
    wxLogin(logicFunction)
    return
  }
  wx.request({
    url: baseUrl + 'simple-account/account/assertWechatLogin',
    header: { token: token },
    data: { params: {} },
    method: 'post',
    success(data) {
      const isLogin = data?.data?.data?.login || false;
      if(isLogin) logicFunction(true, token);
      else wxLogin(logicFunction);
    },
    fail(error) {
      wx.showToast({ title: '检查登录逻辑异常', icon: 'error', duration: 2000 })
    }
  })
}



/**
 * 公共请求接口。统一处理登录态校验，用户登录，等逻辑。
 */
export default function commonRequestFunction(requestUrl, params, successCallback, failCallback) {
  const logicFunction = function() {
    const token = wx.getStorageSync(TOKEN_NAME);
    wx.request({
      url: baseUrl + requestUrl,
      header: { token: token },
      data: { params: params },
      method: 'post',
      success(data) {
        const responseCode = data?.data?.status?.code || CUSTOM_INTERNAL_ERROR_CODE;
        const responseData = data?.data?.data || {};
        console.log('responseData: ', responseData);
        if (responseCode == 200) {
          successCallback && successCallback(responseData)
        } else {
          failCallback && failCallback(data.data)
        }
      },
      fail(error) {
        failCallback && failCallback(error)
      }
    })
  }
  isLoginCheck(logicFunction);
}



