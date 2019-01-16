<template>
	<div>
		<div class="query-information">
			<div class="information-fn">
				<div class="fn-item">
					<button class="btn btn-blue" type="button" @click.prevent="newMaterial">新建创意</button>
				</div>
				<div class="fn-item">
					<button class="btn btn-blue-simple" type="button" @click.prevent="deleteMaterials">删除</button>
				</div>
				<div class="fn-item">
					<el-input v-model="searchParams.keyword" placeholder="搜索创意" style="width:170px;display:inline-block;"></el-input>
				</div>
				<div class="fn-item">
					<button class="btn btn-blue" type="button" @click.prevent="search">搜索</button>
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
						<el-option v-for="format of searchParams.formatOptions" :label="format.name" :value="format.formatId" v-if="format.isAppendMaterial !== 1"></el-option>
					</el-select>
				</div>
			</div>
		</div>
		<div class="data-table" id="JS_material_list">
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
								<th class="w80"><span>引用单元数量</span></th>
								<th class="w80"><span>操作</span></th>
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
								<td><span>{{material.flightCount}}</span></td>
								<td><span><a href="javascript:void(0)" v-if="isShowModify(material.approveStatus)" @click.prevent="modify(material)">编辑</a></span></td>
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
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="dialogHandler">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import actions from 'actions';
import Http from 'http';
import CONST from 'help/CONST.js';
import Event from 'event';
export default {
	name: 'MaterialList',
	data() {
		return {
			list: [],
			searchParams: {
				keyword: '',
				formatCategoryId: -2,
				status: -2,
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
			dialogData: {
				dialogVisible: false,
				body_html: '',
				title: '',
				sureHandler: ''
			},
			formats: []
		};
	},
	computed: {
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
	created() {
		this.getList();
		this.getAllFormats();
	},
	mounted() {
		Event.$off("put-save-success");
		Event.$on("put-save-success", () => {
			this.getList();
		});
	},
	methods: {
		newMaterial() {
			actions.controlDrawer(this.$store, {
				show: true,
				action: 'new',
				type: 'material',
				config: {}
			});
		},
		modify(material) {
			actions.controlDrawer(this.$store, {
				show: true,
				action: 'modify',
				type: 'material',
				config: {materialId: material.materialId}
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
					approveStatus: this.searchParams.status,
					formatCategoryId: this.searchParams.formatCategoryId,
					formatId: this.searchParams.formatId,
					page: this.page.currentPage,
					number: this.page.pageSize
				}
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.list = res.data.data.list;
					for (let material of this.list) {
						if (material.images) {
							material.images = material.images.split(',');
						}
						this.$set(material, 'checked', false);
					}
					this.page.totalCount = res.data.data.totalCount;
				}
			}).catch(err => {
				console.log(err);
			});
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
		deleteMaterials() {
			let materialIds = [];
			for (let material of this.list) {
				if (material.checked) {
					if (material.flightCount !== 0) {
						this.dialogData.message = '只有未被引用的创意才可以删除！';
						this.dialogData.sureHandler = this.closeDialog;
						this.dialogData.dialogVisible = true;
						return;
					} else {
						materialIds.push(material.materialId);
					}
				}
			}
			if (materialIds.length === 0) return;
			this.materialIds = materialIds;
			this.dialogData.message = '确定要删除选中创意吗？';
			this.dialogData.sureHandler = this.deleteMaterialsHandler;
			this.dialogData.dialogVisible = true;
		},
		deleteMaterialsHandler() {
			Http.delete('/api/material', {
				data: {
					materialIds: this.materialIds
				}
			}).then(res => {
				if (res.data.code !== 200 || res.data.iserror !== 0) {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 3000
					});
				} else {
					this.getList();
					this.materialIds = [];
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
		isShowModify(status) {
			return status !== CONST.MATERIAL_APPROVE_STATUS.APPROVING;
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