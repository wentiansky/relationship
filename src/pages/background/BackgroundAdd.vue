<template>
	<div id="background_add">
		<!-- 背景头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">添加背景</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<!-- 输入框 -->
		<input type="text" placeholder="请输入背景" v-model="background">
	</div>
</template>

<script type="text/javascript">
	export default {
		data() {
			return {
				background: '',
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
				user_data_id: Number(sessionStorage.getItem('user_data_id'))
			}
		},
		methods: {
			// 返回背景页面
			goLast() {
				this.$router.push({ name: 'Background' });
			},
			// 处理完成
			handleOpt() {
				// 添加背景人物
				var background_list = JSON.parse(sessionStorage.getItem('background_list')) || [];
				var person = {
					head_pic: '',
					name: this.background
				};
				background_list.push(person);
				sessionStorage.setItem('background_list', JSON.stringify(background_list));
				// 跳转回背景页面
				this.$router.push({ name: 'Background' });
			},
		}
	}
</script>

<style type="text/css" scoped>
#background_add {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
}
#background_add input {
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