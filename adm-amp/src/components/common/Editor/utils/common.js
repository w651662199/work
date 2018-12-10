

export const addEvent = (targets, type, handler) => {
	let target = Array.prototype.slice.call(targets);
	if (!target) return;
	target.forEach((item) => {
		if (document.addEventListener) {
			item.addEventListener(type, handler);
		} else {
			item.attachEvent('on' + type, handler);
		}
	});
};