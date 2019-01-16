export const SETACCOUNTINFO = function(state, accountInfo) {
	state.accountInfo = accountInfo;
};
export const SETACCOUNTNAME = function(state, accountName) {
	state.accountInfo = Object.assign({}, state.accountInfo, {
		name: accountName
	});
};