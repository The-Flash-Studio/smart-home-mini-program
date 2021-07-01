// miniprogram/pages/scene/scene.js
var app = getApp();
import {
  getAllConfigScenes
} from '../../api/scene'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sceneTypeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    const _this = this;
    wx.login({
      success: function(res) {
        const openid = res.code;
        app.openid = openid;
        getAllConfigScenes(openid).then(e => {
          _this.setData(e)
          console.log(e.sceneTypeList);
        })
      }
    });

  },

  gotoSceneDetail: function(e) {
    console.log("---------------------asdfasdfasdfsdf")
    // wx.navigateTo({
    //   url: "pages/index/index"
    // })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})