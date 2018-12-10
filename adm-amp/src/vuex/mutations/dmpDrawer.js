/**
 * Created by yangxiaojing on 2017/8/11.
 */
import CONST from '../../help/CONST.js';

export const CONTROLDMPDRAWER = function(state, obj) {
	obj.show ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';
	state.drawerDmpCtrl = obj;
};

export const SETDMPDRAWERSTATE = function(state, type, obj) {
	// drawer首字母大写
	// CONST 全大写
	state[`drawer${type.replace(type.match(/([\s\S]){1}/)[1], type.match(/([\s\S]){1}/)[1].toUpperCase())}State`] = obj || CONST[`DRAWER${type.toUpperCase()}`];
};
