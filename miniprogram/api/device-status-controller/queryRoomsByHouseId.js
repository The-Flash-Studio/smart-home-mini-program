// 根据房子ID获取所属所有房间信息
import baseUrl from '../config'

export default function queryRoomsByHouseId(id=0,successCallback,failCallback){
  wx.request({
    url: baseUrl+'smart-iot/room/queryRoomsByHouseId',
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