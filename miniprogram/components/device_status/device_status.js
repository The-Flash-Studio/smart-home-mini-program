Component({
  /**
   * 组件的属性列表
   * {
   * attribute: null
   * attributeName: "Water"
   * cluster: "0x0500"
   * controlType: null
   * statusOrCommand: "status"
   * valueRange: " [{key:"0",val:"干燥"},{key:"1",val:"湿润"}]"
   * valueType: "list"
   * valueUnit: ""}
   */
  properties: {
    clusterAttribute:{
      type:"object",
      value:{}
    },
    deviceId:{
      type:"number",
      value:"设备号"
    },
    inOrOut:{
      type:"string",
      value:"输入输出"
    },
    endpoint:{
      type:"string",
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onItemClick() {
      console.log("onItemClick")
    },
  }
})