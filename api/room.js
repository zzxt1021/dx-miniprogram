var httpRequest = require("../utils/httpRequest");

export const RoomService = {
  //房间状态数量
  getRoomStatus(){
    return httpRequest.sendGet('/base/room/status');
  },
}

module.exports = {
  RoomService
}