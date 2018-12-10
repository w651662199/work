export const LOADING = (state, obj) => {
	state.loading = obj;
};

export const ERROR = (state, obj) => {
	state.errorCOde = obj;
};

export const SETUSERID = (state, obj) => {
	state.userId = obj;
};

export const SETAPPVERSION = (state, obj) => {
	state.appVersion = obj;
};