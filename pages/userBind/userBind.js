// const httpRequest = require('../../utils/httpRequest')
var api = getApp().req

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: ['男', '女', '其他'],
    index: 0,
    name: '',
    idCard: '',
    phone: ''
  },
  bindName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindIdCard(e) {
    this.setData({
      idCard: e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 用户绑定
  userBindHandle() {
    // 请求前需要校验 都为必填项
    if (this.data.name === '') {
      wx.showToast({
        title: '请输入姓名',
        icon:'',
      })
      return;
    } else if (this.data.idCard === '') {
      wx.showToast({
        title: '请输入身份证号码',
        icon:''
      })
      return
    }else if (this.data.phone === '') {
      wx.showToast({
        title: '请输入手机号',
        icon:''
      })
      return
    }

    let sex = this.data.gender[this.data.index];
    // 本地存储获取 openId
    const openId = wx.getStorageSync('openid');
    console.log(openId);
    const data = {
      openid: openId,
      consumer: {
        consumerNo: this.data.idCard,
        consumerName: this.data.name,
        consumerSex: sex,
        consumerMz: '',
        consumerDz: '',
        consumerTel: this.data.phone,
        consumerRemark: ''
      }
    }
    console.log('data :>> ', data);
    api.post('/base/consumer/bind/weixin', data).then(res => {
      if(res.data.status == 0){
        wx.showToast({
          title: '绑定成功',
        })
        wx.setStorageSync('userInfo', data.consumer);
      }
      // 绑定成功，跳转到首页
      if (res) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})