
var app = getApp();
import drawQrcode from "../../miniprogram_npm/weapp-qrcode/index"

Page({
  data: {
    isPrepareDevice: true,
    nickName: "",
    deviceId:'',
    roomId:'',
  },
  onLoad(options) {
    let { houseId } = options;
    drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'myQrcode',
        text: houseId,
    })
  },
})
