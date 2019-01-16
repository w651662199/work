/**
 * v-1.0.0
 * 使用方法（此版本为初步版本，后续会逐步完善）
 * 1、表格外层需有两层div，
 * <div class="data-table" id="con-table-change">  id:必需属性，值不必固定，该容器最终会包含所有动态append的元素
 * 	<div class="main-table-wapper"> 表格外层容器，
 *	 <table class="table main-table"> 主表格，所有浮动的元素由此clone，main-table类名必需
 *	 </table>
 *	</div>
 * </div>
 * 2、在组件内
 * 引入所需公共方法
 * import {tableHandler, offWindowEvent, initWindowResize} from 'utils/table';
 * tableHandler：添加所有与浮动相关的元素
 * initWindowResize：当窗口大小改变时，重新计算
 * offWindowEvent：移除添加的事件，避免不必要的错误
 * 3、在vue实例的生命周期内调用步骤2引入的方法
 * mounted() { 渲染页面时初始化事件
 *  initWindowResize('con-table-change', true);
 * },
 * updated() { 当页面数据有变化时绘制元素
 *  tableHandler('con-table-change', true);
 * },
 * destroyed() { 组件销毁时注销事件
 *  offWindowEvent('con-table-change');
 * }
 *
 * 使用时可以参考定价或竞价cpc三个列表
 */


let navigatorName = "Microsoft Internet Explorer"; 
import {domCreator, addClass, on, off} from './dom.js';

/**
 * 表格处理事件
 * @param  {string}  containerId      所有表格容器的id
 * @param  {Boolean} hasSelectHandler 是否有checkbox事件
 */
export const tableHandler = (containerId, hasSelectHandler, leftFloatNumber) => {
	var scrollWapper = document.getElementsByClassName('table__fixed-scrollbar--wapper')[0];
	var scrollWapperStatic = document.getElementsByClassName('table__static-scrollbar--wapper')[0];
	var scrollLeft = 0;
	var scrollLeftStatic = 0;
	if (scrollWapper) {
		scrollLeft = scrollWapper.scrollLeft;
	}
	if (scrollWapperStatic) {
		scrollLeftStatic = scrollWapperStatic.scrollLeft;
	}
	var mainTableCon = document.getElementById(containerId);
	if (mainTableCon) {
		var mainTable = mainTableCon.getElementsByClassName('main-table')[0];
		var mainTableWapper = mainTableCon.getElementsByClassName('main-table-wapper')[0];
		var mainFixedTableHead = getTableHead(mainTableCon, mainTable, false, hasSelectHandler, leftFloatNumber);
		var fixedColumnTableHead = getTableHead(mainTableCon, mainTable, true, hasSelectHandler, leftFloatNumber);
		mainTableCon.appendChild(mainFixedTableHead);
		mainTableCon.appendChild(fixedColumnTableHead);
		var fixedColumnTable = getfixColumnTable(mainTableCon, mainTable, hasSelectHandler, leftFloatNumber);
		mainTableCon.appendChild(fixedColumnTable);
		var scrollContainer = getScrollContainer(mainTableCon, mainTable);
		mainTableCon.appendChild(scrollContainer);
		scrollContainerHandler(mainTableCon, mainTable, mainFixedTableHead, scrollContainer, mainTableWapper);
		initWindowSroll(mainTableCon, mainFixedTableHead, fixedColumnTableHead, scrollContainer);
		initmainTableWapperSroll(mainTableWapper, mainFixedTableHead, scrollContainer);
//		 scrollHon(mainTable.parentNode, mainFixedTableHead, scrollLeft);
		if (scrollWapper) {
			scrollContainer.scrollLeft = scrollLeft;
		}
		if (scrollWapperStatic) {
			scrollContainer.scrollLeft = scrollLeftStatic;
		}
		scrollVertical(mainTableCon, mainFixedTableHead, fixedColumnTableHead);
	}
};

