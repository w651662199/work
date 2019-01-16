import Vue from 'vue';
import store from 'store';

Vue.directive('privilege', {
	inserted: function(el, binding) {
		if (binding.value) {
			let privileges = store.state.accountInfo.privileges;
			let hasPrivilege = privileges && privileges.find(privilege => {
				return privilege.permission === binding.value && privilege.isDisplay === 1;
			});
			if (!hasPrivilege) {
				el.remove();
			}
		}
	}
});