/**
 * 请求头
 */
var header = {
  'content-type': 'application/json',
  'token': wx.getStorageSync("token"),
}

/**
 * 供外部post请求调用
 */
function post(url, params){
  console.log("请求方式：", "POST")
  request(url, params, "POST");

}

/**
 * 供外部get请求调用
 */
function get (url, params){
  console.log("请求方式：", "GET")
  request(url, params, "GET");
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
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://47.114.112.229:90'+url,
      data: dealParams(params),
      method: method,
      header: header,
      success: function(res) {
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
      fail: function(error) {
        reject(error); //failure for other reasons
      }
    })
  })
  
}

/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
  console.log("请求参数:", params)
  return params;
}


// 1.通过module.exports方式提供给外部调用
module.exports = {
  sendPost: post,
  sendGet: get,
}