// index.js
// 获取应用实例
const app = getApp()
import {RoomService}from "../../api/room.js"
Page({
  data: {
    num:0,
  },
  onLoad() {
    // RoomService.getRoomStatus().then((res)=>{
      // let status1 = 0;
      // for (let x = 0; x < res.length; x++) {
      //     if (res[x].status == '1') {
      //         status1 = res[x].cnt;
      //     }
      // }
      // this.setData({
      //   num: status1,
      // })
    // }).catch(()=>{

    // })

  },

  go(e){
    let index = e.currentTarget.dataset['index'];
    if(index == 1){
      wx.navigateTo({
        url: '../checkIn/checkIn',
      })
    }
  }
})
