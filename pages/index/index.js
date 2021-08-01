// index.js
var api = getApp().req;

Page({
  data: {
    num: 0,
    back: false,
    loading: true,
    orderList: [],
    initLogin:false,//请先登录
  },
  onShow() {
    let userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo);
    if(userInfo.consumerTel){
      this.setData({
        initLogin:false
      })
    }else{
      this.setData({
        initLogin:true
      })
    }
    let timer = null;
    //this.getSurplusNum();
    let jss = 0
    timer = setInterval(() => {
      if (getApp().initStatus) {
        clearInterval(timer);
        this.queryOrderList();
        this.getSurplusNum();
        this.setData({
          loading: false,
        });
      }else{
        console.log(getApp().initStatus)
        jss++;
        if(jss == 5){
          clearInterval(timer);
        }
      }
    }, 1000);
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }
  },
  // 获取周几
  getWeek(date) {
    let time = new Date(date);
    let day = time.getDay();
    let weeks = new Array(
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六"
    );
    let week = weeks[day];
    return week;
  },
  // 获取几月几日，例：3月14日
  getMonthAndDay(date) {
    let curDate = date.split("-");
    return `${curDate[1]}月${curDate[2]}日`;
  },
  // 跳转到入住页面
  skipCheckIn(e) {
    const order = e.target.dataset.order;
    const weekStart = this.getWeek(order.contract.reserveStartDate);
    const weekEnd = this.getWeek(order.contract.reserveEndDate);
    wx.setStorageSync("order", order);
    wx.setStorageSync("consumerInfo", order.consumerList[0]);
    wx.navigateTo({
      url: "/pages/checkChecks/checkChecks"
    });
  },
  // 退房处理
  backRoomHandle(e) {
    wx.showModal({
      title: "退房",
      content: "您确定退房吗？",
      success: (res) => {
        if (res.confirm) {
          // 获取当前订单 id
          const contractId = e.target.dataset.order.contract.contractId;
          const data = {
            contractId: contractId
          };
          api.post(`/room/contract/checkout`, data).then(res => {
            if (res.data.status == 0) {
              wx.showToast({
                title: '退房成功！',
                icon:'none'
              })
              this.queryOrderList();
            }
          });
        } else if (res.cancel) {
          
        }
      }
    });
  },
  skipPage(e) {
    let index = e.currentTarget.dataset["index"];
    if (index == 1) { // 待开发功能
      wx.showToast({
        title: '功能开发中...',
        icon:'none'
      })
      // wx.showModal({
      //   content: '功能待开发中......',
      //   showCancel: false
      // })
    } else if (index == 2) { // 跳转预订页面
      wx.navigateTo({
        url: "/pages/book/book"
      });
    }
  },
  // 获取剩余房间数
  getSurplusNum(){
    api.get(`/base/room/status`).then(res => {
      for (let x = 0; x < res.data.length; x++) {
        if (res.data[x].status == '1') {
            this.setData({
              num:res.data[x].cnt
            })
        }
    }
    });
  },
  // 获取订单列表
  queryOrderList() {
    wx.getStorage({
      key: "userInfo",
      success: res => {
        const data = {
          page: {
            curPage: 1,
            pageSize: 10
          },
          contract: {
            reserveStartDate:
              new Date().toLocaleDateString().replace(/\//g, "-") + " 00:00:00"
          },
          consumer: {
            consumerNo: res.data.consumerNo
          }
        };
        api.post("/room/contract/list", data).then(
          res => {
            let dataList = res.data.dataList;
            if(dataList && dataList.length) {
              for (let index = 0; index < dataList.length; index++) {
                const element = dataList[index];
                element.contract.totalDays = Math.floor(
                  (new Date(element.contract.reserveEndDate) -
                    new Date(
                      element.contract.reserveStartDate
                    )) /
                    (1000 * 3600 * 24)
                )==0?1:Math.floor(
                  (new Date(element.contract.reserveEndDate) -
                    new Date(
                      element.contract.reserveStartDate
                    )) /
                    (1000 * 3600 * 24)
                );
                // element.contract.reserveStartDate = element
                //   .contract.reserveStartDate
                //   ? element.contract.reserveStartDate.split(" ")[0]
                //   : element.contract.reserveStartDate;
                // element.contract.reserveEndDate = element
                //   .contract.reserveEndDate
                //   ? element.contract.reserveEndDate.split(" ")[0]
                //   : element.contract.reserveEndDate;
              }
            }
            
            // 列表数据赋值
            this.setData({
              orderList: dataList
            });
          },
          reject => {
            console.log(reject);
          }
        );
      },
      fail:err=>{
        console.log('失败');
        console.log(err);
      }
    });
  },
  // 截取日期
  subStringDate(str) {
    return str.split(" ")[0];
  },
  // 取消订单
  cancelsCheckIn(e){
    const d = e.target.dataset.order;
    wx.showModal({
      title: "取消入住",
      content: "您确定取消入住吗？",
      success: () => {
        api.post("/room/contract/edit", {
          contract: {
            contractId: d.contract.contractId,
            contractState: 5,
            reserveEndDate: d.contract.reserveEndDate,
            reserveStartDate: d.contract.reserveStartDate,
            roomId: d.roomDto.roomId
          }
        }).then((res)=>{
          if (res.data.status == 0) {
            wx.showToast({
              title: '订单取消成功！',
            })
            this.queryOrderList();
          }
        })
      }
    })
  },
});
