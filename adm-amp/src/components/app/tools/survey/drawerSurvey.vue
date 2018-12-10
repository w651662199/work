<template>
	<div class="amp-drawer" id="addQuestions">
		<div class="drawer-part" id="content">
			<h2 class="part-header"><span class="header-text">新建问卷</span><span class="header-fn"><em
				@click="dialogOpen()" class="icon icon-close"></em></span></h2>
			<div class="amp-form amp-form03">
				<el-form label-width="124px" :model="formData" ref="formData" :rules="rules">
					<el-form-item label="问卷名称：" prop="name">
						<el-input v-model="formData.name" placeholder="请输入问卷名称"></el-input>
					</el-form-item>
					<el-form-item label="问卷说明：" prop="description"
								  :rules="[{ max: 60, message: '问卷说明最多可输入60个汉字', trigger: 'blur' }]">
						<el-input type="textarea" :autofocus="true" v-model="formData.description"
								  :autosize="{ minRows: 2, maxRows: 4}"></el-input>
					</el-form-item>
					<el-form-item label="添加问题：" id="addQuestion">
						<!--类型:1：单选，2：多选，3：评分，4：文本-->
						<el-select class="standBtn" v-model="formData.selectQueation"
								   style="float: left" popper-class="optionList">
							<el-option
								v-for="item in selectOptions"
								:label="item.label"
								:value="item.value">
								<span class="optionSPAN"  @click="addQuestion(item.value)">{{item.label}}</span>
							</el-option>
						</el-select>
						<el-button @click="addQuestion(4)" style="margin-left: 5px;float: left">简答题</el-button>
						<el-button @click="addQuestion(3)" style="margin-left: 5px;float: left">评分题</el-button>
						<el-select placeholder="标准题库" class="standBtn" v-model="formData.standQuestion"
								   style="float: left" popper-class="optionList">
							<el-option
								v-for="item in standOptions"
								:label="item.label"
								:value="item.value">
								<span class="optionSPAN" @click="addQuestion(5,item.value)">{{item.label}}</span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="添加问题：" :class='{scroll:isScroll}' v-show="isScroll" id="addQuestion">
						<!--类型:1：单选，2：多选，3：评分，4：文本-->
						<el-select class="standBtn" v-model="formData.selectQueation"
								   style="float: left" popper-class="optionList">
							<el-option
								v-for="item in selectOptions"
								:label="item.label"
								:value="item.value">
								<span class="optionSPAN"  @click="addQuestion(item.value)">{{item.label}}</span>
							</el-option>
						</el-select>
						<el-button @click="addQuestion(4)" style="margin-left: 5px;float: left">简答题</el-button>
						<el-button @click="addQuestion(3)" style="margin-left: 5px;float: left">评分题</el-button>
						<el-select placeholder="标准题库" class="standBtn" v-model="formData.standQuestion"
								   style="float: left" popper-class="optionList">
							<el-option
								v-for="item in standOptions"
								:label="item.label"
								:value="item.value">
								<span class="optionSPAN" @click="addQuestion(5,item.value)">{{item.label}}</span>
							</el-option>
						</el-select>
					</el-form-item>
					<div class="questionContent" id="questionContent" >
						<div v-for="(question,index) in formData.questions" class="questionBox"
							 :key="question.orderId" ref="questionBox" @drop="allowDrop">
							<h2 class="questionTitle">
								{{index+1}}.{{question.type==1?'单选题':(question.type==2?'多选题':(question.type==3?'评分题':'简答题'))}}</h2>
							<el-form-item label="标题：" class="questionItem"
										  :prop="'questions.' + index + '.name'"
										  :rules="rules.name">
								<el-input v-model="question.name"  @mousedown.native="inputMousedown"
										  @blur="inputBlur"></el-input>
							</el-form-item>
							<!--选项单选或者多选-->
							<el-form-item :label="'选项' + changeNumber(i)+'：'" class="questionItem"
										  v-for="(item, i) in question.options"
										  v-show="question.type==1||question.type==2"
										  :prop="'questions.' + index + '.options.' + i + '.title'"
										  :rules="{required: true, message: '选项不能为空', trigger: 'blur'}">
								<el-input v-model="item.title"  @mousedown.native="inputMousedown" @focus="inputMousedown"
										  @blur="inputBlur"></el-input>
								<i class="el-icon-delete" v-show="question.options.length > 2"
								   @click.prevent="deleteOption(index,i)"></i>
							</el-form-item>
							<!--评分-->
							<el-form-item label="评分：" class="questionItem" v-show="question.type==3">
								<div>
									<ul>
										<li v-for="i in 10" class="heart"><img src="../../../../assets/img/heart.png">
										</li>
									</ul>
								</div>
							</el-form-item>
							<el-button icon="plus" class="plusBtn" v-show="question.type==1||question.type==2"
									   @click.prevent="addOptions(index)">添加
							</el-button>
							<div class="questionBtnGroup">
								<el-button class="btn btn-copy" :autofocus='false' @click.prevent="copyQuestion(index)">
									复制
								</el-button>
								<el-button class="btn btn-delete" :autofocus='false'
										   @click.prevent="deleteQuestion(index)">删除
								</el-button>
							</div>

						</div>
					</div>
				</el-form>
			</div>
		</div>
		<div class="drawer-btn">
			<button @click="previewDrawer()" class="btn btn-primary">预览</button>
			<button @click="saveDrawer()" class="btn btn-primary">保存</button>
			<button @click="closeDrawer()" class="btn btn-gray">取消</button>
		</div>
		<el-dialog v-model="dialogVisible" :modal-append-to-body = "false" :show-close ="false" :close-on-click-modal="false">
			<span><h3>是否保存问卷?</h3></span>
			<span slot="footer" class="dialog-footer">
        		<button class="btn btn-gray" @click="closeDrawer()">否</button>
        		<button class="btn btn-primary" @click="comfirDialog()">是</button>
      		</span>
		</el-dialog>
		<!--预览-->
		<transition name="drawer" :appear="true">
			<m-preview :surveyId="surveyId" v-if="previewShow"></m-preview>
		</transition>
	</div>
