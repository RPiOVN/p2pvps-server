export default {
  callingAPI: false,
  searching: '',
  serverURI: 'http://45.55.12.52:8080',
  user: null,
  token: null,
  userInfo: {
    messages: [{1: 'test', 2: 'test'}],
    notifications: [],
    tasks: [],
    GUID: ''
  },
  menuState: {
    dashboard: true,
    ownedDevices: false,
    rentedDevices: false,
    marketplace: false
  },
  ownedDevices: [], // Array of devices owned by this user.
  rentedDevices: [] // Array of devices rented by this user.
}
