// 根据房间ID获取设备信息
import baseUrl from '../config'

export default function findDevicesByRoomId(id=0,successCallback,failCallback){
  wx.request({
    url: baseUrl+'smart-iot/device/findDevicesByRoomId',
    data:Object.assign({head:{}},{params:{id}}),
    method:'post',
    success (data) {
      successCallback && successCallback(data)
    },
    fail(error) {
      failCallback && failCallback(error)
    }
  })
}