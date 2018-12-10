<template>
	<div class="amp-drawer">
		<div class="drawer-part">
			<h2 class="part-header"><span class="header-text">添加关键词</span><span class="header-fn"><em @click="hide()" class="icon icon-close"></em></span></h2>
			<div class="amp-form amp-form02">
				<div class="amp-bidcpc">
					<div class="bidcpc-inner">
						<el-select v-if="false" v-model="search.type" style="width:100px;display:inline-block;margin-right: 20px;" placeholder="请选择">
						    <el-option label="PC端" :value="0"></el-option>
						    <el-option label="无线端" :value="1"></el-option>
						</el-select>
						<span>
							<span>SKU ID</span>
							<el-tooltip placement="top" effect="light">
								<div slot="content">联营商品前方添加pop</div>
								<div class="SKUtipicon" style="margin: 0 10px"><em class="icon icon-doubt"></em></div>
							</el-tooltip>
						</span>
						<el-input style="width:170px;display:inline-block;margin-right: 20px;" placeholder="输入商品SKU ID" v-model="search.skuId"></el-input>
						<a href="javascript:;" class="btn btn-primary" @click="searchKeywords" style="padding: 0 10px;">查询</a>
						<div class="amp-bidcpc-add clearfix">
							<button class="btn btn-primary" type="button" style="padding: 0 10px;" @click.prevent="addKeywordsToRight">添加当前页</button>
						</div>
					</div>
					<table class="main-table table">
						<tr>
							<th class="w100"><span>关键词</span></th>
							<th class="w120"><span>搜索指数</span></th>
							<th class="w120"><span>竞争指数</span></th>
							<th class="w80"><span>历史均价</span></th>
							<th class="w80"></th>
						</tr>
						<tbody>
							<tr v-if="keywords.length === 0" style="height: 100px;"><td colspan="5"><span>请输入SKU搜索关键词</span></td></tr>
							<tr v-for="(keyword, index) in keywords" key="keyword.id">
								<td><span class="oper-link"><i>{{keyword.name}}</i></span></td>
								<td><el-rate v-model="keyword.searchStar" disabled style="text-align:center;"></el-rate></td>
								<td><el-rate v-model="keyword.purchaseStar" disabled style="text-align:center;"></el-rate></td>
								<td><span>{{keyword.averagePrice/100}}</span></td>
								<td>
									<span v-if="keyword.checked" class="oper-link disable">
										已添加
									</span>
									<span v-else class="oper-link action" @click="addKeyword(keyword)">
										添加
									</span>
								</td>
							</tr>
						</tbody>
					</table>
					<el-pagination v-show="Math.floor(page.totalCount/page.pageSize)>0"
						@current-change="currentPageChange"
						:current-page="page.currentPage"
						:page-size="page.pageSize"
						layout="total, prev, pager, next"
						:class="{'el-pagination-reset': true}"
					   	:total="page.totalCount">
					</el-pagination>
				</div>
				<div class="amp-bidcpc" style="margin-left: 50px;">
					<div class="bidcpc-inner" style="position: relative;">
						<p class="bidcpc-text" :class="selectKeywords.length>200?'bidcpc-text-hint':''">
							已选关键词 {{selectKeywords.length}}/{{200}}
							<div v-show='selectKeywords.length>200' style="position: absolute;left: 0;top: 20px;color: #ff4949;">最多只能添加200个关键词，已为您添加前200个</div>
						</p>
						<div class="amp-bidcpc-del clearfix">
							<button class="btn btn-normal inner-style" @click="delKeyWordsBatch">删除</button>
							<button class="btn btn-normal inner-style" @click="addCustomKeyWords">自定义</button>
							<button class="btn btn-normal inner-style" @click="showMoney">批量出价</button>
							<div v-show='showHintDel' style="position: absolute;left: 1px;top: 48px;color: #ff4949;font-size: 12px;">请选择关键词后，再删除</div>
							<div class="money-box" :class='{none:showMoneyBox}'>
								<div :class='{borderColor:showAllMoneyHint}' class="ele-input ele-input04" style="height: 40px;padding-top: 0px;padding-bottom: 0px;width: 98px;border-radius: 5px;">
									<input type="text" @input.prevent="clearNum" value="" id="customPcBid" v-model="customPcBid">
								</div>
								元
								<a href="javascript:;" class="btn btn-primary" @click="setPcBidBatch" style="padding: 0 14px;margin-left: 15px;">确定</a>
								<a href="javascript:;" class="btn btn-gray" @click="hideMoneyBox" style="height:36px;line-height:36px;padding: 0 14px;margin-left: 5px;">取消</a>
								<div :class='{none:!showAllMoneyHint}' style="position: absolute;left: 15px;top: 55px;color: #ff4949;font-size: 12px;">{{showAllMoneyTxt}}</div>
							</div>
						</div>
					</div>
					<table class="table">
						<tr :class="{actived: isRightAllSelect}">
							<th class="w40">
								<span><em class="icon icon-select  select-all" @click="selectRightAll"></em></span>
							</th>
							<th class="w140"><span>关键词</span></th>
							<th class="w180"><span>PC端出价</span></th>
							<th></th>
						</tr>
						<tbody>
							<tr v-if="selectKeywords.length === 0" style="height: 100px;">
								<td colspan="4"><span>请输入SKU搜索关键词</span></td>
							</tr>
							<tr v-for="(keyword, index) in selectKeywords" key="keyword.id" :class="{actived: keyword.checked}">
								<td>
									<span><em class="icon icon-select" @click="selectRight(keyword)"></em></span>
								</td>
								<td>
									<span v-show='!keyword.showCustomInput'>{{keyword.name}}</span>
									<div :style='{borderColor:keyword.showHintKeywords?"#ff4949":""}' v-if='keyword.showCustomInput' class="ele-input ele-input04" style="position:relative;height: 26px;padding: 0 10px;margin: 3px 10px;overflow: visible;">
										<input type="text" v-model="keyword.name" @blur="requestKeywords(keyword.name, index)">
									</div>
									<span v-if="keyword.showHintKeywords" class="table-inner-error">{{ keyword.showHintKeywordsTxt }}</span>
								</td>
								<td>
									<div :style='{borderColor:keyword.rshowHintPc?"#ff4949":""}' class="ele-input ele-input04" style="position:relative;height: 26px;padding: 0 10px;margin: 3px 10px;overflow: visible;">
										<input type="text" value="" :id="'pcBid-' + index" v-model="keyword.pcBid" @blur="pcBidBlurCheck('pcBid-', index)" @mouseout="pcBidMouseOutCheck('pcBid-', index)" @keyup="pcBidKeyUpCheck('pcBid-', index)">
									</div>
									<span v-if="keyword.showHintPc" class="table-inner-error">{{ keyword.showHintPcTxt }}</span>
								</td>
								<td>
									<span><em class="icon icon-delete" @click="delKeywordFromRight(index, keyword)"></em></span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="drawer-btn">
			<button class="btn btn-primary" @click="save()">保存</button>
			<button class="btn btn-gray" @click="hide()">取消</button>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import store from 'store';
