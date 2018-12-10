/**
 * Created by yangxiaojing on 2017/11/7.
 */

export const SETSHOPANICERDATA = function(state,obj) {
	state.shopAnicerFormData = 	Object.assign({},state.anicerFormData,obj);
};
