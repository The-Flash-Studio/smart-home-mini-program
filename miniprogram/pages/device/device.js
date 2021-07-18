const pageOptions = {
  data: {
    deviceName: "deviceName",
  },

  onTitleClose: function (event) {
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })
  },

  onTitleDelete: function (event) {
    console.log("onTitleDelete")
  },

}

Page(pageOptions)