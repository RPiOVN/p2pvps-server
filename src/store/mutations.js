export default {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  TOGGLE_SEARCHING (state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  },
  SET_USER (state, user) {
    state.user = user
  },
  SET_TOKEN (state, token) {
    state.token = token
  },

  SET_MENU (state, newMenuState) {
    state.menuState = newMenuState
  },

  SET_OWNED_DEVICES (state, newOwnedDevicesState) {
    state.ownedDevices = newOwnedDevicesState
  }
}
