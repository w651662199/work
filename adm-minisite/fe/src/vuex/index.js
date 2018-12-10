import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import state from './state/index';
import mutations from './mutations/index';
import actions from './actions/index';

export default new Vuex.Store({
	state,
	mutations,
	actions,
	strict: process.env !== 'pro'
});