/**
 * 获取表格表头
 * @param  {dom element}  mainContainer    包裹所有表格元素的外容器
 * @param  {dom table}  tableElement       主表格
 * @param  {Boolean} isLeftFixed           是否为左边表头
 * @param  {Boolean} hasSelectHandler      是否有checkbox 选项
 * @return {dom element}                   包含表头的div
 */
const getTableHead = (mainContainer, tableElement, isLeftFixed, hasSelectHandler, leftFloatNumber) => {
	var tableHeadDivCon = mainContainer.getElementsByClassName('table__fixed-head--wapper');
	if (tableHeadDivCon.length > 0) {
		for (var i = 0;i < tableHeadDivCon.length;i++) {
			if(navigator.appName == navigatorName){
			    tableHeadDivCon[i].removeNode(true);
			}else{
			    tableHeadDivCon[i].remove();
			}
		}
	}
	tableHeadDivCon = domCreator('div', null, {class: 'table__fixed-head--wapper fixed-header'});
	var tableHeadTableCon = domCreator('table', null, {class: 'table fixedtablehead'});
	// var tableHeadDivCon = document.createElement('div', {className: 'fixed-head-wapper fixed-header', style: 'display:none;position: fixed;top: 0;right: 40px;width: 100%;z-index:90;overflow: hidden;'});
	// var tableHeadTableCon = document.createElement('table', {className: 'table fixedtablehead'});
	var tableHead = tableElement.getElementsByTagName('thead')[0].cloneNode(true);

	var sourceTableHeaThs = tableElement.getElementsByTagName('th');
	if (!isLeftFixed) {
		tableHeadTableCon.appendChild(tableHead);
		tableHeadDivCon.style.width = mainContainer.clientWidth + 'px';
	} else {
		tableHeadTableCon.appendChild(tableHead);
		var divWidth = 0;
		var fixThs = tableHead.getElementsByTagName('th');
		var tableThs = tableElement.getElementsByTagName('th');
		for (var i = 0;i < fixThs.length;i++) {
			if (i > (leftFloatNumber - 1)) {
				addClass(fixThs[i], 'fixed-hidden');
			}
			fixThs[i].style.width = tableThs[i].offsetWidth + 'px';
		}
		divWidth = getFixColumnTableWidth(tableElement, leftFloatNumber);
		tableHeadDivCon.style.width = divWidth + 'px';
	}
	if (hasSelectHandler) {
		var currentEm = tableHead.getElementsByClassName('select-all')[0];
		var sourceEm = tableElement.getElementsByClassName('select-all')[0];
		on(currentEm, 'click', () => {
			sourceEm.click();
		});
	}
	tableHeadDivCon.style.left = mainContainer.offsetLeft + 'px';
	tableHeadDivCon.appendChild(tableHeadTableCon);
	return tableHeadDivCon;
};

/**
 * 获取左边固定列的表格
 * @param  {dom element}  mainContainer    包裹所有表格元素的外容器
 * @param  {dom table}  tableElement       主表格
 * @param  {Boolean} hasSelectHandler      是否有checkbox 选项
 * @return {dom element}                   包含表格的div
 */