</template>
<script>
	import Vue from 'vue';
	import store from 'store';
	import actions from 'actions';
	import Event from 'event';
	import Http from 'utils/http';
	import QueationPreview from './surveyPreview.vue';
	import Equel from 'deep-equal';
	import {
		objType,
		mixin,
		copyObj,
		isEmptyObj
	} from 'utils/common';
	import Sortable from 'sortablejs';
	export default {
	    name:'app-question-template',
		props:['pageId'],
		data(){
	        return {
				formData:{
					standQuestion:'标准题库',
					selectQueation:'单选题',
					questions:[]
				},
				surveyId:this.pageId,
				questionContentShow:false,
				dialogVisible:false,
				isPreview:false,
				previewShow:false,
				standOptions:[],
				selectOptions:[{
					value: 1,
					label: '单选题'
				}, {
					value: 2,
					label: '多选题'

				}],
				standQuestions:[],
				isScroll:false,
				oldObject:{},
				newObject:{},
				rules:{
					'name': [
						{required: true, message: '标题不能为空', trigger: 'blur' },
						{validator: function (rule, value, callback) {
								if (value === '') {
									callback(new Error('标题不能为空'));
								} else {
									let len = 0;
									for (let i = 0; i < value.length; i++) {
										if (value.charCodeAt(i) > 255) {
											len += 2;
										} else {
											len++;
										}
									}
									if (len > 60) {
										callback(new Error('最大长度不超过30个字符'));
									} else {
										callback();
									}
								}
							}, trigger: 'blur'
						}
					],
					'description': [
						{validator: function(rule, value, callback) {
							if (value === '') {
								callback(new Error('标题不能为空'));
							} else {
								let len = 0;
								for (let i=0; i < value.length; i++){
									if(value.charCodeAt(i) > 255) {
										len+=2;
									}else{
										len++;
									}
								}
								if( len>120){
									callback(new Error('最大长度不超过30个字符'));
								}else{
									callback();
								}
							}
						}, trigger: 'blur' }
					]
				}
			}
		},
		computed: {
			drawerData: () => store.state.drawerCtrl.config, // from store
			actionType: () => store.state.drawerCtrl.action,
			config: () => store.state.drawerCtrl,
		},
		components: {
			'm-preview': QueationPreview,
		},
		created(){
			let standQuestions = {};
			this.formData = mixin(copyObj(this.drawerData),standQuestions);
			this.formData.questions.map((item,index) => {
				item.orderId = index+1;
			})
		},
		mounted(){
			this.oldObject = copyObj(this.formData);
			if(this.actionType == 'modify'){
				this.$refs.formData.validate();
				this.newObject = copyObj(this.formData);
			}
			Event.$on('close-preview', () => {
				this.previewShow = false;
				this.isPreview = false;
			});
			this.getStandQuestions();
			this.sortableFn();
		},
		methods:{
		    sortableFn() {
		        const vm = this;
				Sortable.create(document.getElementById('questionContent'), {
					animation: 300,//动画参数
					onEnd: function (evt) { //拖拽完毕之后发生该事件
						let questions = vm.formData.questions;
						vm.change(questions,evt.oldIndex,evt.newIndex);
					}
				})
			},
			change(arr,oldIndex,newIndex){
		        let oldValue = copyObj(arr[oldIndex]);
		        let newValue = copyObj(arr[newIndex]);
				arr.splice(oldIndex,1);
				arr.splice(newIndex, 0, oldValue);
			},
			allowDrop(ev){
				ev.stopPropagation();
				ev.preventDefault();
			},
			inputMousedown(){
				this.$refs.questionBox.forEach(function(item) {
					item.draggable = false
				})
			},
			inputBlur(){
				this.$refs.questionBox.forEach(function(item) {
					item.draggable = true
				})
			},
			//给题目排序
			orderQuestion(){
				this.formData.questions.map((item,index) => {
				    item.orderId = index+1;
				})
			},
			//获取标准题
			getStandQuestions(){
				let standOptions = this.standOptions;
				//获取标准题接口
				Http.get('/api/survey/question/banks', {
					hideLoading: true
				}).then((res) => {
					if (res.data.code === 200) {
						let Data = res.data.data.questions;
						Data.map((item,index) => {
							let standQuestion = {};
							standOptions.push({
								value:index, //value从0开始
								label:item.shortName
							})
							standQuestion.name = item.name;
							standQuestion.type = item.type;
							standQuestion.options = item.options;
							standQuestion.draggable = true;
							standQuestion.isAnswerRequired = 1;
							this.standQuestions.push(standQuestion);
							this.orderQuestion();
						})
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				}).catch((error) => {
					console.log(error);
				});
			},
		    //关闭提示是否保存
			dialogOpen(){
				this.newObject = copyObj(this.formData);
			    if(!Equel(this.newObject,this.oldObject)){
					this.dialogVisible = true;
				}else{
					this.closeDrawer();
				}
			},
			//预览页面
			previewDrawer(){
			    this.isPreview = true;
			    this.save(this.surveyId);
			},
			//对话框确定
			comfirDialog(){
				this.save(this.surveyId);
				this.dialogVisible = false;
				this.closeDrawer();
			},
		    //添加题目
			addQuestion(value,key){ //value:1：单选，2：多选，3：评分，4：文本，5：标准；key指定插入的题目顺序
				let question = {};
				if (this.formData.questions.length >= 10) {
					this.$message({
						message: '无法添加!',
						type: 'error'
					});
					return false;
				}
				if (value == 1 || value == 2) { //单选、多选
					question = {
						name: '',
						isAnswerRequired: 1,
						draggable: true,
						type: value,
						options: [{
							title: ''
						}, {
							title: ''
						}]
					}
					this.formData.questions.push(question);
					this.orderQuestion();
					this.domDraw();

				} else if (value == 3 || value == 4) { //评分、文本
					 question = {
						name: '',
						isAnswerRequired: 1,
						draggable: true,
						type: value,
						options: []
					}
					this.formData.questions.push(question);
					this.orderQuestion();
					this.domDraw();
				} else if(value == 5 && key !== undefined){ //标准题
					this.formData.questions.push(this.standQuestions[key]);
					this.orderQuestion();
					this.domDraw();
				}
			},
		    //添加题目的时候重新渲染
			domDraw(){
				let conent = document.getElementById('content');
				this.$nextTick(function(){
					conent.scrollTop = conent.scrollHeight;
					conent.addEventListener('scroll',() => {
						if(conent.scrollTop >= 220){
							this.isScroll = true;
						}else{
							this.isScroll = false;
						}
					})
					if(conent.scrollTop >= 220){
						this.isScroll = true;
					}else{
						this.isScroll = false;
					}
				});
			},
		    //复制题目
			copyQuestion(index){
				let len = this.formData.questions.length;
				if (len >= 10) {
					this.$message({
						message: '无法添加题目!',
						type: 'error'
					});
					return false;
				}
				let question = copyObj(this.formData.questions[index]);
				this.formData.questions.splice(index, 0, question);
				this.orderQuestion();
			},
			//删除题目
			deleteQuestion(index){
				this.formData.questions.splice(index,1);
				this.orderQuestion();
			},
			//删除选项
			deleteOption(index,i){
				this.formData.questions[index].options.splice(i,1);
			},
			//添加选项
			addOptions(index){
				let option = {'title': ''};
				let len = this.formData.questions[index].options.length;
				if (len >= 10) {
					this.$message({
						message: '无法添加!',
						type: 'error'
					});
					return false;
				}
				this.formData.questions[index].options.push(option);
			},
			//保存问题
			saveDrawer(){
			    this.save(this.surveyId);
			},
			//新建、编辑保存
			save(pId){
				let date = new Date().getTime();
				let name = '';
				name = this.formData.name ? this.formData.name:'调查问卷'+ date;
				if(pId == ''){ //新建
					Http.post('/api/survey',{
						name: name,
						description: this.formData.description ? this.formData.description : ''
					}).then((res) => {
						if (res.data.code === 200) {
							this.surveyId = res.data.data.surveyId;
							if (this.formData.questions.length > 0) {
								this.formData.questions.map((item, index) => {
								    delete item.orderId;
									item.surveyId = this.surveyId;
									item.sequence = index + 1;
									item.options.map((k, i) => {
										k.sequence = i + 1;
									})
								})
							}
							Http.post('/api/survey/question', {
								surveyId:this.surveyId,
								questions:this.formData.questions
							}).then((res) => {
							    if(res.data.code == 200){
									this.oldObject = copyObj(this.formData);
									if(this.isPreview){ //是否是预览保存
										this.previewShow = true;
									}else{
										this.$message({
											message: '保存成功!',
											type: 'success'
										});
									}
									return false;
								}
							}).catch((error) => {
								console.log(error);
							})
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
							return false;
						}
					})
				}else { //修改
					Http.put('/api/survey',{
						surveyId: this.surveyId,
						name: name,
						description: this.formData.description ? this.formData.description : ''
					}).then((res) => {
						if (res.data.code === 200) {
							if (this.formData.questions.length > 0) {
								this.formData.questions.map((item, index) => {
									delete item.orderId;
									item.surveyId = this.surveyId;
									item.sequence = index + 1;
									item.options.map((k, i) => {
										k.sequence = i + 1;
									})
								})
							}
							Http.put('/api/survey/question', {
								surveyId:this.surveyId,
								questions:this.formData.questions
							}).then((res) => {
								if(res.data.code == 200){
									this.oldObject = copyObj(this.formData);
									if(this.isPreview){ //是否是预览保存
										this.previewShow = true;
									}else{
										this.$message({
											message: '保存成功!',
											type: 'success'
										});
									}
									return false;
								}
							}).catch((error) => {
								console.log(error);
							})
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
							return false;
						}
					})

				}
			},
			closeDrawer() {
				actions.controlDrawer(this.$store, {
					show: false,
					config:{}
				});
				Event.$emit('get-list');
			},
			changeNumber(n){
			    switch (n){
					case 0:
						return '一';
						break;
					case 1:
						return '二';
						break;
					case 2:
						return '三';
						break;
					case 3:
						return '四';
						break;
					case 4:
						return '五';
						break;
					case 5:
						return '六';
						break;
					case 6:
						return '七';
						break;
					case 7:
						return '八';
						break;
					case 8:
						return '九';
						break;
					case 9:
						return '十';
						break;
				}
			},
		},
	}
</script>
<style lang="less" scoped>
	.optionList li{
		padding: 0;
	}
	.optionList .optionSPAN{
		display: block;
		width: 100%;
		height: 100%;
		padding: 8px 10px;
	}
	.questionPreview{
		color: #596069;
		background: linear-gradient(to bottom, #d9dbde 0%, #d9dbde 100%);
		border: 1px solid transparent;
		cursor: not-allowed;
		&:hover{
			 background: linear-gradient(to bottom, #d9dbde 0%, #d9dbde 100%);
			 color: #596069;
		 }
	}
	.scroll{
		position: fixed;
		top:0;
		width: 700px;
		z-index: 2;
		background: #fff;
		height: 40px;
		-webkit-transition: top .5s;
		-moz-transition: top .5s;
		-o-transition: top .5s;
		transition: top .5s;
		-webkit-box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
		-moz-box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
		box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
	}
	.heart{
		width: 18px;
	    float:left;
	    margin-right:7px;
		img{
			width: 18px;
		}
	}
	.questionTitle{
		height: 35px;
		line-height: 35px;
		margin-bottom: 15px;
		color: #333;
		font-weight: bold;
	}
	.questionBtnGroup{
		text-align: center;
	}
	#questionContent{
		.el-button.btn-copy{
			width: 103px;
			height: 37px;
			background: #f6f6f6;
			font-size: 16px;
			color: #d30312;
			margin-left: -122px;
			border:none;
			&:hover{
				 color: #d30312;
		         border:none;
			 }
		}
		.el-button.btn-delete{
			width: 103px;
			height: 37px;
			background: #f6f6f6;
			font-size: 16px;
			margin-left: 10px;
			border:none;
			&:hover{
				 color: #d30312;
				 border:none;
			 }
		}
	}
	.el-form-item.questionItem{
		margin-left: -57px;
	}

	.questionContent {
		.questionBox {
			transition: all 1s;
			border: 1px solid #c0ccda;
			box-sizing: border-box;
			width: 90%;
			padding: 20px;
			margin-left: 122px;
			border-radius: 8px;
			-webkit-border-radius: 8px;
			-moz-border-radius: 8px;
			margin-bottom: 20px;
			&:hover {
				background: #fafafa;
				cursor: move;
		 		border-style: dashed;
			}
			.plusBtn {
				display: block;
				width: 345px;
				margin-left: 67px;
				border: 1px dashed;
				margin-bottom: 20px;
			}
	}
		.el-input{
			width: 345px;
			display: inline-block;
		}
		.el-icon-delete{
			display: table-cell;
			float: right;
			font-size: 19px;
			height: 36px;
			line-height: 36px;
			margin-right: 14px;
			padding: 0;
			vertical-align: middle;
			width: 30px;
		}
	}
	.standBtn .el-input__inner::-webkit-input-placeholder { /* WebKit browsers */
		color: #1F2D3D;
	}
	.standBtn .el-input__inner:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
		color: #1F2D3D;
	}
	.standBtn .el-input__inner::-moz-placeholder { /* Mozilla Firefox 19+ */
		color: #1F2D3D;
	}
	.standBtn .el-input__inner:-ms-input-placeholder { /* Internet Explorer 10+ */
		color: #1F2D3D;
	}
	.standBtn .el-input__inner{
		border-color: #c0ccda;
	}
	.el-button--default{
		width: 102px;
	}
	#addQuestion div:nth-of-type(2){
		margin-left: 7px;
	}
	.standBtn{
		width: 104px;
		display: inline-block;
		border-color: #c0ccda;
		color: #1F2D3D;
		.el-input__inner{
			line-height: 36px;
		}
	}
	.standBtn+.el-button--default{
		margin-left: 7px;
	}
</style>
