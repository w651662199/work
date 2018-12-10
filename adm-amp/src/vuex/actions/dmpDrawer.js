/**
 * Created by yangxiaojing on 2017/8/11.
 */
export const controlDmpDrawer = function(context, obj) {
	context.commit('CONTROLDMPDRAWER', obj);
};

export const setDmpDrawerState = function(context, type, obj) {
	context.commit('SETDMPDRAWERSTATE', type, obj);
};
