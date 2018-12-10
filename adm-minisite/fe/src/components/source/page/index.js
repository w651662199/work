/**
 * Created by yangxiaojing on 2017/7/25.
 */
import Vue from 'vue';
import FastClick from 'fastclick';
import App from './Page';
/* eslint-disable no-new */
import {Lazyload} from 'mint-ui';
Vue.use(Lazyload);
Vue.config.productionTip = false;

if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}

new Vue({
	el: '#app',
	template: '<App/>',
	components: { App }
});
