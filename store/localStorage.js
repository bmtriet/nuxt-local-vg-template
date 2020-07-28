export const state = () => ({
    logined: false,
    role: 'guest',
})
export const mutations = {
  updateState: function(state,payload) {
        state.logined = payload.logined;
        state.role = payload.role;
  },
}