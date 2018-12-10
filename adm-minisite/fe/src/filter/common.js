import Vue from 'vue';
Vue.filter('formatCount', (value) => {
	if (value >= 10000) {
		return (value / 10000).toFixed(1) + "w";
	}
	return value;
});

Vue.filter('formatTitle', (value) => {
	// if (value.length >= 17) {
	// 	return value.substring(0, 17) + "...";
	// }
	return value;
});