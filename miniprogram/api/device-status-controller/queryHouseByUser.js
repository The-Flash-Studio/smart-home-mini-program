import baseUrl from '../config'

export default function queryHouseByUser(header={},requestObj={},successCallback,failCallback){
  wx.request({
    url: baseUrl+'smart-iot/house/queryHouseByUser',
    header,
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