<template>
	<div id="info_list">
		<ul>
			<li @click="handleHeadImg">
				<span class="title">头像</span>
				<div class="headImg" :class="{backColor: headImg!=''}">
					<img :src="headImg" alt="头像" v-if="headImg!=''">
					<span class="title" v-else>编辑</span>
				</div>
				<i class="iconfont icon-jiantou icon"></i>
			</li>
			<li @click="handleName">
				<span class="title">姓名**</span>
				<span class="content">{{ name }}</span>
				<i class="iconfont icon-jiantou icon"></i>
			</li>
			<li @click="handleTelphone">
				<span class="title">联系方式**</span>
				<span class="content">{{ telphone }}</span>
				<i class="iconfont icon-jiantou icon"></i>
			</li>
			<li @click="handlePosition">
				<span class="title">职位</span>
				<span class="content">{{ main_position }}</span>
				<i class="iconfont icon-jiantou icon"></i>
			</li>
			<li @click="handleIndustry">
				<span class="title">行业</span>
				<span class="content">{{ industry }}</span>
				<i class="iconfont icon-jiantou icon"></i>
			</li>
			<li @click="handleBackground">
				<span class="title">背景</span>
				<span class="content">{{ background }}</span>
				<i class="iconfont icon-jiantou icon"></i>
			</li>
			<li @click="handleFavorite">
				<span class="title">亲信</span>
				<span class="content">{{ favorite }}</span>
				<i class="iconfont icon-jiantou icon"></i>
			</li>
		</ul>
	</div>
</template>

<script type="text/javascript">
	import { mapState } from 'vuex'
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapState({
				// 导入头像
				headImg: state => state.contact.headImg,
				// 导入姓名
				name: state => state.contact.name,
				// 导入行业
				industry: state => state.contact.industry,
				// 导入背景
				background: state => state.contact.background,
				// 导入亲信
				favorite: state => state.contact.favorite,
				// 导入联系方式
				telphone: state => state.contact.phone,
				// 导入主要职位
				main_position: state => state.contact.main_position
			})
		},
		methods: {
			handleHeadImg() {
				// 先填姓名, 再上传头像
				if (!this.name) {
					this.$message({
		            	message: '亲，需要先填姓名哦!',
		            	type: 'warning',
		            	duration: 1500
		        	});
				} else {
					this.$router.push({name: 'Upload'});
				}
			},
			handleName() {
				this.$router.push({name: 'Name'});
			},
			handleIndustry() {
				// 先填姓名, 再填行业
				if (!this.name) {
					this.$message({
		            	message: '亲，需要先填姓名哦!',
		            	type: 'warning',
		            	duration: 1500
		        	});
				} else {
					this.$router.push({name: 'Industry'});
				}
			},
			handleBackground() {
				// 先填姓名, 再填背景
				if (!this.name) {
					this.$message({
		            	message: '亲，需要先填姓名哦!',
		            	type: 'warning',
		            	duration: 1500
		        	});
				} else {
					this.$router.push({name: 'Background'});
					sessionStorage.setItem('isBackground', true);
				}
			},
			handleFavorite() {
				// 先填姓名, 再填亲信
				if (!this.name) {
					this.$message({
		            	message: '亲，需要先填姓名哦!',
		            	type: 'warning',
		            	duration: 1500
		        	});
				} else {
					this.$router.push({name: 'Favorite'});
					sessionStorage.setItem('isBackground', false);
				}
			},
			handleTelphone() {
				// 先填姓名, 再填联系方式
				if (!this.name) {
					this.$message({
		            	message: '亲，需要先填姓名哦!',
		            	type: 'warning',
		            	duration: 1500
		        	});
				} else {
					this.$router.push({name: 'Telphone'});
				}
			},
			handlePosition() {
				// 先填姓名, 再填职位
				if (!this.name) {
					this.$message({
		            	message: '亲，需要先填姓名哦!',
		            	type: 'warning',
		            	duration: 1500
		        	});
				} else {
					this.$router.push({name: 'PositionIndex'});
				}
			}
		}
	}
</script>

<style type="text/css" scoped>
#info_list {
	background: #fff;
}
#info_list ul {
	padding: 0 0.16rem;
	height: 4.2rem;
}
#info_list ul li {
	position: relative;
	height: 0.48rem;
	border-bottom: 0.02rem solid #f8f8f8;
	display: flex;
	align-items: center;
}
#info_list ul li .title {
	font-size: 0.16rem;
	color: #222;
}
#info_list ul li .content {
	position: absolute;
	font-size: 0.14rem;
	color: #999;
	right: 0.35rem;
	top: 0.13rem;
}
#info_list ul li .icon {
	position: absolute;
	font-size: 0.12rem;
	color: #999;
	right: 0.16rem;
	top: 0.14rem;
}
#info_list ul li .headImg {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 0.44rem;
	height: 0.44rem;
	margin-right: 0.12rem;
	border-radius: 50%;
	background: #1e88e5;
	right: 0.35rem;
	top: 0.1rem;
}
.backColor {
	background: #fff!important;
}
#info_list ul li .headImg img {
	width: 0.41rem;
	height: 0.41rem;
	border-radius: 50%;
}
#info_list ul li .headImg span {
	font-size: 0.12rem;
	color: #fff;
}
#info_list ul li:nth-of-type(1) {
	height: 0.68rem;
}
#info_list ul li:nth-of-type(1) .icon {
	top: 0.26rem;
}
</style>