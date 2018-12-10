export const SETUSERINFO = function(state, userInfo) {
	state.userInfo = userInfo;
	if (userInfo.isRegistered === 1 && userInfo.isApproved === 1 && userInfo.isAgree === 0) {
		document.body.style.overflow = 'hidden';
	} else {
		document.body.style.overflow = 'auto';
	}
};
export const SETUSERNAME = function(state, userName) {
	state.userInfo = Object.assign({}, state.userInfo, {
		name: userName
	});
};

export const SETUSERAGREE = function(state, agree) {
	state.userInfo = Object.assign({}, state.userInfo, {
		isAgree: agree
	});
};