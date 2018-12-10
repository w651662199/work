<template>
	<div class="photoBox">
		<el-button class="scrollBtn" @click="photoPrev()" v-show="rightBtnDisabled">
			<em class="icon icon-prev"></em>
		</el-button>
		<div class="photoContent">
			<ul :style="{width: imgListLen * 100 + 'px'}">
				<li v-for="(item, index) in imgList" @click.prevent.stop="selectImg(index)" :class="{'actived': item.checked}">
					<span class="show-img" style="border:none"><img :src="item.url" alt=""></span>
				</li>
			</ul>
		</div>
		<el-button class="scrollBtn" @click="photoNext()" v-show="imgList.length > 3 && leftBtnDisabled">
			<em class="icon icon-next"></em>
		</el-button>
	</div>
</template>
<script>
	import Vue from "vue";
	import Event from 'event';
	export default {
	    name:'imageScroll',
		props: {
			value: {
				type: Array,
				required: true
			},
			index: {
			    type:Number,
				required:true
			}
		},
		data() {
	        return {
	            imgList: [],
				isClickBtn:false,
				rightBtnDisabled:false,
				leftBtnDisabled:true,
				computerLen: Math.ceil(this.value.length/3)
			}
		},
		computed: {
			imgListLen() {
	            return this.imgList.length;
			}
		},
		created() {
	        this.imgList = this.value;
		},
		methods: {
			selectImg(index) {
				this.imgList.forEach((item) => {
					item.checked = false;
				});
			    this.imgList[index].checked = true;
				Event.$emit('input', this.imgList);
			},
			photoPrev() {
			    console.log(this.index);
				if(this.isClickBtn) return false;
				this.isClickBtn = true;
				this.computerLen ++;
				let oUl  = document.getElementsByClassName('SKUbox')[this.index].getElementsByTagName('ul')[0];
				let now1 = -Math.floor((this.imgListLen / 3) ) * 3 * (90 + 10);
				let now  = 3 * (90 + 10);
				if (oUl.offsetLeft >= 0) {
					this.move(oUl, 'left', now1);
				} else {
					this.move(oUl, 'left', oUl.offsetLeft + now);
				}
			},
			photoNext() {
				if(this.isClickBtn) return false;
				this.computerLen --;
				this.isClickBtn = true;
				let now = -3 * (90 + 10);
				let oUl = document.getElementsByClassName('SKUbox')[this.index].getElementsByTagName('ul')[0];
				let n = Math.floor((this.imgListLen * (90 + 10) + oUl.offsetLeft) / 90);
				if (n <= 3) {
					this.move(oUl, 'left', 0);
				} else {
					this.move(oUl, 'left', oUl.offsetLeft + now);
				}
			},
			move(obj, attr, iTarget) {
				clearInterval(obj.timer);
				let vm = this;
				let oUl  = document.getElementsByClassName('SKUbox')[this.index].getElementsByTagName('ul')[0];
				obj.timer = setInterval(function () {
					let cur = 0;
					cur = parseInt(vm.getStyle(obj, attr));
					let speed = (iTarget - cur) / 3;
					speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
					if (iTarget == cur) {
						clearInterval(obj.timer);
						vm.isClickBtn = false;
						if(oUl.offsetLeft == 0){
							vm.rightBtnDisabled = false;
						}else {
							vm.rightBtnDisabled = true;
						}
						if( vm.computerLen == 1){
							vm.leftBtnDisabled = false;
						}else{
							vm.leftBtnDisabled = true;
						}
					} else {
						obj.style[attr] = cur + speed + 'px';
					}
				}, 20);
			},
			getStyle(obj, name) {
				if (obj.currentStyle) {
					return obj.currentStyle[name];
				} else {
					return getComputedStyle(obj, false)[name];
				}
			},
		},
		watch: {
			'value': {
			    handler: function(value,oldvalue) {
			        this.computerLen = Math.ceil(this.value.length/3);
				},
				deep:true
			}
		}
	}
</script>
<style lang="less" scoped>
	.uploade-show{
		height: 90px;
		padding-top: 0!important;
		width:290px;
		.show-img img{
			border: 1px solid #d9dbde;
			box-sizing: border-box;
		}
		.photoBox{
			width: 100%;
			height: 90px;
			position: relative;
			overflow: hidden;
			button{
				width: 20px;
				height: 40px;
				position: absolute;
				top:25px;
				background-color: rgba(0,0,0,0.3);
				border:none;
				border-radius: 0px;
				z-index:2;
				em{
					position: absolute;
					position: absolute;
					top: 12px;
					left: 7px;
					color:#fff;
				}
				&:hover{
					background-color: rgba(0,0,0,0.5);
					em{
						color:#fff;
					}
				}
				&:nth-of-type(1){
					 left:0;
				 }
				&:nth-of-type(2){
					 right:0;
				 }
			}
			.photoContent{
				overflow: hidden;
				width: 100%;
				height:90px;
				ul{
					position: absolute;
					left:0;
					top:0
				}
			}
		}
		ul li {
			float: left;
			margin: 0px 10px 0px 0px;
			width: 90px;
			height: 90px;
		}
	}
</style>
