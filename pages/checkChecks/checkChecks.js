// pages/checkChecks/checkChecks.js
var api = getApp().req;
Page({
  data: {
    orderInfo: {},
    consumerInfo: {},
    totalMoney: 0
  },
  // 支付订单
  payOrder() {
    const contractId = this.data.orderInfo.contract.contractId;
    const data = {
      contractId: contractId
    };
    api.post("/room/contract/checkin", data).then(res => {
      // 入住办理成功，跳转回首页
      // 将订单号和拿到的密码存储到缓存
      // 判断缓存中是否有存储的地方，有，取出，push进去；没有创建，push, set进去
      // const orderPwdObj = {
      //   orderId: contractId,
      //   pwd: res.data.lockPassword
      // }
      // if (wx.getStorageSync('orderPwd')) { // 有
      //   wx.setStorageSync('orderPwd', wx.getStorageSync('orderPwd').push(orderPwdObj))
      // } else { // 没有
      //   let orderPwd = [];
      //   orderPwd.push(orderPwdObj);
      //   wx.setStorageSync('orderPwd', orderPwd);
      // }
      console.log(res);
      if (res.data.status == 0) {
        wx.showToast({
          title: '入住办理成功！',
          icon:'none'
        })
        wx.navigateBack({
          delta: 1,
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    });
  },
  onShow: function () {
    const order = wx.getStorageSync("order");
    console.log(order);
    const consumerInfo = wx.getStorageSync("consumerInfo");
    this.setData({
      orderInfo: order,
      consumerInfo: consumerInfo,
      totalMoney: order.contract.paid +order.contract.deposit
    });
  }
});