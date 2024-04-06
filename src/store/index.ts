import { createStore } from 'vuex';

export default createStore({
    state: {
        token: null,
        userInfo: {
            username: null,
            roleId: null,
            password: null
        }
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
        },
        SET_USERINFO(state, userInfo) {
            state.userInfo = userInfo;
        },
    },
    actions: {
        setToken({ commit }, token) {
            commit('SET_TOKEN', token);
        },
        setUserInfo({ commit }, userInfo) {
            commit('SET_USERINFO', userInfo);
        },
    },
    getters: {
        getToken(state) {
            return state.token;
        },
        getUserInfo(state) {
            return state.userInfo;
        },
    },
});
