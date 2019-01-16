import Vue from 'vue';

const prefix = 'TABLEEVENTS';

Vue.directive('click', {
	bind: function(el, binding) {
		setEventData('click', el, binding);
	}
});

Vue.directive('mouseenter', {
	bind: function(el, binding) {
		setEventData('mouseenter', el, binding);
	}
});

Vue.directive('mouseover', {
	bind: function(el, binding) {
		setEventData('mouseover', el, binding);
	}
});

Vue.directive('mouseleave', {
	bind: function(el, binding) {
		setEventData('mouseleave', el, binding);
	}
});

Vue.directive('dbclick', {
	bind: function(el, binding) {
		setEventData('dbclick', el, binding);
	}
});

function setEventData(type, el, binding) {
	if (binding.value.fn) {
		if (el[prefix]) {
			let events = el[prefix].events;
			if (events[type]) {
				events[type].push({
					fn: binding.value.fn,
					args: binding.value.args
				});
			} else {
				events[type] = [{
					fn: binding.value.fn,
					args: binding.value.args
				}];
			}
		} else {
			el[prefix] = {
				events: {},
				handler: null
			};
			let events = el[prefix].events;
			events[type] = [{
				fn: binding.value.fn,
				args: binding.value.args
			}];
		}
		el.addEventListener(type, function(e) {
			if (binding.value.args) {
				binding.value.fn.apply(this, binding.value.args);
			} else {
				binding.value.fn.apply(this, e);
			}
		});
	}
}