"use strict";

import getUserDeviceInfo from './device-status-controller/getUserDeviceInfo'
import wechatLogin from './account-controller/wechatLogin'
import queryHouseByUser from './device-status-controller/queryHouseByUser'
import houseQueryAll from './device-status-controller/houseQueryAll'
import roomQueryAll from './device-status-controller/roomQueryAll'
import gatewayQueryAll from './device-status-controller/gatewayQueryAll'
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
}


/**
 * 小程序用户登录逻辑
 * 如果用户登录，每个接口都会返回一个token字段，如果没登录则不返回
 */
// 通过wx.login获取code，换取自定义登录态
function wxLogin(loginSuccessCallBack) {
  const loginException = ()=>{ wx.showToast({title: '用户登录异常', icon: 'error', duration: 2000}) }
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
            loginSuccessCallBack();
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
 * 公共请求接口。统一处理登录态校验，用户登录，等逻辑。
 */
export default function commonRequestFunction(requestUrl,params, successCallback, failCallback){
  wxLogin(()=>{
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
  })
}