const getfixColumnTable = (mainContainer, tableElement, hasSelectHandler, leftFloatNumber) => {
	var tableColumnDivCon = mainContainer.getElementsByClassName('table__fixed-columns--wapper');
	if (!!tableColumnDivCon) {
		for (var i = 0;i < tableColumnDivCon.length;i++) {
			if(navigator.appName == navigatorName){
			    tableColumnDivCon[i].removeNode(true);
			}else{
			    tableColumnDivCon[i].remove();
			}
		}
	}
	tableColumnDivCon = domCreator('div', null, {class: 'table__fixed-columns--wapper'});
	var tableColumnTable = tableElement.cloneNode(true);
	var ths = tableColumnTable.getElementsByTagName('th');
	var tableThs = tableElement.getElementsByTagName('th');
	var tbodyTrs = tableColumnTable.getElementsByClassName('body-row');
	var sourceTableTbodyTrs = tableElement.getElementsByClassName('body-row');
	for (var j = 0;j < tbodyTrs.length;j++) {
		var trTds = tbodyTrs[j].children;//每一行的td
		for (var n = 0;n < tableThs.length;n++) {
			if (n > (leftFloatNumber - 1)) {
				addClass(trTds[n], 'fixed-hidden');
				addClass(ths[n], 'fixed-hidden');
			}
			if (n === 0 && hasSelectHandler) {
				let currentTdEm = trTds[n].getElementsByTagName('em')[0];
				on(currentTdEm, 'click', () => {
					let dataId = currentTdEm.getAttribute('data-id');
					var sourceEm = tableElement.getElementsByClassName('select-' + dataId)[0];
					sourceEm.click();
				});
			}
			if (trTds[n]) {
				trTds[n].style.width = tableThs[n].offsetWidth + 'px';
			}
			ths[n].style.width = tableThs[n].offsetWidth + 'px';
		}
	}
	//复制左浮动全选事件
	if (hasSelectHandler) {
		var columnSelectAll = tableColumnTable.getElementsByClassName('select-all')[0];
		var sourceSelectAll = tableElement.getElementsByClassName('select-all')[0];
		on(columnSelectAll, 'click', () => {
			sourceSelectAll.click();
		});
	}
	//设置左浮动表格宽度
	var divWidth = getFixColumnTableWidth(tableElement, leftFloatNumber);
	tableColumnDivCon.style.width = divWidth + 'px';
	tableColumnDivCon.appendChild(tableColumnTable);
	return tableColumnDivCon;
};

const getFixColumnTableWidth = (tableElement, fixColumnCounts) => {
	var ths = tableElement.getElementsByTagName('th');
	var divWidth = 0;
	for (let i = 0;i < fixColumnCounts;i++) {
		divWidth += ths[i].offsetWidth;
	}
	// var divWidth = ths[0].offsetWidth + ths[1].offsetWidth + ths[2].offsetWidth;
	return divWidth + 1; //加1是为了显示最右边的边框
};

const getScrollContainer = (mainContainer, tableElement) => {
	var scrollContainerDiv = mainContainer.getElementsByClassName('table__fixed-scrollbar--wapper');
	if (!!scrollContainerDiv) {
		for (var i = 0;i < scrollContainerDiv.length;i++) {
			if(navigator.appName == navigatorName){
			    scrollContainerDiv[i].removeNode(true);
			}else{
			    scrollContainerDiv[i].remove();
			}
		}
	}
	var scrollContainerDiv2 = mainContainer.getElementsByClassName('table__static-scrollbar--wapper');
	if (!!scrollContainerDiv2) {
		for (var i = 0;i < scrollContainerDiv2.length;i++) {
			if(navigator.appName == navigatorName){
			    scrollContainerDiv2[i].removeNode(true);
			}else{
			    scrollContainerDiv2[i].remove();
			}
		}
	}
	if (judgeBarPosition(mainContainer) == 1) {
		var scrollContainerDiv = domCreator('div', null, {class: 'table__fixed-scrollbar--wapper'});
	} else {
		var scrollContainerDiv = domCreator('div', null, {class: 'table__static-scrollbar--wapper'});
	}
	scrollContainerDiv.style.width = mainContainer.clientWidth + 'px';
	scrollContainerDiv.style.left = mainContainer.offsetLeft + 'px';

	var scrollContentDiv = domCreator('div', null, {class: 'table__fixed-scrollbar--content'});
	scrollContentDiv.style.width = tableElement.clientWidth + 'px';
	scrollContainerDiv.appendChild(scrollContentDiv);
	return scrollContainerDiv;
};
let timer = null;
const scrollContainerHandler = (mainContainer, tableElement, fixHeaderWapper, scrollWapper) => {
	if (tableElement.clientWidth > mainContainer.clientWidth) {
		var mainTableWapper = tableElement.parentNode;
		on(scrollWapper, 'scroll', e => {
			// var scrollLeft = scrollWapper.scrollLeft;
			// mainTableWapper.scrollLeft =  scrollLeft;
			// fixHeaderWapper.scrollLeft =  scrollLeft;
			timer = setTimeout(function() {
				scrollHon(mainTableWapper, fixHeaderWapper, scrollWapper.scrollLeft);
			},0);
			fixHeaderWapper.scrollLeft =  scrollWapper.scrollLeft;
		});
	} else {
		scrollWapper.style.display = 'none';
	}
};

