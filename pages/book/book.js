// pages/book/book.js
var api = getApp().req;
const formatTime = require("../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkInDate: "2021-03-14",
    checkInTime: "00:00",
    leaveDate: "",
    leaveTime: "15:00",
    gender: ["男", "女", "其他"],
    index: 0,
    name: "",
    idCard: "",
    phone: "",
    remark: "",
    nowDate: "",
    bfitems: [{ name: '包房', value: 1 }, { name: '不包房', value: 2 }],
    contractType: '2',//2-床，1-房
    roomList: [],//房间类型数据,
    roomType: '20-01',// 房间类型
    publicName: '',//团队名称
    moneyData: {},//押金房费等信息
    paid: 0,//房费
    deposit: 0,//押金
    days: 0,//住几天
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //getApp().setWatcher(this); // 设置监听器
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = wx.getStorageSync("userInfo");
    let genderIndex = 0;
    for (let index = 0; index < this.data.gender.length; index++) {
      const item = this.data.gender[index];
      if (item === userInfo.consumerSex) {
        genderIndex = index;
      }
    }
    // 当前登录用户可预约
    // if(!userInfo || JSON.stringify(userInfo) == '{}'){
    //   wx.showToast({
    //     title: '请先登录',
    //     icon:'none'
    //   })
    //   setTimeout(()=>{
    //     wx.navigateBack({
    //       delta:1
    //     })
    //   },1500)
    // }
    this.getRoomType();
    let curDate = this.formatTime(new Date());
    this.setData({
      name: userInfo.consumerName,
      idCard: userInfo.consumerNo,
      phone: userInfo.consumerTel,
      index: genderIndex,
      checkInDate: curDate,
      leaveDate: curDate,
      nowDate: curDate
    });
  },
  // 入住时间选择
  bindCheckInDateChange(e) {
    this.setData({
      checkInDate: e.detail.value
    });
    this.showMoney();
  },
  bindCheckInTimeChange(e) {
    this.setData({
      checkInTime: e.detail.value
    });
  },
  // 离开时间选择
  bindLeaveDateChange(e) {
    this.setData({
      leaveDate: e.detail.value
    });
    this.showMoney();
  },
  bindLeaveTimeChange(e) {
    this.setData({
      leaveTime: e.detail.value
    });
  },
  //显示押金，房租
  showMoney(){
    let m1 = 0,m2=0,priceList = this.data.moneyData.priceList;
    for(let x=0;x<priceList.length;x++){
      if(this.data.contractType == 1&&priceList[x].type=='r'){
        m1=priceList[x].price;
        m2 = priceList[x].deposit;
      }else if(this.data.contractType == 2&&priceList[x].type=='b'){
        m1=priceList[x].price;
        m2 = priceList[x].deposit;
      }
    }
    let dateDiff = new Date(this.data.leaveDate).getTime() - new Date(this.data.checkInDate).getTime();
    let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
    if(dayDiff == 0){
      dayDiff = 1;
    }
    this.setData({
      deposit:m2,
      paid:m1*dayDiff
    })
    
  },
  // 性别选择
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    });
  },
  bindRemark(e) {
    this.setData({
      remark: e.detail.value
    });
  },
  bindPublice() {
    this.setData({
      publicName: e.detail.value
    })
  },
  // 房间类型
  getRoomType() {
    api.get("/system/code/20").then(res => {
      this.setData({ roomList: res.data.reverse() });
      this.setData({ moneyData: JSON.parse(res.data[1].value) });
      this.showMoney()
    });
  },
  // 预约登记
  subscribeHandle() {
    // 校验必填
    // 组装参数
    const openId = wx.getStorageSync("openid");
    const data = {
      openid: openId,
      contract: {
        contractState: "2", // 订单状态，2是预订
        contractType: this.data.contractType,
        roomCode: this.data.roomType, // roomCode房间类型[20-01标准间,20-02大床房]
        reserveStartDate:
          this.data.checkInDate + " " + this.data.checkInTime + ":00",
        reserveEndDate: this.data.leaveDate + " " + this.data.leaveTime + ":00",
        remark: this.data.remark, // 备注
        publicName: this.data.publicName,
        paid: this.data.paid,
        deposit: this.data.deposit
      },
      consumerList: [] // 微信端暂不支持
    };
    // 调接口
    api.post("/room/contract/add", data).then(res => {
      if (res.statusCode === 200) {
        wx.showToast({
          title: '预定成功！',
          icon:'none'
        })
        wx.navigateBack({
          delta: 1
        })
      }
    });
  },

  formatTime(date) {
    const year = date.getFullYear();
    const month =
      date.getMonth() + 1 > 10
        ? date.getMonth() + 1
        : `0${date.getMonth() + 1}`;
    const day = date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`;
    return `${year}-${month}-${day}`;
  },
  // 选择是否包房
  radioChange(e) {
    this.setData({ contractType: e.detail.value });
    this.showMoney();
  },
  // 房间类型选择
  rtypeChange(e) {
    console.log(e);
    this.setData({ roomType: e.detail.value });
    if(this.data.roomType =='20-02'){
      this.setData({
        contractType:1
      })
    }else {
      this.setData({
        contractType:2
      })
    }
    for (let x = 0; x < this.data.roomList.length; x++) {
      if (this.data.roomList[x].code == this.data.roomType) {
        this.setData({ moneyData: JSON.parse(this.data.roomList[x].value) });
        this.showMoney();
      }
    }
  },
  
  
});
