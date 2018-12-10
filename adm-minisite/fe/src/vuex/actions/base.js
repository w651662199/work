export const loading = (store, obj) => {
	store.commit('LOADING', obj);
};

export const error = (store, obj) => {
	store.commit('ERROR', obj);
};

export const setUserId = (store, obj) => {
	store.commit('SETUSERID', obj);
};

export const setAppVersion = (store, obj) => {
	store.commit('SETAPPVERSION', obj);
};