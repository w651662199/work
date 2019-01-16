<template>
	<div class="drawer">
		<div class="drawer-part">
			<h2 class="part-header">
				<span class="header-text">查看计划</span>
				<span class="header-fn"><em @click="closeDrawer()" class="icon icon-close"></em></span>
			</h2>
			<div class="part-form">
				<div class="form-column">
					<el-form :model="campaignData" ref="campaignForm" label-width="155px">
						<el-form-item label="推广组：" prop="groupId">
							<span>{{campaignData.groupName}}</span>
						</el-form-item>
						<el-form-item label="计费方式：" prop="saleMode">
							<span v-if="campaignData.saleMode === CONST.SALE_MODE.FIX_CPM">定价CPM</span>
							<span v-if="campaignData.saleMode === CONST.SALE_MODE.BID_CPM">竞价CPM</span>
						</el-form-item>
						<el-form-item label="投放方式：" prop="biddingMode">
							<span v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PDB">PDB</span>
							<span v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PD">PD</span>
							<span v-if="campaignData.biddingMode === CONST.BIDDING_MODE.RTB">RTB</span>
						</el-form-item>
						<el-form-item label="广告位：" prop="slots" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.RTB && campaignData.isLimitedSlot === 1">
							<span>不限</span>
						</el-form-item>
						<el-form-item label="广告位：" v-if="campaignData.slots.length > 0">
							<span class="form-text">已选择{{campaignData.slots.length}}个广告位</span>
							<div class="detail-row">
								<table class="table">
									<tbody>
										<tr>
											<th class="w140"><span>广告位名称</span></th>
											<th class="w140"><span>所属媒体</span></th>
											<th class="w140"><span>支持广告形式</span></th>
										</tr>
										<tr v-for="(item, index) in campaignData.slots">
											<td><span>{{item.name}}</span></td>
											<td><span>{{item.mediaName}}</span></td>
											<td><span v-html="getFormats(item.slotFormats)"></span></td>
										</tr>
									</tbody>
								</table>
							</div>
						</el-form-item>
						<el-form-item label="投放时间段：" prop="isUnlimited">
							<span>{{campaignData.startTime}} - </span>
							<span v-if="campaignData.isUnlimited === 1">不限</span>
							<span v-if="campaignData.isUnlimited !== 1">{{campaignData.endTime}}</span>
						</el-form-item>
						<el-form-item label="流量设置：" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PDB || campaignData.biddingMode === CONST.BIDDING_MODE.PD">
							<el-form-item label="采购总量" prop="amount" label-width="90px" style="margin-bottom: 20px" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PDB">
								<el-col :span="6" style="margin-right: 5px;">
									<span>{{campaignData.amount}}CPM</span>
								</el-col>
							</el-form-item>
							<el-form-item label="日预算" prop="dailyBudget" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PD" label-width="90px" style="margin-bottom: 20px">
								<el-col :span="6" style="margin-right: 5px;">
									<span>{{campaignData.dailyBudget}}元</span>
								</el-col>
							</el-form-item>
							<el-form-item label="合约单价" prop="price" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PDB || campaignData.biddingMode === CONST.BIDDING_MODE.PD" label-width="90px" style="margin-bottom: 20px">
								<el-col :span="6" style="margin-right: 5px;">
									<span>{{campaignData.price}}元/CPM</span>
								</el-col>
							</el-form-item>
							<el-form-item label="退量比" prop="returnPer" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PDB" label-width="90px" style="margin-bottom: 20px">
								<el-col :span="6" style="margin-right: 5px;">
									<span>{{campaignData.returnPer}}%</span>
								</el-col>
							</el-form-item>
						</el-form-item>
						<el-form-item label="流量设置：" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.RTB">
							<el-col :span="8" v-if="campaignData.dailyBudgetLimite === -1">
								<el-form-item prop="dailyBudgetLimite">
									<span>不限</span>
								</el-form-item>
							</el-col>
							<el-col :span="16" v-if="campaignData.dailyBudgetLimite !== -1">
								<el-form-item label="日预算：" prop="dailyBudget" label-width="70px">
									<el-col :span="12" style="margin-right: 5px;">
										<span>{{campaignData.dailyBudget}}元</span>
									</el-col>
								</el-form-item>
							</el-col>
						</el-form-item>
						<el-form-item label="托底素材：" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PDB && campaignData.materials.length > 0">
							<div class="detail-row">
								<table class="table">
									<tbody>
										<tr>
											<th><span>素材名称</span></th>
											<th width="90"><span>素材类型</span></th>
											<th width="90"><span>规格</span></th>
											<th width="90"><span>预览图</span></th>
										</tr>
										<tr v-for="(item, index) in campaignData.materials">
											<td><span>{{item.name}}</span></td>
											<td><span>{{getFormat(item.formatCategoryId)}}</span></td>
											<td><span>{{item.formatName}}</span></td>
											<td><span><img class="img-preview" v-for="image in item.images" :src="image"></span></td>
										</tr>
									</tbody>
								</table>
							</div>
						</el-form-item>
						<el-form-item label="推广计划名称：" prop="name" c>
							<span>{{campaignData.name}}</span>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
		<div class="drawer-btn">
			<button class="btn btn-gray" type="button" @click.prevent="closeDrawer">关闭</button>
		</div>
	</div>
