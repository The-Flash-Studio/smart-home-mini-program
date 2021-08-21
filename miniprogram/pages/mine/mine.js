const USER_INFO = "__userinfo__"
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

import { addHouseOwner } from '../../api/roomApi'


Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  onLoad() {
    const userInfo = wx.getStorageSync(USER_INFO);
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo),
        hasUserInfo: true
      })
    } else {
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true
        })
      }
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync(USER_INFO, JSON.stringify(res.userInfo));
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindHouse() {
    wx.scanCode({
      success(houseId) {
        addHouseOwner(houseId,()=>{
          Toast.success(`添加成功`);          
        },()=>{
          Toast.fail('关联网关失败');
        })    
      },
      fail:(error)=>{
        Toast.fail(error);
      }
    })
  }
})
