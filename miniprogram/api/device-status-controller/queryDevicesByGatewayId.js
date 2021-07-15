import baseUrl from '../config'

export default function queryDevicesByGatewayId(requestObj={},successCallback,failCallback){
  wx.request({
    url: baseUrl+'smart-iot/device/queryDevicesByGatewayId',
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