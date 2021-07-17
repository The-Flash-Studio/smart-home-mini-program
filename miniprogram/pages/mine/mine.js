import wxLogin from "../../api/index"

import {addDevice} from "../../api/index"
Page({
  tapName(event){
    addDevice((dataSuccess)=>{
      console.log('dataSuccess: ', dataSuccess);

    },(failData)=>{
      console.log('failData: ', failData);

    })
  }
})