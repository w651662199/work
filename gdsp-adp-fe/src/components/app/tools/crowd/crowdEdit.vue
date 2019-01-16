<template>
	<div style="padding:20px 20px 150px 20px;background: #fff;">
		<div class="el-popover popover-box" x-placement="bottom" ref="popover" v-show="isShowTooltip">
			<p class="item" @click="moveTag(CONST.CROWD_TYPE.OR)" v-show="popoverType !== CONST.CROWD_TYPE.OR">移动到“包含标签（关系：或者）”</p>
			<p class="item" @click="moveTag(CONST.CROWD_TYPE.AND)" v-show="popoverType !== CONST.CROWD_TYPE.AND">移动到“包含标签（关系：并且）”</p>
			<p class="item" @click="moveTag(CONST.CROWD_TYPE.NOT)" v-show="popoverType !== CONST.CROWD_TYPE.NOT">移动到“排除标签”</p>
			<div x-arrow="" class="popper__arrow"></div>
		</div>
		<div class="crumbs">
			<a href="#/app/tool/crowd"><span class="">人群管理</span> <em>&gt;</em></a><span class="crumbs-selected">新建人群</span>
		</div>
		<div class="form">
			<el-form :model="crowdData" ref="crowdForm" :rules="formRules" label-width="100px">
				<p class="item-title">新建人群</p>
				<el-form-item label="人群名称：" class="is-required" prop="name">
					<el-input v-model="crowdData.name" style="width: 300px;" placeholder="请输入人群名称"></el-input>
				</el-form-item>
				<p><span class="error-message" v-if="selectTagLength > 10">最多只能选择10个标签</span></p>
				<p class="sub-item-title">人群包含的标签</p>
				<el-form-item>
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
									<em class="icon icon-move" @click="showPopover(CONST.CROWD_TYPE.OR, index, $event)"></em><em class="icon icon-shut" @click="removeOrTag(index)"></em>
								</span>
								<span class="tag-span" v-if="index < orTags.length - 1">或者</span>
							</template>
						</div>
						<button class="btn btn-blue-simple" type="button" @click.prevent="showTagDrawer(CONST.CROWD_TYPE.OR)">添加标签</button>
					</div>
				</el-form-item>
				<el-form-item>
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
									<em class="icon icon-move" @click="showPopover(CONST.CROWD_TYPE.AND, index, $event)"></em><em class="icon icon-shut" @click="removeAndTag(index)"></em>
								</span>
								<span class="tag-span" v-if="index < andTags.length - 1">并且</span>
							</template>
						</div>
						<button class="btn btn-blue-simple" type="button" @click.prevent="showTagDrawer(CONST.CROWD_TYPE.AND)">添加标签</button>
					</div>
				</el-form-item>
				<p class="sub-item-title">人群排除的标签</p>
				<el-form-item>
					<div class="tag-box">
						<p class="tag-box-title">标签之间的关系：<el-radio v-model="crowdData.logicType" :label="CONST.CROWD_LOGIC.OR">或者</el-radio><el-radio v-model="crowdData.logicType" :label="CONST.CROWD_LOGIC.AND">并且</el-radio></p>
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
									<em class="icon icon-move" @click="showPopover(CONST.CROWD_TYPE.NOT, index, $event)"></em><em class="icon icon-shut" @click="removeNotTag(index)"></em>
								</span>
								<span class="tag-span" v-if="index < notTags.length - 1">{{crowdData.logicType === CONST.CROWD_LOGIC.OR ? '或者' : '并且'}}</span>
							</template>
						</div>
						<button class="btn btn-blue-simple" type="button" @click.prevent="showTagDrawer(CONST.CROWD_TYPE.NOT)">添加标签</button>
					</div>
				</el-form-item>
				<el-form-item label="已选择：" prop="crowdGroups">
					<span>{{selectTagLength}}</span>
				</el-form-item>
			</el-form>
		</div>
		<div class="action-bar" style="z-index: 1040;">
			<button class="btn btn-blue" type="button" @click.prevent="save">保存</button>
			<router-link class="btn btn-gray" :to="{name: 'crowd'}" :title="'返回'">返回</router-link>
		</div>
		<transition name="fade">
			<div style="z-index:1200;" class="master" v-show="isShowTagDrawer"></div>
		</transition>
		<transition name="drawer">
			<tag-drawer key="tag" v-if="isShowTagDrawer" :type="tagType" :andTags="andTags" :orTags="orTags" :notTags="notTags"></tag-drawer>
		</transition>
	</div>
