<template>
	<div  class="drawer">
		<div class="drawer-part">
			<h2 class="part-header">
				<span class="header-text">添加广告位</span>
				<span class="header-fn"><em @click.prevent="closeDrawer" class="icon icon-close"></em></span>
			</h2>
			<div class="part-form" style="width: 800px;">
				<div class="form-column">
					<div class="query-information">
						<div class="information-fn">
							<div class="fn-item">
								<span>媒体：</span>
								<el-select v-model="searchParams.mediaId" style="width:130px;display:inline-block;" placeholder="全部">
									<el-option v-for="media of searchParams.mediaOptions" :label="media.name" :value="media.mediaId"></el-option>
								</el-select>
							</div>
							<div class="fn-item">
								<el-input v-model="searchParams.keyword" placeholder="搜索广告位" style="width:170px;display:inline-block;"></el-input>
							</div>
							<div class="fn-item">
								<button class="btn btn-blue" type="button" @click.prevent="search">搜索</button>
							</div>
						</div>
					</div>
					<div class="data-table" id="JS_slot_list">
						<div class="table-content">
							<div class="main-table-wapper">
								<table class="table main-table">
									<thead>
										<tr>
											<th class="w40">
												<span><em class="icon" :class="{'icon-select': !isAllSelect, 'icon-selected': isAllSelect}" v-if="biddingMode === CONST.BIDDING_MODE.RTB" @click="selectAll"></em></span>
											</th>
											<th class="w140"><span>广告位名称</span></th>
											<th class="w80"><span>媒体类型</span></th>
											<th class="w80"><span>所属媒体</span></th>
											<th class="w80"><span>支持广告形式</span></th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="item in list">
											<td>
												<span>
													<em class="icon" :class="{'icon-select': !item.checked, 'icon-selected': item.checked}" v-if="biddingMode === CONST.BIDDING_MODE.RTB" @click="selectSlot(item)"></em>
													<el-radio v-model="radioSlotId" :label="item.slotId" v-if="biddingMode !== CONST.BIDDING_MODE.RTB"></el-radio>
												</span>
											</td>
											<td><span>{{item.name}}</span></td>
											<td><span>{{getMediaType(item.mediaType)}}</span></td>
											<td><span>{{item.mediaName}}</span></td>
											<td><span v-html="getFormats(item.slotFormats)"></span></td>
										</tr>
									</tbody>
								</table>
								<p class="no-content" v-if="list.length === 0">无相关查询结果</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<el-pagination
				@current-change="currentPageChange"
				:current-page="page.currentPage"
				:page-size="page.pageSize"
				layout="total, prev, pager, next"
				:total="page.totalCount"
				:class="{'el-pagination-reset': true}">
			</el-pagination>
		</div>
		<div class="drawer-btn">
			<button class="btn btn-blue" type="button" @click.prevent="save">保存</button>
			<button class="btn btn-gray" type="button" @click.prevent="closeDrawer">取消</button>
		</div>
	</div>
