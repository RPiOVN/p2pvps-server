export default {

  // getDeviceData retrieves device data from the server and populates the Vuex store
  // with the data.
  getDeviceData (context) {
    $.get('/api/devicePublicData/list', '', function (publicData) {
      var devicePublicData = publicData.collection

      $.get('/api/devicePrivateData/list', '', function (privateData) {
        var devicePrivateData = privateData.collection
        var ownedDevices = context.state.ownedDevices

        // Loop through all the priate models and match them up with public models.
        for (var i = 0; i < devicePrivateData.length; i++) {
          var publicId = devicePrivateData[i].publicData

          // Loop through the public models until the match is found.
          for (var j = 0; j < devicePublicData.length; j++) {
            if (publicId === devicePublicData[j]._id) {
              // Merge the private data properties into the public data object
              devicePublicData[j].serverSSHPort = devicePrivateData[i].serverSSHPort
              devicePublicData[j].deviceUserName = devicePrivateData[i].deviceUserName
              devicePublicData[j].devicePassword = devicePrivateData[i].devicePassword

              // Add the combined device object to the store object.
              ownedDevices.push(devicePublicData[j])

              // Break out of the loop.
              break
            }
          }
        }

        // Combine data into a single object

        // Add data to the store.
        context.commit('SET_OWNED_DEVICES', ownedDevices)

        // Commit the store.
      })
    })
  }
}