import {
	copyObj,
	strTrim,
	floatMul
} from 'utils/common';
import Event from 'event';
import Http from 'http';
export default {
	name: 'app-put-bidcpc-new-add-keyword',
	data() {
		return {
			keywords: [],
			getKeyWords: {
				pc: [],
				wap: []
			},
			selectKeywords: [],
			selectLeftKeywords: [],
			selectRightKeywords: [],
			customKeyword: '',
			customPcBid: '',
			search: {
				skuId: '',
				type: 0
			},
			page: {
				totalCount: 0,
				currentPage: 0,
				pageSize: 50
			},
			checkAllSelect: false,
			batchPcBidFlag: true,
			showMoneyBox: true,
			showAllMoneyHint: false,
			showAllMoneyTxt: '',
			showHintBatch: false,
			showHintDel: false,
			showHintAdd: false,
			isConstum: false,
			isKeywordsNull: false,
		};
	},
	props: {
		unitId: {
			default: ''
		},
		kwds: {
			type: Array,
			default: function() { return [] }
		}
	},
	computed: {
		drawerData: () => store.state.drawerCtrl.config, // from store
		isRightAllSelect() {
			let isActived = true, keywords = this.selectKeywords;
			if (keywords.length === 0) {
				isActived = false;
			}
			for (let keyword of keywords) {
				if (keyword.checked) {
					continue;
				}
				isActived = false;
				break;
			}
			return isActived;
		}
	},
	created() {
		if (this.unitId) {
			Http.get('/api/keywords/flightId', {
				params: {
					flightId: this.unitId
				}
			}).then((res) => {
				if (res.status === 200 && res.data.code === 200) {
					let keywords = res.data.data.keywords;
					keywords.forEach((keyword) => {
						keyword.pcBid = keyword.pcBid / 100;
						this.$set(keyword, 'checked', false);
					});
					this.selectKeywords = keywords;
				} else if (res.data.code >= 500) {
					this.$message({
						message: '服务器异常，请稍后再试。',
						type: 'error',
						duration: 3000
					});
				} else {
					this.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			}).catch((error) => {
				console.log(error);
			});
		}
		let kwdsTemp = copyObj(this.kwds);
		kwdsTemp.forEach((kwd) => {
			kwd.pcBid = kwd.pcBid / 100;
			this.$set(kwd, 'checked', false);
		});
		this.selectKeywords.push.apply(this.selectKeywords, kwdsTemp);
		// this.selectKeywords.push(this.kwds);
	},
	methods: {
		currentPageChange(page){
			this.page.currentPage = page;
			this.getKeyWordsBySkuId();
		},
		clearNum() {
			if (this.customPcBid.length) {
				this.customPcBid = this.customPcBid.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
			    this.customPcBid = this.customPcBid.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
			    this.customPcBid = this.customPcBid.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
			    this.customPcBid = this.customPcBid.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
			    if(this.customPcBid.indexOf(".")< 0 && this.customPcBid !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
			        this.customPcBid= parseFloat(this.customPcBid);
			    }
			}
			if (this.customPcBid > 999.99) {
				this.showAllMoneyHint = true;
				this.showAllMoneyTxt = '出价最大不超过999.99';
			} else if (this.customPcBid < 0.30) {
				this.showAllMoneyHint = true;
				this.showAllMoneyTxt = '出价最小为0.30';
			} else {
				this.showAllMoneyHint = false;
				this.showAllMoneyTxt = '';
			}
		},
		showMoney() {
			if (this.selectRightKeywords.length === 0) {
				this.showHintBatch = true;
			} else {
				this.showMoneyBox = !this.showMoneyBox;
				this.showHintBatch = false;
				if (this.showMoneyBox) {
					this.showAllMoneyHint = false;
					this.showAllMoneyTxt = '';
				}
			}
		},
		hideMoneyBox() {
			this.showMoneyBox = true;
			this.showAllMoneyHint = false;
			this.showAllMoneyTxt = '';
		},
		handleLeftChange(selectItems) {
			this.selectLeftKeywords = selectItems;
		},
		handleRightChange(selectItems) {
			this.selectRightKeywords = selectItems;
		},
		searchKeywords() {
			if (this.page.currentPage !== 1) {
				this.page.currentPage = 1;
			} else {
				this.getKeyWordsBySkuId();
			}
		},
		getKeyWordsBySkuId() {
			let vm = this;
			Http.get('/api/keywords/skuId', {
				params: {
					skuId: this.search.skuId,
					page: this.page.currentPage,
					number: this.page.pageSize
				}
			}).then((res) => {
				if (res.status === 200 && res.data.code === 200) {
					vm.page.totalCount = res.data.data.totalCount;
					let kws = res.data.data.keywords;
					let pcKws = [], wapKws = [];
					kws.forEach((item) => {
						//1-pc  2-无线
						let selectKW = this.selectKeywords.find((kw) => {
							return kw.id === item.id;
						});
						if (selectKW) {
							vm.$set(item, 'checked', true);
						} else {
							vm.$set(item, 'checked', false);
						}
						if (item.averagePrice === 0) {
							item.averagePrice = 30;
						}
						if (item.source === 1) {
							pcKws.push(item);
						} else {
							wapKws.push(item);
						}
					});
					this.getKeyWords.pc = pcKws;
					this.getKeyWords.wap = wapKws;
					this.keywords = this.search.type === 0 ? this.getKeyWords.pc : this.getKeyWords.wap;
					// this.duplicate(this.selectKeywords);
				} else if (res.data.code >= 500) {
					this.$message({
						message: '服务器异常，请稍后再试。',
						type: 'error',
						duration: 3000
					});
				} else {
					this.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		addKeyword(kw) {
			if (this.selectKeywords.length === 200) {
				return false;
			}
			let keyword = copyObj(kw);
			keyword.checked = false;
			this.$set(keyword, 'pcBid', 0);
			this.$set(keyword, 'showHintPc', false);
			this.$set(keyword, 'showHintPcTxt', '');
			this.$set(keyword, 'showCustomInput', false);
			this.$set(keyword, 'showHintKeywords', false);
			this.$set(keyword, 'showHintKeywordsTxt', '');
			this.selectKeywords.push(keyword);
			kw.checked = true;
		},
		addKeywordsToRight() {
			if (this.keywords.length === 0) {
				return false;
			} else {
				this.keywords.forEach((item, indet) => {
					if (!item.checked) {
						let keyword = copyObj(item);
						this.$set(keyword, 'pcBid', 0);
						this.$set(keyword, 'showHintPc', false);
						this.$set(keyword, 'showHintPcTxt', '');
						this.$set(keyword, 'showCustomInput', false);
						this.$set(keyword, 'showHintKeywords', false);
						this.$set(keyword, 'showHintKeywordsTxt', '');
						keyword.checked = false;
						this.selectKeywords.push(keyword);
						item.checked = true;
					}
				});
				// this.duplicate(this.selectLeftKeywords);
			}
		},
		selectRight(keyword) {
			keyword.checked = !keyword.checked;
			let index = -1;
			for (let i = 0; i < this.selectRightKeywords.length; i++) {
				let kw = this.selectRightKeywords[i];
				if (kw.id === keyword.id) {
					index = i;
					break;
				}
			}
			if (index > -1) {
				this.selectRightKeywords.splice(index, 1);
			} else {
				this.selectRightKeywords.push(keyword);
			}
		},
		selectRightAll() {
			let isActived = this.isRightAllSelect;
			for (let keyword of this.selectKeywords) {
				if (!isActived) {
					if (!keyword.checked) {
						this.selectRightKeywords.push(keyword);
					}
				} else {
					if (keyword.checked) {
						this.deleteFromSeleteRightKeywords(keyword);
					}
				}
				keyword.checked = !isActived;
			}
		},
		duplicate(arr) {
			arr.forEach((item, indet) => {
				if (item.source == 1) {
					this.getKeyWords.pc.forEach((itemPc, indexPc) => {
						if (itemPc.id == item.id) {
							this.getKeyWords.pc.splice(indexPc, 1);
						}
					});
				} else {
					this.getKeyWords.wap.forEach((itemWap, indexWap) => {
						if (itemWap.id == item.id) {
							this.getKeyWords.wap.splice(indexWap, 1);
						}
					});
				}
			});
		},
		setPcBidBatch() {
			if (this.customPcBid == '') {
				this.showAllMoneyHint = true;
				this.showAllMoneyTxt = '请输入出价';
			} else {
				this.selectKeywords.forEach((item) => {
					let isCon = this.selectRightKeywords.find((selItem) => {
						return item.id === selItem.id;
					});
					if (isCon) {
						item.pcBid = this.customPcBid;
					}
				});
				this.showMoneyBox = true;
			}
		},
		delKeyWordsBatch() {
			if (this.selectRightKeywords.length === 0) {
				this.showHintDel = true;
				return false;
			}
			let newArr = [];
			this.selectKeywords.forEach((item, index) => {
				let isCon = this.selectRightKeywords.find((selItem) => {
					return item.id === selItem.id;
				});
				if (isCon === undefined) {
					newArr.push(item);
				} else {
					this.resetKeywordChecked(item);
				}
			});
			this.selectKeywords = newArr;
		},
		deleteFromSeleteRightKeywords(keyword) {
			let index = -1;
			for (let i = 0; i < this.selectRightKeywords.length; i++) {
				let kw = this.selectRightKeywords[i];
				if (kw.id === keyword.id) {
					index = i;
					break;
				}
			}
			if (index > -1) {
				this.selectRightKeywords.splice(index, 1);
			}
		},
		delKeywordFromRight(index, keyword) {
			this.selectKeywords.splice(index, 1);
			this.resetKeywordChecked(keyword);
			this.deleteFromSeleteRightKeywords(keyword);
		},
		resetKeywordChecked(keyword) {
			for (let i = 0; i < this.keywords.length; i++) {
				if (this.keywords[i].id === keyword.id) {
					this.keywords[i].checked = false;
					break;
				}
			}
		},
		addCustomKeyWords(value, index) {
			let item = {
				id: '',
				checked: false,
				name: '',
				searchStar: 0,
				purchaseStar: 0,
				averagePrice: 0,
				pcBid: 0,
				source: 0,
				showHintPc: false,
				showHintPcTxt: '',
				showCustomInput: true,
				showHintKeywords: false,
				showHintKeywordsTxt: ''
			};
			this.selectKeywords.push(item);
		},
		requestKeywords(value, index) {
			if (value == '') {
				this.selectKeywords[index].showHintKeywords = true;
				this.selectKeywords[index].showHintKeywordsTxt = '请输入关键词';
			} else if (value.length > 50) {
				this.selectKeywords[index].showHintKeywords = true;
				this.selectKeywords[index].showHintKeywordsTxt = '关键词字数不超过50个汉字';
			} else {
				this.selectKeywords[index].showHintKeywords = false;
				this.selectKeywords[index].showHintKeywordsTxt = '';
				this.isConstum = false;
				Http.post('/api/keywords', {
					name: value
				}).then((res) => {
					if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
						this.selectKeywords[index].id = Number(res.data.data.id);
						this.selectKeywords[index].name = res.data.data.name;
						for(let i = 0; i < this.selectKeywords.length; i++) {
							if (i == index) {
								continue;
							}
							if (this.selectKeywords[index].id === this.selectKeywords[i].id) {
								this.isConstum = true;
							}
						}
						if (this.isConstum) {
							this.$message({
								message: '该关键词已存在，请添加其它关键词。',
								type: 'warning'
							});
						}
					} else if (res.data.code >= 500) {
						this.$message({
							message: '服务器异常，请稍后再试。',
							type: 'error',
							duration: 3000
						});
					} else {
						this.$message({
							message: '操作失败，请检查网络设置或稍后再试。',
							type: 'error'
						});
					}
				}).catch((error) => {
					console.log(error);
				});
			}
		},
		save() {
			let keyWordsArr = [];
		    if (this.selectKeywords.length > 0) {
		        for (var i = 0; i < this.selectKeywords.length; i++) {
		            if (!this.pcBidBlurCheck("pcBid-", i)) {
		                return;
					}
				}
		        for (var j = 0; j < this.selectKeywords.length; j++) {
		        	if (this.selectKeywords[j].showHintKeywords) {
		        		return;
		        	} else if (this.selectKeywords[j].name == '') {
		        		this.selectKeywords[j].showHintKeywords = true;
						this.selectKeywords[j].showHintKeywordsTxt = '请输入关键词';
		        		return;
		        	}
		        }

			}
		    if (this.isConstum) {
		    	this.$message({
					message: '已添加关键词列表中，存在重复关键词。',
					type: 'warning'
				});
				return;
		    }
		    if (this.isKeywordsNull) {
		    	return;
		    }
			if (this.selectKeywords.length > 200) {
				keyWordsArr = copyObj(this.selectKeywords.slice(0, 200));
			} else {
				keyWordsArr = copyObj(this.selectKeywords);
			}
			keyWordsArr.forEach((keyword) => {
				keyword.pcBid = floatMul(keyword.pcBid, 100);
				// keyword.averagePrice = floatMul(keyword.averagePrice, 100);
			});
			Event.$emit('drawer-save-add-keyword', keyWordsArr);
		},
		hide() {
			Event.$emit('drawer-hide-add-keyword');
		},
		pcBidMouseOutCheck(idPrefix, index) {
			var inputId = idPrefix + index;
			var value = this.blurCheck(inputId);
			this.selectKeywords[index].pcBid = value;
		},
		pcBidBlurCheck(idPrefix, index) {
			var inputId = idPrefix + index;
			var value = this.blurCheck(inputId);
			this.selectKeywords[index].pcBid = value;

			var result = this.limitedCondition("关键词[ ", " ]的PC端出价", this.selectKeywords[index].name, value);
			if (!result.success) {
				this.selectKeywords[index].showHintPc = true;
				this.selectKeywords[index].showHintPcTxt = result.msg;
			} else {
				this.selectKeywords[index].showHintPc = false;
				this.selectKeywords[index].showHintPcTxt = '';
			}

			return result.success;
		},
		batchPcBidMouseOutCheck(inputId) {
			var value = this.blurCheck(inputId);
			this.customPcBid = value;

			var result = this.limitedCondition("批量出价", "", "", value);
			this.batchPcBidFlag = !result.success;
		},
		batchPcBidBlurCheck(inputId) {
			var value = this.blurCheck(inputId);
			this.customPcBid = value;

			var result = this.limitedCondition("批量出价", "", "", value);
			if (!result.success) {
				this.$message({message: result.msg, type: 'error'});
			}

			this.batchPcBidFlag = !result.success;

			return result.success;
		},
		pcBidKeyUpCheck(idPrefix, index) {
			var inputId = idPrefix + index;
			var value = this.floatFormat(inputId);
			this.selectKeywords[index].pcBid = value;

		},
		batchPcBidKeyUpCheck(inputId) {
			var value = this.floatFormat(inputId);
			this.customPcBid = value;

			var result = this.limitedCondition("批量出价", "", "", value);
			this.batchPcBidFlag = !result.success;

		},

		blurCheck(inputId) {
			var value = document.getElementById(inputId).value;

			// 处理一个或者多个0开头 的字符
			if (value != 0) {
				value = value.replace(/^0+/, "");
			}
			if (value.indexOf(".") == 0) {
			    value = "0" + value;
			}
			// 处理以小数点结尾的字符
			value = value.replace(/\.$/, "");

			document.getElementById(inputId).value = value;

			return value;
		},
		floatFormat(inputId) {

			var value = document.getElementById(inputId).value;

			// 处理非数字 非小数点 的字符
			value = value.replace(/[^0-9\.]+/, "");
			// 处理以小数点开头的字符
			value = value.replace(/^\.+/, "");

			// 处理不小数点开头但出现多次小数点的字符
			var regObject = value.match(/\.+/g);
			var count = 0;
			if (regObject != null && regObject.length > 0) {
				for (var i = 0; i < regObject.length; i++) {
					count += regObject[i].length;
				}
			}

			if (value.indexOf(".") > 0) {
				if (count > 1) {
					value = value.substring(0, value.indexOf(".") + 1) + value.substring(value.indexOf(".")).replace(/\./g, "");
				}

				value = value.substring(0, value.indexOf(".") + 3);
			}

			document.getElementById(inputId).value = value;

			return value;
		},
		limitedCondition(prefix, suffix, name, value) {
		    var title = prefix + name + suffix;

			if (value === '') {
				return {"success": false, "msg": "请输入出价"};
			} else if (value < 0.30) {
				return {"success": false, "msg": "出价最小为0.30"};
			} else if (value > 999.99) {
				return {"success": false, "msg": "出价最大不超过999.99"};
			} else {
				return {"success": true, "msg": ""};
			}
		}
	},
	watch: {
		'search.type': {
			handler: function(value) {
				this.keywords = value === 0 ? this.getKeyWords.pc : this.getKeyWords.wap;
			},
			deep: true
		},
		'selectRightKeywords': function() {
			if (this.selectRightKeywords.length != 0) {
				this.showHintBatch = false;
				this.showHintDel = false;
			} else {
				this.showMoneyBox = true;
			}
		},
		'selectLeftKeywords': function() {
			if (this.selectLeftKeywords.length != 0) {
				this.showHintAdd = false;
			}
		}
	}
};
</script>
<style lang="less" scoped>
.btn {
	font-size: 14px;
}
.drawer-part{
	position: relative;
}
.inner-style {
	padding: 0 10px;
	margin-right: 15px;
}
.oper-link {
	color: #0090ec;
	&.action {
		cursor: pointer;
	}
	&.disable {
		color: #acafb4;
	}
}
.table-inner-error {
	display: inline-block;
	padding: 0;
	line-height: 1;
	margin-left: 10px;
	color: #ff4949;
}
.amp-form{
	.amp-bidcpc{
		width: 400px;
		float: left;
		height: 100%;
		overflow: auto;
		.bidcpc-text{
			margin: 10px 0;
			position: relative;
		}
		p.bidcpc-text-hint{
			color: #ff4949;
		}
	}
	.amp-bidcpc:first-child{
		width: 540px;
	}
	.amp-bidcpc-btn{
		width: 80px;
		margin: 80px 10px;
		float: left;
	}
	.amp-bidcpc:last-child{
		.bidcpc-inner:last-child{
			width:100%;
			position: absolute;
			bottom: 0;
			a{
				display: block;
				width:100%;
				height: 30px;
				border: 1px solid #d9dbde;
				border-radius: 5px;
				text-align: center;
				line-height: 30px;
				color: #89919c;
			}
		}
	}
}
.amp-form:after{
	content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
table{width: 100% !important;}
.amp-bidcpc-add{
	position: relative;
	padding: 20px 0;
	button{
		float: left;
	}
	p{
		width:432px;
		float: left;
		padding-left: 8px;
	}
}
.amp-bidcpc-del{
	padding-top: 13px;
	margin-bottom: 20px;
	position: relative;
	z-index: 2000;
	button{
		position: relative;
		float: left;
	}
	.batchBtn{
		display: block;
		width:88px;
		height: 35px;
		line-height: 35px;
		border: 1px solid #d9dbde;
		border-radius: 5px;
		text-align: center;
		float: right;
		color: #89919c;
		position: relative;
	}
	a.borderChangeColor{
		border-bottom: 1px solid #fff;
		border-radius: 5px 5px 0 0;
	}
	/*span:hover{
		border-bottom: 1px solid #fff;
	}
	span:hover .money-box{
		display: block;
	}*/
	.money-box{
		position: absolute;
		left: 0;
		top: 50px;
		width:340px;
		height: 80px;
		padding-top: 15px;
		padding-left: 15px;
		border: 1px solid #d9dbde;
		border-radius: 5px 0 5px 5px;
		background: #fff;
		z-index: -1;
	}
	.none{
		display: none;
	}
	.borderColor{
		border-color: #ff4949;
	}
}
</style>