const scrollHon = (mainTableWapper, fixHeaderWapper, scrollLeft) => {
	mainTableWapper.scrollLeft =  scrollLeft;
	fixHeaderWapper.scrollLeft =  scrollLeft;
};
const initWindowSroll = (mainContainer, fixHeaderWapper, fixLeftColumnHeadWapper, scrollWapper) => {
	on(window, 'scroll', (e) => {
		// var scrollTop = document.body.scrollTop;
		// if ((mainContainer.offsetTop - scrollTop) <= 0) {
		// 	fixHeaderWapper.style.display = 'block';
		// 	fixLeftColumnHeadWapper.style.display = 'block';
		// } else {
		// 	fixHeaderWapper.style.display = 'none';
		// 	fixLeftColumnHeadWapper.style.display = 'none';
		// }
		scrollVertical(mainContainer, fixHeaderWapper, fixLeftColumnHeadWapper);
		fixHeaderWapper.scrollLeft =  scrollWapper.scrollLeft;
		judgeBarPosition(mainContainer, scrollWapper);
	});
};
const initmainTableWapperSroll = (mainTableWapper, fixHeaderWapper, scrollContainer) => {
	on(mainTableWapper, 'scroll', (e) => {
		clearTimeout(timer);
		fixHeaderWapper.scrollLeft = mainTableWapper.scrollLeft;
		scrollContainer.scrollLeft = mainTableWapper.scrollLeft;
	});
};
const judgeBarPosition = (mainContainer, scrollWapper) => {
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	var clientHeight = document.documentElement.clientHeight - mainContainer.offsetTop + scrollTop;
	var tableHeight = mainContainer.getElementsByClassName('main-table-wapper')[0].offsetHeight;
	if ((tableHeight - 5) > clientHeight && clientHeight > 20) {
		if (scrollWapper) {
			scrollWapper.setAttribute('class', 'table__fixed-scrollbar--wapper');
		}
		return 1;
	} else {
		if (scrollWapper) {
			scrollWapper.setAttribute('class', 'table__static-scrollbar--wapper');
		}
		return 2;
	}
};
const scrollVertical = (mainContainer, fixHeaderWapper, fixLeftColumnHeadWapper) => {
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	var tableHeight = mainContainer.getElementsByClassName('main-table-wapper')[0].offsetHeight;
	if ((scrollTop - mainContainer.offsetTop) >= 0 && (scrollTop - mainContainer.offsetTop) <= (tableHeight - 32)) {
		fixHeaderWapper.style.display = 'block';
		fixLeftColumnHeadWapper.style.display = 'block';
	} else {
		fixHeaderWapper.style.display = 'none';
		fixLeftColumnHeadWapper.style.display = 'none';
	}
};

export const initWindowResize = (containerId, hasSelectHandler, leftFloatNumber) => {
	on(window, 'resize', () => {tableHandler(containerId, hasSelectHandler, leftFloatNumber);});
};

export const offWindowEvent = (containerId, hasSelectHandler = true) => {
	var mainContainer = document.getElementById(containerId);
	off(window, 'scroll', () => {
		var scrollWapper = mainContainer.getElementsByClassName('table__fixed-scrollbar--wapper')[0];
		off(scrollWapper, 'scroll');
	});
	off(window, 'resize', tableHandler(containerId, hasSelectHandler));
};