<template>
	<div id="favorite_add">
		<!-- 亲信头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">添加亲信</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<!-- 输入框 -->
		<input type="text" placeholder="请输入亲信" v-model="favorite">
	</div>
</template>

<script type="text/javascript">
	export default {
		data() {
			return {
				favorite: '',
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
				user_data_id: Number(sessionStorage.getItem('user_data_id'))
			}
		},
		methods: {
			// 返回亲信页面
			goLast() {
				this.$router.push({ name: 'Favorite' });
			},
			// 处理完成
			handleOpt() {
				var favorite_list = JSON.parse(sessionStorage.getItem('favorite_list')) || [];
				var person = {
					head_pic: '',
					name: this.favorite
				};
				favorite_list.push(person);
				sessionStorage.setItem('favorite_list', JSON.stringify(favorite_list));
				// 跳转回背景页面
				this.$router.push({ name: 'Favorite' });
			},
		}
	}
</script>

<style type="text/css" scoped>
#favorite_add {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
}
#favorite_add input {
	margin-top: 0.16rem;
	width: 100%;
	padding: 0 0.16rem;
	height: 0.48rem;
	border-top: 0.01rem solid #e9e9e9;
	border-bottom: 0.01rem solid #e9e9e9;
	font-size: 0.16rem;
	color: #222;
	box-sizing: border-box;
}
</style>