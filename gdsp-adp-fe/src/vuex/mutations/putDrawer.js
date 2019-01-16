export const CONTROLDRAWER = function(state, obj) {
	obj.show ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';
	state.putDrawerCtr = obj;
};