<template>
	<div  class="drawer">
		<div class="drawer-part">
			<h2 class="part-header">
				<span class="header-text">查看人群</span>
				<span class="header-fn"><em @click.prevent="closeDrawer" class="icon icon-close"></em></span>
			</h2>
			<div class="part-form" style="width: 800px;">
				<div class="form-column">
					<el-form :model="crowdData" ref="crowdForm" label-width="100px">
						<el-form-item label="人群名称：" prop="name">
							<span>{{crowdData.name}}</span>
						</el-form-item>
						<p class="sub-item-title" v-if="orTags.length > 0 || andTags.length > 0">人群包含的标签</p>
						<el-form-item v-if="orTags.length > 0">
							<div class="tag-box">
								<p>标签之间的关系：或者</p>
								<div class="tag-list">
									<template v-for="(tag, index) in orTags">
										<span
											class="tag-item"
										>
											{{tag.name}}
											<template v-if="tag.platformTagId">
												:
												<template v-for="(p, pIndex) in tag.platformTagOptions">
													{{p.value}}{{pIndex < tag.platformTagOptions.length -1 ? '、' : ''}}
												</template>
											</template>
										</span>
										<span class="tag-span" v-if="index < orTags.length - 1">或者</span>
									</template>
								</div>
							</div>
						</el-form-item>
						<el-form-item v-if="andTags.length > 0">
							<div class="tag-box">
								<p>标签之间的关系：并且</p>
								<div class="tag-list">
									<template v-for="(tag, index) in andTags">
										<span
											class="tag-item"
										>
											{{tag.name}}
											<template v-if="tag.platformTagId">
												:
												<template v-for="(p, pIndex) in tag.platformTagOptions">
													{{p.value}}{{pIndex < tag.platformTagOptions.length -1 ? '、' : ''}}
												</template>
											</template>
										</span>
										<span class="tag-span" v-if="index < andTags.length - 1">并且</span>
									</template>
								</div>
							</div>
						</el-form-item>
						<p class="sub-item-title" v-if="notTags.length > 0">人群排除的标签</p>
						<el-form-item v-if="notTags.length > 0">
							<div class="tag-box">
								<p class="tag-box-title">标签之间的关系：{{crowdData.logicType === CONST.CROWD_LOGIC.OR ? '或者' : '并且'}}</p>
								<div class="tag-list">
									<template v-for="(tag, index) in notTags">
										<span
											class="tag-item"
										>
											{{tag.name}}
											<template v-if="tag.platformTagId">
												:
												<template v-for="(p, pIndex) in tag.platformTagOptions">
													{{p.value}}{{pIndex < tag.platformTagOptions.length -1 ? '、' : ''}}
												</template>
											</template>
										</span>
										<span class="tag-span" v-if="index < notTags.length - 1">{{crowdData.logicType === CONST.CROWD_LOGIC.OR ? '或者' : '并且'}}</span>
									</template>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="引用单元：">
							<span v-if="crowdData.flights.length === 0">无</span>
							<div class="detail-row" v-if="crowdData.flights.length > 0">
								<table class="table">
									<tbody>
										<tr>
											<th class="w60"><span>单元ID</span></th>
											<th class="w140"><span>单元名称</span></th>
											<th class="w100"><span>所属计划</span></th>
										</tr>
										<tr v-for="(item, index) in crowdData.flights">
											<td><span>{{item.flightId}}</span></td>
											<td><span><i class="ellipsis">{{item.name}}</i></span></td>
											<td><span><i class="ellipsis">{{item.campaignName}}</i></span></td>
										</tr>
									</tbody>
								</table>
							</div>
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
import Event from 'event';
import Http from 'http';
import CONST from 'help/CONST.js';
import {mixin, copyObj} from 'utils/common';
export default {
	name: 'ViewCrowdDrawer',
	props: ['crowdId'],
	data() {
		return {
			CONST: CONST,
			crowdData: {
				crowdId: 0,
				name: '',
				type: 1,
				logicType: CONST.CROWD_LOGIC.OR,
				crowdGroups: [],
				flights: []
			},
			andTags: [],
			orTags: [],
			notTags: []
		};
	},
	created() {
		this.getData();
	},
	methods: {
		getData() {
			Http.get('/api/crowd?crowdId=' + this.crowdId).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.crowdData = mixin(this.crowdData, res.data.data);
					this.getTags();
					this.getPlatformTags();
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
		getTags() {
			let tagIds = [];
			for (let group of this.crowdData.crowdGroups) {
				for (let tag of group.crowdTags) {
					if (tag.isPlatform === 0) {
						tagIds.push(tag.tagId);
					}
				}
			}
			Http.get('/api/tags/batch?tagIds=' + tagIds.join(',')).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					let tagMap = this.getTagMap(res.data.data);
					for (let group of this.crowdData.crowdGroups) {
						if (group.type === CONST.CROWD_TYPE.NOT) {
							this.crowdData.logicType = group.logic;
						}
						for (let tag of group.crowdTags) {
							if (tag.isPlatform === 0) {
								let t = tagMap['T_' + tag.tagId];
								if (group.type === CONST.CROWD_TYPE.AND) {
									this.andTags.push(t);
								} else if (group.type === CONST.CROWD_TYPE.OR) {
									this.orTags.push(t);
								} else {
									this.notTags.push(t);
								}
							}
						}
					}
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getPlatformTags() {
			Http.get('/api/platform/tags').then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					let tagMap = this.getPlatformTagMap(res.data.data.list);
					for (let group of this.crowdData.crowdGroups) {
						for (let tag of group.crowdTags) {
							if (tag.isPlatform === 1) {
								let tagObj = tagMap['PT_' + tag.tagId];
								let t = copyObj(tagObj);
								t.platformTagOptions = [];
								for (let pto of tagObj.platformTagOptions) {
									if (tag.platformTagOptionIds.indexOf(pto.platformTagOptionId) > -1) {
										t.platformTagOptions.push(pto);
									}
								}
								if (group.type === CONST.CROWD_TYPE.AND) {
									this.andTags.push(t);
								} else if (group.type === CONST.CROWD_TYPE.OR) {
									this.orTags.push(t);
								} else {
									this.notTags.push(t);
								}
							}
						}
					}
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getTagMap(tags) {
			let tagMap = [];
			for (let tag of tags) {
				let key = 'T_' + tag.tagId;
				tagMap[key] = tag;
			}
			return tagMap;
		},
		getPlatformTagMap(tags) {
			let tagMap = [];
			for (let tag of tags) {
				let key = 'PT_' + tag.bigdataId;
				tagMap[key] = tag;
			}
			return tagMap;
		},
		closeDrawer() {
			Event.$emit('closeCrowdDrawer');
		}
	}
};
</script>
<style scoped>
	.tag-box .tag-item {
		padding-right: 4px;
	}
</style>
