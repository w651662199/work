import CONST from 'help/CONST.js';
import {
	urlEncode
} from 'utils/common.js';
export default {
	install(Vue, options) {
		// add
		Vue.prototype.add = function(a, b) {
			return (a + b).toFixed(2);
		};
		// 货币单位格式化(分转元)
		Vue.prototype.getCurFmt = function(currency) {
			//先除以1000得到分，后除以100得到元
			return currency / 1000000;
		};
		// 退量数 = 竞价数 - 相应数
		Vue.prototype.getBackCount = function(requestCount, bidCount, biddingMode) {
			if (biddingMode === CONST.BIDDING_MODE.RTB) {
				return '-';
			}
			if (bidCount == undefined || requestCount == undefined) {
				return '-';
			}
			return requestCount - bidCount;
		};
		// 实际退量比 = 退量数 / 请求数
		Vue.prototype.getBackCountRate = function(requestCount, bidCount, biddingMode) {
			if (requestCount == 0 || biddingMode === CONST.BIDDING_MODE.RTB) {
				return '-';
			}
			if (bidCount == undefined || requestCount == undefined) {
				return '-';
			}
			var backCount = (requestCount - bidCount) * 100 / requestCount;
			return backCount.toFixed(2) + "%";
		};
		// 竞价率 = 竞价次数 / 请求数
		Vue.prototype.getBidRate = function(bidCount, requestCount, biddingMode) {
			if (requestCount == 0 || bidCount == undefined || requestCount == undefined) {
				return '-';
			}
			if (biddingMode === CONST.BIDDING_MODE.RTB) {
				return '-';
			}
			return (bidCount * 100 / requestCount).toFixed(2) + "%";
		};
		// 获胜率 = 获胜次数 / 竞价次数
		Vue.prototype.getWinRate = function(winCount, bidCount) {
			if (bidCount == 0) {
				return '-';
			}
			return (winCount * 100 / bidCount).toFixed(2) + "%";
		};
		// 平均点击单价 = 总花费 / 点击量
		Vue.prototype.getAvgClickPrice = function(totalFee, clickCount) {
			if (clickCount == 0) {
				return '-';
			}
			return (totalFee / clickCount).toFixed(2);
		};
		// 平均展示费用 = 总花费 / cpm 平均CMP单价
		Vue.prototype.getAvgImpPrice = function(totalFee, pv) {
			if (pv == 0) {
				return 0;
			}
			return (totalFee / (pv * 0.001)).toFixed(2);
		};
		// 平均千次展示费用 = 总花费 * 1000 / pv
		Vue.prototype.getAvgMillPrice = function(totalFee, pv) {
			if (pv == 0) {
				return 0;
			}
			return (totalFee / (pv * 0.001)).toFixed(2);
		};
		// 点击率 = 点击数 / pv
		Vue.prototype.getCtr = function(clickCount, pv) {
			if (pv == 0) {
				return '-';
			}
			var ctr = clickCount * 100 / pv;
			return ctr.toFixed(2) + "%";
		};
		// 转化率 = 总商品行 / 点击量
		Vue.prototype.getConversionRate = function(productNum, clickCount) {
			if (clickCount == 0) {
				return '-';
			}
			var conversionRate = productNum * 100 / clickCount;
			return conversionRate.toFixed(2) + "%";
		};
		// ROI = 总商品金额 / 总花费
		Vue.prototype.getRoi = function(orderPrice, totalFee) {
			if (totalFee == 0) {
				return '-';
			}
			return (orderPrice / totalFee).toFixed(2);
		};
		// map 转 list
		Vue.prototype.mapToList = function(map) {
			var values = new Array();
			for (var key in map) {
				values.push(map[key]);
			}
			return values;
		};

		Vue.prototype.getUrlParams = function() {
			let hash = location.hash;
			if (hash.indexOf('?') == -1) return null;
			let result = {};
			let reg = new RegExp('([\\?|&])(.+?)=([^&?]*)', 'ig');
			let arr = reg.exec(hash);
			while (arr) {
				result[arr[2]] = decodeURIComponent(arr[3]);
				arr = reg.exec(hash);
			}
			return result;
		};

		Vue.prototype.setUrlParams = function(params) {
			let hash = location.hash;
			let path = hash.split('?')[0];
			if (params) {
				let paramStr = urlEncode(params).slice(1);
				history.replaceState(null, '', path + '?' + paramStr);
			} else {
				history.replaceState(null, '', path);
			}
		};
	}
};

/**
请求数 bid_count
退量数 bid_count - win_count
展示量 pv
总花费 total_fee
平均点击单价 total_fee / win_count
平均展示费用 total_fee / pv
点击率 click_count / pv
总商品行
总商品金额
直接商品行
直接商品金额
间接商品行
间接商品金额
转化率
ROI
*/