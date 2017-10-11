export default {
  getDeviceData (context) {
    $.get('/api/devicePublicData/list', '', function (publicData) {
      var devicePublicData = publicData.collection

      $.get('/api/devicePrivateData/list', '', function (privateData) {
        var devicePrivateData = privateData.collection

        debugger
/*
        // Loop through all the priate models and match them up with public models.
        for(var i=0; i < devicePrivateData.length; i++) {
          var publicId = devicePrivateData[i].
        }
*/
        // Combine data into a single object

        // Add data to the store.

        // Commit the store.

        devicePublicData.test = 1
        devicePrivateData.test = 1
      })
    })
  }
}
