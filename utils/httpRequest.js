/**
 * 请求头
 */
var header = {
  'content-type': 'application/json',
  'token': wx.getStorageSync("token"),
  'client': 'wx'
}
var Token = '';
let baseUrl = 'http://47.114.112.229:90'
/**
 * 供外部post请求调用
 */
function post(url, params) {
  return request(url, params, "POST");

}

/**
 * 供外部get请求调用
 */
function get(url, params) {
  return request(url, params, "GET");
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onSuccess 成功回调
 * @onFailed  失败回调
 */

function request(url, params, method) {
  wx.showLoading({
    title: "正在加载中...",
  });
  // return getLogin().then(res => {
    return new Promise((resolve, reject) => {
      console.log(header)
      if(!header.token){
        header.token = wx.getStorageSync("token")
      }
      wx.request({
        url: baseUrl + url,
        data: dealParams(params),
        method: method,
        header: header,
        success: function (res) {
          wx.hideLoading();
          if (res.data) {
            /** start 根据需求 接口的返回状态码进行处理 */
            if (res.statusCode == 200) {
              resolve(res); //request success
            } else {
              reject(res); //request failed
            }
            /** end 处理结束*/
          }
        },
        fail: function (error) {
          wx.hideLoading();
          reject(error); //failure for other reasons
        }
      })
    });
  // })

}
function getLogin() {
  return new Promise((resolve, reject) => {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: baseUrl+'/login/wx',
            method: 'POST',
            data: {
              code: res.code
            },
            success: function (_res) {
              const data = _res.data.data;
              Token = data.token
              wx.setStorageSync('token', data.token)
              wx.setStorageSync('openid', data.userNo)
              if (data.userId.includes('temp_user_')) { // 未注册用户
                // 跳转注册信息页进行绑定
                // wx.navigateTo({
                //   url: '/pages/userBind/userBind',
                // })
              } else { // 已注册用户
                // 将用户信息存储到本地
                wx.request({
                  url: baseUrl + `/base/consumer/info/${data.userNo}`,
                  header: {
                    'content-type': 'application/json',
                    'token': data.token,
                    'client': 'wx'
                  },
                  success: function (__res) {
                    if (__res.data) {
                      /** start 根据需求 接口的返回状态码进行处理 */
                      if (__res.statusCode == 200) {
                        wx.setStorageSync('userInfo', __res.data.data);
                        resolve(true);
                      }
                      reject({
                        statusCode: 404,
                        msg: 'no userInfo'
                      });
                    }
                  }
                })
              }
            },
            error() {
              reject({
                statusCode: 403,
                msg: 'no login'
              });
            }
          })
        }
      }
    })
  });
}
/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
  return params;
}

function init() {
  return getLogin();
}
// 1.通过module.exports方式提供给外部调用
module.exports = {
  sendPost: post,
  sendGet: get,
  init
}