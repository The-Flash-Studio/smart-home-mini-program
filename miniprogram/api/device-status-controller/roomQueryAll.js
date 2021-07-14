// 当前房子集合（用于测试）
import baseUrl from '../config'

export default function queryAll(successCallback,failCallback){
  wx.request({
    url: baseUrl+'smart-iot/room/queryAll',
    method:'post',
    success (data) {
      successCallback && successCallback(data)
    },
    fail(error) {
      failCallback && failCallback(error)
    }
  })
}