</template>
<script>
import Event from 'event';
import Http from 'http';
import CONST from 'help/CONST.js';
export default {
	name: 'slotDrawer',
	props: ['saleMode', 'biddingMode', 'slots'],
	data() {
		return {
			CONST: CONST,
			searchParams: {
				keyword: '',
				mediaId: -2,
				mediaOptions: [{
					name: '全部',
					mediaId: -2
				}]
			},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSize: 20
			},
			list: [],
			allSlots: [],
			querySlots: [],
			radioSlotId: ''
		};
	},
	computed: {
		isAllSelect() {
			let isSelect = true;
			for (let slot of this.list) {
				if (!slot.checked) {
					isSelect = false;
					break;
				}
			}
			return isSelect;
		}
	},
	created() {
		this.getSlotList();
	},
	methods: {
		getSlotIds() {
			let slotIds = [];
			for (let slot of this.slots) {
				slotIds.push(slot.slotId);
			}
			return slotIds;
		},
		search() {
			if (this.page.currentPage === 1) {
				this.getList();
			} else {
				this.page.currentPage = 1;
			}
		},
		getList() {
			let list = [];
			list = this.queryWithMedia();
			list = this.queryWithKeyword(list);
			this.querySlots = list;
			let startIndex = (this.page.currentPage - 1) * this.page.pageSize;
			this.list = list.slice(startIndex, startIndex + this.page.pageSize);
			this.page.totalCount = this.querySlots.length;
			let slotIds = this.getSlotIds();
			for (let slot of this.list) {
				let isChecked = slotIds.indexOf(slot.slotId) > -1;
				this.$set(slot, 'checked', isChecked);
				if (isChecked && this.biddingMode !== CONST.BIDDING_MODE.RTB) {
					this.radioSlotId = slot.slotId;
				}
			}
		},
		queryWithMedia() {
			let list = [];
			if (this.searchParams.mediaId !== -2) {
				for (let slot of this.allSlots) {
					if (slot.mediaId === this.searchParams.mediaId) {
						list.push(slot);
					}
				}
			} else {
				list = this.allSlots;
			}
			return list;
		},
		queryWithKeyword(slots) {
			let list = [];
			if (this.searchParams.keyword !== '') {
				for (let slot of slots) {
					let name = slot.name.toLowerCase();
					let keyword = this.searchParams.keyword.toLowerCase();
					if (name.indexOf(keyword) > -1) {
						list.push(slot);
					}
				}
			} else {
				list = slots;
			}
			return list;
		},
		getSlotList() {
			Http.get('/api/slots/summary').then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					let mediaMap = this.getMedia(res.data.data.medias);
					let slotIds = this.getSlotIds();
					for (let slot of res.data.data.slots) {
						if (slot.saleModes.indexOf(this.saleMode) > -1 && slot.biddingModes.indexOf(this.biddingMode) > -1) {
							let media = mediaMap.get('M_' + slot.mediaId);
							if (media) {
								this.$set(slot, 'mediaType', media.type);
								this.$set(slot, 'mediaName', media.name);
							}
							this.allSlots.push(slot);
						}
					}
					this.searchParams.mediaOptions = [{name: '全部', mediaId: -2}, ...res.data.data.medias];
					this.getList();
				} else {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 3000
					});
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getMedia(medias) {
			let mediaMap = new Map();
			for (let media of medias) {
				let key = 'M_' + media.mediaId;
				mediaMap.set(key, media);
			}
			return mediaMap;
		},
		getMediaType(type) {
			if (type === CONST.MEDIA_TYPE.APP) {
				return 'APP';
			} else if (type === CONST.MEDIA_TYPE.WEB) {
				return '网站';
			}
			return '';
		},
		getFormats(slotFormats) {
			let formats = [];
			for (let format of slotFormats) {
				if (format.formatCategoryId === CONST.FORMAT_CATEGORY.NATIVE && !formats.includes('原生')) {
					formats.push('原生');
				} else if (format.formatCategoryId === CONST.FORMAT_CATEGORY.DOWNLOAD && !formats.includes('应用下载')) {
					formats.push('应用下载');
				} else if (format.formatCategoryId === CONST.FORMAT_CATEGORY.VIDEO && !formats.includes('视频')) {
					formats.push('视频');
				} else if (format.formatCategoryId === CONST.FORMAT_CATEGORY.IMAGE && !formats.includes('图片')) {
					formats.push('图片');
				}
			}
			return formats.join('<br/>');
		},
		selectSlot(slot) {
			slot.checked = !slot.checked;
		},
		selectAll() {
			let isAllSelect = this.isAllSelect;
			for (let slot of this.list) {
				slot.checked = !isAllSelect;
			}
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getList();
		},
		save() {
			let slots = [];
			for (let slot of this.list) {
				if (this.biddingMode === CONST.BIDDING_MODE.RTB) {
					if (slot.checked) {
						slots.push(slot);
					}
				} else if (slot.slotId === this.radioSlotId) {
					slots.push(slot);
					break;
				}
			}
			Event.$emit('closeSlotDrawer', slots);
		},
		closeDrawer() {
			Event.$emit('closeSlotDrawer');
		}
	}
};
</script>
