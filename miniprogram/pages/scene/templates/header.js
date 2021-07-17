var app = getApp();
var header = {
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
  onTitleAdd: function (event) {
    console.log("onTitleAdd success")
  }
}

export default header