var app = getApp();
Page({
  data: {
  },
  onTitleClose: function (event) {

    wx.navigateBack({
      delta: 1,
      success: function (res) {
        
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },
  onTitleDelete: function (event) {
    console.log("onTitleAdd onTitleDelete")
  },
})