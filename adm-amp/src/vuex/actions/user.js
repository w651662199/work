export const setUserInfo = function(store, userInfo) {
	store.commit('SETUSERINFO', userInfo);
};
export const setUserName = function(store, userName) {
	store.commit('SETUSERNAME', userName);
};
export const setUserAgree = function(store, agree) {
	store.commit('SETUSERAGREE', agree);
};