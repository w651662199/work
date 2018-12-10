import Vue from 'vue';
import { on, off, scrollBarWidth, getFixedTableHeader } from './dom.js';

const tableList = [];
const ctx = '@@fixtableheadeContext';

on(window, 'scroll', e => {
	tableList.forEach(node => node[ctx].documentHandler(e));
});

export default {
	bind(el, binding, vnode) {
		const id = tableList.push(el) - 1;
		const documentHandler = function(e) {
			if (!vnode.context ||
				el.contains(e.target) ||
				(vnode.context.popperElm &&
				vnode.context.popperElm.contains(e.target))) return;

			if (binding.expression &&
				el[ctx].methodName &&
				vnode.context[el[ctx].methodName]) {
				vnode.context[el[ctx].methodName](el, e);
			} else {
				el[ctx].bindingFn && el[ctx].bindingFn(el, e);
			}
		};
		el[ctx] = {
			id: id,
			documentHandler: documentHandler,
			methodName: binding.expression,
			bindingFn: binding.value
		};
	},
/**
	inserted(el, binding) {
		// var fixHeader = getFixedTableHeader(el);
		// el.appendChild(fixHeader);
		var scrollBW = scrollBarWidth();
		var windowWidth = window.outerWidth;
		var leftNavWidth = document.getElementsByClassName('content-menu')[0].clientWidth;
		var wapperWidth = el.clientWidth - scrollBW;
		if ((el.clientWidth + leftNavWidth) > windowWidth) {
			wapperWidth = wapperWidth - leftNavWidth;
		}
		var headWapper = el.getElementsByClassName('fixed-head-wapper')[0];
		var table = el.getElementsByClassName('main-table')[0];
		var tableWapper = el.getElementsByClassName('main-table-wapper')[0];
		var scrollWapper = el.getElementsByClassName('table-scroll-wapper')[0];
		var scrollBarContent = el.getElementsByClassName('table-scroll-content')[0];
		headWapper.style.width = wapperWidth + 'px';
		scrollWapper.style.width = wapperWidth + 'px';
		scrollBarContent.style.width = table.clientWidth + 'px';
		on(scrollWapper, 'scroll', e => {
			var scrollLeft = e.target.scrollLeft;
			headWapper.scrollLeft = e.target.scrollLeft;
			tableWapper.scrollLeft = e.target.scrollLeft;
		});
	},
*/
	update(el, binding) {
		el[ctx].methodName = binding.expression;
		el[ctx].bindingFn = binding.value;
	},

	unbind(el) {
		let len = tableList.length;

		for (let i = 0; i < len; i++) {
			if (tableList[i][ctx].id === el[ctx].id) {
				tableList.splice(i, 1);
				break;
			}
		}
	}
};