</template>
<script>
import Http from 'http';
import Event from 'event';
import CONST from 'help/CONST.js';
import TagDrawer from './addTagDrawer.vue';
import router from '../../../../route.js';
import {mixin, copyObj} from 'utils/common';
export default {
	name: 'crowEdit',
	data() {
		return {
			CONST: CONST,
			crowdData: {
				crowdId: 0,
				name: '',
				type: 1,
				logicType: CONST.CROWD_LOGIC.OR,
				crowdGroups: []
			},
			popoverType: '',
			popoverIndex: '',
			isShowTooltip: false,
			isShowTagDrawer: false,
			tagType: '',//2:或者,1:并且,3:排除
			formRules: {
				name: [{
					required: true,
					validator: (rule, value, callback) => {
						if (!value || value.length === 0) {
							callback(new Error('请输入人群名称'));
						} else if (value.length > 30) {
							callback(new Error('输入内容不得超过30个字符'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				crowdGroups:[{
					required: false,
					validator: (rule, value, callback) => {
						if (this.selectTagLength === 0) {
							callback(new Error('请选择标签'));
						} else if (this.selectTagLength > 10) {
							callback(new Error('最多只能选择10个标签'));
						} else {
							if (this.notTags.length > 0 && this.andTags.length === 0 && this.orTags.length === 0) {
								callback('请至少选择一条“或者”标签或“并且”标签');
							} else {
								callback();
							}
						}
					},
					trigger: 'blur'
				}]
			},
			andTags: [],
			orTags: [],
			notTags: []
		};
	},
	components: {
		TagDrawer
	},
	computed: {
		crowdId() {
			return +this.$route.params.id;
		},
		selectTagLength() {
			return this.andTags.length + this.orTags.length + this.notTags.length;
		}
	},
	watch: {
		isShowTagDrawer: function(val) {
			if (val) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		}
	},
	created() {
		if (this.crowdId !== 0) {
			this.getCrowdData();
		}
	},
	mounted() {
		document.body.addEventListener('click', (e) => {
			let event = e || window.event;
			let ele = event.target || event.srcElement;
			while (ele) {
				if (ele.classList && [...ele.classList].indexOf('icon-move') !== -1) {
					return;
				}
				ele = ele.parentNode;
			}
			this.isShowTooltip = false;
			this.popoverType = '';
			this.popoverIndex = '';
		});
		Event.$off('closeTagDrawer');
		Event.$on('closeTagDrawer', (res) => {
			this.isShowTagDrawer = false;
			this.tagType = '';
			if (res) {
				this.andTags = res.andTags;
				this.orTags = res.orTags;
				this.notTags = res.notTags;
			}
		});
	},
	methods: {
		getCrowdData() {
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
		showPopover(type, index, e) {
			let popover = this.$refs['popover'];
			popover.style.top = e.pageY + 10 + 'px';
			popover.style.left = e.pageX - 107 + 'px';
			this.popoverType = type;
			this.popoverIndex = index;
			this.isShowTooltip = true;
		},
		showTagDrawer(type) {
			this.tagType = type;
			this.isShowTagDrawer = true;
		},
		moveTag(type) {
			let tag;
			if (this.popoverType === CONST.CROWD_TYPE.AND) {
				tag = copyObj(this.andTags[this.popoverIndex]);
				this.andTags.splice(this.popoverIndex, 1);
			} else if (this.popoverType === CONST.CROWD_TYPE.OR) {
				tag = copyObj(this.orTags[this.popoverIndex]);
				this.orTags.splice(this.popoverIndex, 1);
			} else {
				tag = copyObj(this.notTags[this.popoverIndex]);
				this.notTags.splice(this.popoverIndex, 1);
			}
			if (type === CONST.CROWD_TYPE.AND) {
				this.andTags.push(tag);
			} else if (type === CONST.CROWD_TYPE.OR) {
				this.orTags.push(tag);
			} else {
				this.notTags.push(tag);
			}
			this.isShowTooltip = false;
			this.popoverType = '';
			this.popoverIndex = '';
		},
		save() {
			this.$refs['crowdForm'].validate(res => {
				if (res) {
					let saveData = {
						name: this.crowdData.name,
						type: this.crowdData.type,
						crowdGroups: this.getCrowdGroups()
					};
					if (this.crowdData.crowdId !== 0) {
						saveData.crowdId = this.crowdData.crowdId;
					}
					Http({
						url: '/api/crowd',
						method: this.crowdData.crowdId === 0 ? 'post' : 'put',
						data: saveData
					}).then(res => {
						if (res.data.code === 200 && res.data.iserror === 0) {
							router.push({name: 'crowd'});
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
				}
			});
		},
		getCrowdGroups() {
			let groups = [];
			let andGroups = {
				type: CONST.CROWD_TYPE.AND,
				logic: CONST.CROWD_TYPE.AND,
				crowdTags: this.getSaveData(this.andTags)
			};
			let orGroups = {
				type: CONST.CROWD_TYPE.OR,
				logic: CONST.CROWD_TYPE.OR,
				crowdTags: this.getSaveData(this.orTags)
			};
			let notGroups = {
				type: CONST.CROWD_TYPE.NOT,
				logic: this.crowdData.logicType,
				crowdTags: this.getSaveData(this.notTags)
			};
			if (andGroups.crowdTags.length > 0) {
				groups.push(andGroups);
			}
			if (orGroups.crowdTags.length > 0) {
				groups.push(orGroups);
			}
			if (notGroups.crowdTags.length > 0) {
				groups.push(notGroups);
			}
			return groups;
		},
		getSaveData(tags) {
			let crowdTags = [];
			for (let tag of tags) {
				let obj = {
					tagId: tag.tagId ? tag.tagId : tag.bigdataId,
					isPlatform: tag.tagId ? 0 : 1,
					platformTagOptionIds: ''
				};
				if (tag.platformTagOptions) {
					let options = [];
					for (let p of tag.platformTagOptions) {
						options.push(p.platformTagOptionId);
					}
					obj.platformTagOptionIds = options.join(',');
				}
				crowdTags.push(obj);
			}
			return crowdTags;
		},
		removeAndTag(index) {
			this.andTags.splice(index, 1);
		},
		removeOrTag(index) {
			this.orTags.splice(index, 1);
		},
		removeNotTag(index) {
			this.notTags.splice(index, 1);
		}
	}
};
</script>