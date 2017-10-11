export default {
  getDeviceData (context) {
    $.get('/api/devicePublicData/list', '', function (data) {
      debugger
    })
  }
}
