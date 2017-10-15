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
  },
  SET_RENTED_DEVICES (state, newRentedDevicesState) {
    state.rentedDevices = newRentedDevicesState
  },

  SET_USER_ID (state, userId) {
    state.userInfo.GUID = userId
  },

  UPDATE_MODAL (state, newModalData) {
    state.modal = newModalData

    // Show the modal based on the state.
    if (state.modal.show) {
      $('.appModal').modal('show')
      $('.appModal').modal('handleUpdate')
    } else {
      $('.appModal').modal('hide')
    }
  }
}
