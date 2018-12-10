export const loading = function(store, obj) {
	store.commit('LOADING', obj);
};

export const error = function(store, obj) {
	store.commit('ERROR', obj);
};
