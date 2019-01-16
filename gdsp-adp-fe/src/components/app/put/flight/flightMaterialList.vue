<template>
	<div>
		<div class="crumbs">
			<a href="#/app/put/campaign"><span class="">推广计划</span></a>&gt;<a :href="'#/app/put/flight/' + campaignId"><span class="">推广单元</span></a>&gt;<span class="crumbs-selected">推广创意</span>
		</div>
		<div class="query-information">
			<el-popover ref="popover1" placement="bottom" width="260" trigger="click">
				<div class="el-custom-con">
					<div class="el-custom-con_wrap">
						<ul class="el-custom-con_list">
							<ul class="el-custom-group_wrap" v-for="group in customHeaders">
								<li class="el-custom-group_wrap-title">{{group.title}}</li>
								<li>
									<ul class="el-custom-group" v-for="item in group.fields">
										<li :class="{'el-custom-dropdown__item': true, selected: item.checked}" @click="item.checked = !item.checked"><span>{{item.msg}}</span></li>
									</ul>
								</li>
							</ul>
						</ul>
					</div>
				</div>
			</el-popover>
			<div class="information-fn">
				<div class="fn-item">
					<button class="btn btn-blue" type="button" @click.prevent="showMaterialDrawer">选择创意库中创意</button>
				</div>
				<div class="fn-item">
					<button class="btn btn-blue" type="button" @click.prevent="newMaterial">新建创意</button>
				</div>
				<div class="fn-item">
					<button class="btn btn-blue-simple" type="button" @click.prevent="unBind">解除关联</button>
				</div>
				<div class="fn-item">
					<el-input v-model="searchParams.keyword" placeholder="搜索创意" style="width:170px;display:inline-block;"></el-input>
				</div>
				<div class="fn-item">
					<button class="btn btn-blue" type="button" @click.prevent="search">搜索</button>
				</div>
				<div class="fn-item" style="float:right;padding: 8px 10px;border: 1px solid #c0ccda;border-radius:4px;cursor: pointer;">
					<span v-popover:popover1>自定义指标</span>
				</div>
			</div>
			<div class="information-fn">
				<div class="fn-item">
					<span>创意状态：</span>
					<el-select v-model="searchParams.status" style="width:130px;display:inline-block;" placeholder="请选择">
						<el-option v-for="status of searchParams.statusOptions" :label="status.label" :value="status.value"></el-option>
					</el-select>
				</div>
				<div class="fn-item">
					<span>创意类型：</span>
					<el-select v-model="searchParams.formatCategoryId" style="width:130px;display:inline-block;" placeholder="全部" @change="formatCategoryChange">
						<el-option v-for="formatCategory of searchParams.formatCategoryOptions" :label="formatCategory.label" :value="formatCategory.value"></el-option>
					</el-select>
				</div>
				<div class="fn-item">
					<span>创意形式：</span>
					<el-select v-model="searchParams.formatId" style="width:130px;display:inline-block;" placeholder="全部">
						<el-option v-for="format of searchParams.formatOptions" v-if="format.isAppendMaterial !== 1" :label="format.name" :value="format.formatId"></el-option>
					</el-select>
				</div>
			</div>
		</div>
		<div class="data-table" id="JS_material_material_list">
			<div class="table-content">
				<div class="main-table-wapper">
					<table class="table main-table">
						<thead>
							<tr>
								<th class="w40"><span><em class="icon" :class="{'icon-select': !isAllSelect, 'icon-selected': isAllSelect}" @click="selectAll"></em></span></th>
								<th class="w140"><span>创意名称</span></th>
								<th class="w80"><span>创意状态</span></th>
								<th class="w80"><span>创意类型</span></th>
								<th class="w80"><span>创意形式</span></th>
								<th class="w90"><span>预览</span></th>
								<template v-for="headerGroup of customHeaders">
									<th v-for="item of headerGroup.fields" v-show="item.checked" class="w80">
										<span>{{item.msg}}</span>
									</th>
								</template>
							</tr>
						</thead>
						<tbody>
							<tr v-for="material in list" :key="material.groudId">
								<td><span><em class="icon" :class="{'icon-select': !material.checked, 'icon-selected': material.checked}" @click="selectMaterial(material)"></em></span></td>
								<td><span :title="material.name"><i class="ellipsis">{{material.name}}</i></span></td>
								<td><span>{{getApproveStatus(material.approveStatus)}}</span></td>
								<td><span>{{getFormat(material.formatCategoryId)}}</span></td>
								<td><span>{{material.formatName}}</span></td>
								<td><span><img class="img-preview" v-for="image in material.images" :src="image"></span></td>
								<template v-for="headerGroup of customHeaders">
									<td v-for="item of headerGroup.fields" v-show="item.checked" class="w80">
										<span>{{material[item.label] != 'undefine' ? material[item.label] : '-'}}</span>
									</td>
								</template>
							</tr>
						</tbody>
					</table>
					<p class="no-content" v-if="list.length === 0">无相关查询结果</p>
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
		<el-dialog :title="dialogData.title" v-model="dialogData.dialogVisible" size="tiny">
			<h3>{{dialogData.message}}</h3>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogData.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogHandler">确 定</el-button>
			</span>
		</el-dialog>
		<transition name="fade">
			<div style="z-index:1200;" class="master" v-show="isShowMaterialDrawer"></div>
		</transition>
		<transition name="drawer">
			<material-drawer v-if="isShowMaterialDrawer" :type="'flight'" :flightId="flightId" :campaignId="campaignId"></material-drawer>
		</transition>
	</div>
