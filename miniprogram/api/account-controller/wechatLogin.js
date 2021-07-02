import baseUrl from '../config'

export default function wechatLogin(requestObj={},successCallback,failCallback){
  wx.request({
    url: baseUrl+'simple-account/account/wechatLogin',
    data: Object.assign({head:{}},requestObj),
    method:'post',
    success (data) {
      successCallback && successCallback(data)
    },
    fail(error) {
      failCallback && failCallback(error)
    }
  })
}