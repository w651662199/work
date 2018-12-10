
import Vue from 'vue';
import FastClick from 'fastclick';
import App from './profile.vue';
/* eslint-disable no-new */
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
