<template>
	<div id="department_add">
		<!-- 背景头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">添加部门</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<!-- 输入框 -->
		<input type="text" placeholder="请输入部门" v-model="department">
	</div>
</template>

<script type="text/javascript">
	export default {
		data() {
			return {
				// 职位索引
				idx: this.$route.query.id,
				// 部门内容
				department: '',
				// 相关参数
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
			}
		},
		methods: {
			// 返回部门主页
			goLast() {
				var id = this.idx;
				this.$router.push({ name: 'Department', query: { id } });
			},
			// 处理完成
			handleOpt() {
				var id = this.idx;
				// 添加部门
				this.$store.dispatch('saveDepartment', {
					token: this.token,
					user_id: this.user_id,
					position_id: Number(id),
					department_id: 0,
					name: this.department
				}).then(res => {
					this.$router.push({ name: 'Department', query: { id } });
				}, err => {
					if (err.response.status == 401) {
						// token过期
						this.overtime();
					}
				});
			},
		}
	}
</script>

<style type="text/css" scoped>
#department_add {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
}
#department_add input {
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