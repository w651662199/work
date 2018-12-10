export const controlAnicer = function(context, obj) {
	context.commit('CONTROLANICER',obj);
};
export const setAnicerData = function(context, obj) {
	context.commit('SETANICERDATA', obj);
};
export const setEmptyAnicerData = function(context, obj) {
	context.commit('SETEMPTYANICERDATA', obj);
};