</template>
<script>
import {mixin, floatMul} from 'utils/common';
import Event from 'event';
import moment from 'moment';
import Http from 'http';
import CONST from 'help/CONST.js';
export default {
	name: 'ViewCampaignDrawer',
	data() {
		return {
			campaignData: {
				groupName: '',
				name: '',
				groupId: '',
				saleMode: '',
				biddingMode: '',
				isUnlimited: 0,
				companyName:'',
				startTime: '',
				endTime: '',
				amount: '',
				price: '',
				returnPer: '',
				dailyBudget: '',
				dailyBudgetLimite: -1,
				isLimitedSlot: 1,
				slots: [],
				slotIds: [],
				materials: [],
				materialIds: [],
			},
			advertisements: [],
			groups: [],
			CONST: CONST,
			balance: ''
		};
	},
	props: ['campaignId'],
	created() {
		this.getCampaignData();
	},
	methods: {
		closeDrawer() {
			Event.$emit('closeViewCampaign');
		},
		getFormatId() {
			let formatIds = [];
			for (let slot of this.campaignData.slots) {
				for (let format of slot.slotFormats) {
					formatIds.push(format.formatId);
				}
			}
			return formatIds;
		},
		getGroupName() {
			Http.get('/api/group?groupId=' + this.campaignData.groupId).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.campaignData.groupName = res.data.data.name;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getCampaignData() {
			Http.get('/api/campaign?campaignId=' + this.campaignId).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.campaignData = mixin(this.campaignData, res.data.data);
					this.campaignData.price = floatMul(res.data.data.price, 0.01);
					this.campaignData.startTime = moment(this.campaignData.startTime).format('YYYY/MM/DD');
					if (this.campaignData.isUnlimited !== 1) {
						this.campaignData.endTime = moment(this.campaignData.endTime).format('YYYY/MM/DD');
					}
					if (this.campaignData.biddingMode === CONST.BIDDING_MODE.RTB) {
						if (this.campaignData.dailyBudget === -1) {
							this.campaignData.dailyBudgetLimite = -1;
							this.campaignData.dailyBudget = '';
						} else {
							this.campaignData.dailyBudgetLimite = 0;
							this.campaignData.dailyBudget = floatMul(res.data.data.dailyBudget, 0.01);
						}
					} else {
						this.campaignData.dailyBudget = floatMul(res.data.data.dailyBudget, 0.01);
					}
					this.getGroupName();
					this.getSlots();
					if (this.campaignData.materialIds.length > 0) {
						this.getMaterials();
					}
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
		getSlots() {
			if (this.campaignData.slotIds.length === 0) return false;
			Http.get('/api/slots/batch?slotIds=' + this.campaignData.slotIds.join(',')).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.campaignData.slots = res.data.data;
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
		getMaterials() {
			Http.get('/api/materials/batch?materialIds=' + this.campaignData.materialIds.join(',')).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					let materials = [];
					for (let material of res.data.data) {
						material.images = material.images ? material.images.split(',') : [];
						materials.push(material);
					}
					this.campaignData.materials = materials;
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
		biddingModeChange() {
			if (!this.isModify) {
				this.campaignData.amount = '';
				this.campaignData.price = '';
				this.campaignData.dailyBudget = '';
				this.campaignData.dailyBudgetLimite = -1;
				this.campaignData.returnPer = '';
				this.campaignData.slots = [];
			}
		},
		getFormat(formatCategoryId) {
			let formats = [];
			if (formatCategoryId === CONST.FORMAT_CATEGORY.NATIVE) {
				return '原生';
			}
			if (formatCategoryId === CONST.FORMAT_CATEGORY.DOWNLOAD) {
				return '应用下载';
			}
			if (formatCategoryId === CONST.FORMAT_CATEGORY.VIDEO) {
				return '视频';
			}
			if (formatCategoryId === CONST.FORMAT_CATEGORY.IMAGE) {
				return '图片';
			}
			return '';
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
		}
	}
};
</script>