import { createStore } from 'vuex';

export default createStore({
    state: {
        token: null,
        userInfo: {
            username: null,
            roleId: null,
            password: null
        },
        personalData: {
            username: '',
            realname: '',
            code: '',
            sex: 1,
            phone: '',
            idCard: '',
            nickname: '',
        }
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
        },
        SET_USERINFO(state, userInfo) {
            state.userInfo = userInfo;
        },
        SET_PERSONALDATA(state, personalData) {
            state.personalData = personalData;
        }
    },
    actions: {
        setToken({ commit }, token) {
            commit('SET_TOKEN', token);
        },
        setUserInfo({ commit }, userInfo) {
            commit('SET_USERINFO', userInfo);
        },
        setPersonalData({ commit }, personalData) {
            commit('SET_PERSONALDATA', personalData);
        },
    },
    getters: {
        getToken(state) {
            return state.token;
        },
        getUserInfo(state) {
            return state.userInfo;
        },
        getPersonalData(state) {
            return state.personalData;
        }
    },
});
