// pages/person/person.js
Page({
  data: {
    name: "",
    idCard: "",
    phone: "",
    sex: "",
    hiddenModal: true,
    curEditType: ""
  },
  onShow() {
    // 从本地缓存取用户信息
    const userInfo = wx.getStorageSync("userInfo");
    if(userInfo){
      this.setData({
        name: userInfo.consumerName,
        idCard: userInfo.consumerNo.replace(/^(.{4})(?:\d+)(.{4})$/, '$1******$2'),
        phone: userInfo.consumerTel.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2'),
        sex: userInfo.consumerSex
      });
    }
    
  },
  inputChange(e) {
    switch (this.data.curEditType) {
      case "name":
        this.setData({
          name: e.detail.value
        });
        break;
      case "id":
        this.setData({
          idCard: e.detail.value
        });
        break;
      case "phone":
        this.setData({
          phone: e.detail.value
        });
        break;
      default:
        break;
    }
  },
  bindPersonInfo(e) {
    const type = e.currentTarget.dataset.type;
    switch (type) {
      case "name":
        this.setData({
          hiddenModal: false,
          curEditType: "name"
        });
        break;
      case "id":
        this.setData({
          hiddenModal: false,
          curEditType: "id"
        });
        break;
      case "phone":
        this.setData({
          hiddenModal: false,
          curEditType: "phone"
        });
        break;
      default:
        break;
    }
  },
  cancelM: function(e) {
    this.setData({
      hiddenModal: true
    });
  },
  confirmM: function(e) {
    console.log("姓名：" + this.data.name);
  },
  // 登录注册
  logon(){
    wx.navigateTo({
      url: '/pages/userBind/userBind',
    })
  }
});
