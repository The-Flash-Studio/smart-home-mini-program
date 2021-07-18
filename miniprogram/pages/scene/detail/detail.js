import header from '../templates/header'

const pageOptions = {
  // 页面数据
  data: {
    isFirstOnShow: true, // 是否为首次执行onShow
    sceneType: 0,
    sceneName: "",
    hasSet: false,
  },
  onTitleClose: function (event) {
    header.onTitleClose(event)
  }, 
  
  onTitleAdd: function (event) {
    header.onTitleAdd(event)
  },
  // 页面载入时
  onLoad(e) {
    this.init(e)
  },
  // 页面初始化
  init(e) {
    this.setData({
      sceneType: e.sceneType,
      sceneName: e.sceneName,
      hasSet: e.hasSet
    })
  },
  // 页面准备好时
  onReady() { },
  // 页面显示时
  onShow() {
    const { isFirstOnShow } = this.data

    if (isFirstOnShow) {
      // 首次执行时
      this.setData({
        isFirstOnShow: false,
      })
      return
    }
  },
}

Page(pageOptions)