</template>
<script>
import actions from 'actions';
import Http from 'http';
import CONST from 'help/CONST.js';
import Event from 'event';
import MaterialDrawer from '../addMaterialDrawer.vue';
import {
	floatMul
} from 'utils/common';
export default {
	name: 'FlightMaterialList',
	data() {
		return {
			customHeaders: [{
				title: '指标',
				fields: [
					{msg: '竞价次数', checked: false, label: 'bidCount'},
					{msg: '获胜次数', checked: false, label: 'winCount'},
					{msg: '获胜率', checked: false, label: 'winRate'},
					{msg: '展示量', checked: true, label: 'pv'},
					{msg: '点击量', checked: true, label: 'clickCount'},
					{msg: '总花费', checked: true, label: 'totalFee'},
					{msg: '平均点击单价', checked: true, label: 'acp'},
					{msg: '平均CPM单价', checked: true, label: 'cpm'},
					{msg: '点击率', checked: true, label: 'ctr'}
				]}
			],
			list: [],
			searchParams: {
				keyword: '',
				status: -2,
				formatCategoryId: -2,
				formatId: -2,
				statusOptions: [{
					label: '全部',
					value: -2
				}, {
					label: '审核通过',
					value: CONST.MATERIAL_APPROVE_STATUS.APPROVED
				}, {
					label: '审核不通过',
					value: CONST.MATERIAL_APPROVE_STATUS.REJECT
				}, {
					label: '待审核',
					value: CONST.MATERIAL_APPROVE_STATUS.APPROVING
				}],
				formatCategoryOptions: [{
					label: '全部',
					value: -2
				}, {
					label: '原生',
					value: CONST.FORMAT_CATEGORY.NATIVE
				}, {
					label: '应用下载',
					value: CONST.FORMAT_CATEGORY.DOWNLOAD
				}, {
					label: '视频',
					value: CONST.FORMAT_CATEGORY.VIDEO
				}, {
					label: '图片',
					value: CONST.FORMAT_CATEGORY.IMAGE
				}],
				formatOptions: [{
					name: '全部',
					formatId: -2
				}]
			},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSize: 20
			},
			isShowMaterialDrawer: false,
			dialogData: {
				dialogVisible: false,
				body_html: '',
				title: '',
				sureHandler: null
			},
			campaignId: '',
			formats: []
		};
	},
	computed: {
		flightId() {
			return +this.$route.params.id;
		},
		isAllSelect() {
			let isSelect = true;
			for (let material of this.list) {
				if (!material.checked) {
					isSelect = false;
					break;
				}
			}
			return isSelect;
		},
		selectMaterialIds() {
			let ids = [];
			for (let material of this.list) {
				if (material.checked) {
					ids.push(material.materialId);
				}
			}
			return ids;
		}
	},
	watch: {
		isShowMaterialDrawer: function(val) {
			if (val) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		}
	},
	components: {
		MaterialDrawer
	},
	created() {
		this.getFlight();
		this.getList();
		this.getAllFormats();
	},
	mounted() {
		Event.$off("put-save-success");
		Event.$on("put-save-success", () => {
			this.getList();
		});
		Event.$off('closeMaterialDrawer');
		Event.$on('closeMaterialDrawer', () => {
			this.isShowMaterialDrawer = false;
			this.getList();
		});
	},
	methods: {
		showMaterialDrawer() {
			this.isShowMaterialDrawer = true;
		},
		getFlight() {
			Http.get('/api/flight?flightId=' + this.flightId).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.campaignId = res.data.data.campaignId;
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
		newMaterial() {
			actions.controlDrawer(this.$store, {
				show: true,
				action: 'new',
				type: 'material',
				config: {flightId: this.flightId, campaignId: this.campaignId}
			});
		},
		search() {
			if (this.page.currentPage === 1) {
				this.getList();
			} else {
				this.page.currentPage = 1;
			}
		},
		getList() {
			Http.get('/api/materials', {
				params: {
					keyword: this.searchParams.keyword,
					flightId: this.flightId,
					approveStatus: this.searchParams.status,
					formatCategoryId: this.searchParams.formatCategoryId,
					formatId: this.searchParams.formatId,
					page: this.page.currentPage,
					number: this.page.pageSize
				}
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.list = res.data.data.list;
					this.page.totalCount = res.data.data.totalCount;
					this.getReport();
					for (let material of this.list) {
						if (material.images) {
							material.images = material.images.split(',');
						}
						this.$set(material, 'checked', false);
					}
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getReport() {
			if (this.list.length === 0) return;
			let materialIds = [];
			for (let material of this.list) {
				materialIds.push(material.materialId);
			}
			Http.get('/api/report/materials/batch', {
				params: {
					flightId: this.flightId,
					materialIds: materialIds.join(',')
				}
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					let materilaMap = this.getReportMap(res.data.data);
					for (let material of this.list) {
						let report = materilaMap['M_' + material.materialId];
						if (report) {
							this.$set(material, 'bidCount', report.bidCount);
							this.$set(material, 'winCount', report.winCount);
							this.$set(material, 'winRate', this.getWinRate(report.winCount, report.bidCount));
							this.$set(material, 'pv', report.pv);
							this.$set(material, 'clickCount', report.clickCount);
							this.$set(material, 'totalFee', this.getCurFmt(report.totalFee).toFixed(2));
							this.$set(material, 'acp', this.getAvgClickPrice(this.getCurFmt(report.totalFee), report.clickCount));
							this.$set(material, 'cpm', this.getAvgMillPrice(this.getCurFmt(report.totalFee), report.pv));
							this.$set(material, 'ctr', this.getCtr(report.clickCount, report.pv));
						}
					}
				}
			});
		},
		getReportMap(data) {
			let map = [];
			for (let material of data) {
				let key = 'M_' + material.materialId;
				map[key] = material;
			}
			return map;
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getList();
		},
		selectAll() {
			let isAllSelect = this.isAllSelect;
			for (let material of this.list) {
				material.checked = !isAllSelect;
			}
		},
		selectMaterial(material) {
			material.checked = !material.checked;
		},
		unBind() {
			if (this.selectMaterialIds.length === 0) return;
			this.dialogData.message = '是否解除关联所选创意？';
			this.dialogData.sureHandler = this.doUnBind;
			this.dialogData.dialogVisible = true;
		},
		doUnBind() {
			Http.put('/api/flight/material/remove', {
				flightId: this.flightId,
				materialIds: this.selectMaterialIds
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.$message({
						type: 'success',
						message: '解除关联成功',
						duration: 3000
					});
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
		dialogHandler() {
			this.dialogData.sureHandler();
			this.closeDialog();
		},
		closeDialog() {
			this.dialogData.message = '';
			this.dialogData.sureHandler = null;
			this.dialogData.dialogVisible = false;
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
		getApproveStatus(status) {
			if (status === CONST.MATERIAL_APPROVE_STATUS.APPROVING) {
				return '待审核';
			} else if (status === CONST.MATERIAL_APPROVE_STATUS.APPROVED) {
				return '审核通过';
			} else if (status === CONST.MATERIAL_APPROVE_STATUS.REJECT) {
				return '审核未通过';
			}
			return '';
		},
		getAllFormats() {
			Http.get('/api/formats').then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					for (let format of res.data.data) {
						this.formats.push({formatId: format.formatId, formatCategoryId: format.formatCategoryId, name: format.name, isAppendMaterial: format.isAppendMaterial});
					}
					this.searchParams.formatOptions = [...this.searchParams.formatOptions, ...this.formats];
				}
			}).catch(err => {
				console.log(err);
			});
		},
		formatCategoryChange() {
			this.searchParams.formatOptions = [{formatId: -2, name: '全部'}];
			if (this.searchParams.formatCategoryId === -2) {
				this.searchParams.formatOptions = [...this.searchParams.formatOptions, ...this.formats];
			} else {
				this.searchParams.formatId = -2;
				let formats = [];
				for (let format of this.formats) {
					if (format.formatCategoryId === this.searchParams.formatCategoryId) {
						this.searchParams.formatOptions.push(format);
					}
				}
			}
		}
	}
};
</script>