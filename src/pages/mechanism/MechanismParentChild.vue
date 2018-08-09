<template>
	<div id="mechanism_parent_child">
		<!-- 头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">上级机构</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<input type="text" placeholder="请输入机构名称" v-model="name">
	</div>
</template>

<script type="text/javascript">
	export default {
		created() {
			// 回显机构
			this.$store.dispatch('showMechanism', {
				token: this.token,
				user_id: this.user_id,
				position_id: Number(this.idx),
			}).then(res => {
				switch(this.type) {
					case '0':
						this.id = res.inside_id;
						this.name = res.inside_name;
					break;
					case '1':
						this.id = res.plumb_id;
						this.name = res.plumb_name;
					break;
					case '2':
						this.id = res.region_id;
						this.name = res.region_name;
					break;
					case '3':
						this.id = res.industry_id;
						this.name = res.industry_name;
					break;
					case '4':
						this.id = res.company_id;
						this.name = res.company_name;
					break;
				}
			}, err => {
				if (err.response.status == 401) {
					// token过期
					this.overtime();
				}
			});
		},
		data() {
			return {
				// 职位索引
				idx: this.$route.query.id,
				// 机构类别
				type: this.$route.query.type,
				id: '',
				name: '',
				// 相关参数
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
			}
		},
		methods: {
			// 返回机构详情页
			goLast() {
				var id = this.idx;
				this.$router.push({ name: 'MechanismIndex', query: { id } });
			},
			handleOpt() {
				var type = this.type;
				if (type == '0') {
					// 内部管理
					this.$store.dispatch('setInside', {
						token: this.token,
						user_id: this.user_id,
						position_id: Number(this.idx),
						inside_id: this.id || 0,
						name: this.name
					}).then(res => {

					}, err => {
						if (err.response.status == 401) {
							// token过期
							this.overtime();
						}
					});
				} else if (type == '1') {
					// 垂直管理
					this.$store.dispatch('setPlumb', {
						token: this.token,
						user_id: this.user_id,
						position_id: Number(this.idx),
						plumb_id: this.id || 0,
						name: this.name
					}).then(res => {

					}, err => {
						if (err.response.status == 401) {
							// token过期
							this.overtime();
						}
					});
				} else if (type == '2') {
					// 地区管理
					this.$store.dispatch('setRegion', {
						token: this.token,
						user_id: this.user_id,
						position_id: Number(this.idx),
						region_id: this.id || 0,
						name: this.name
					}).then(res => {

					}, err => {
						if (err.response.status == 401) {
							// token过期
							this.overtime();
						}
					});
				} else if (type == '3') {
					// 行业管理
					this.$store.dispatch('setIndustry', {
						token: this.token,
						user_id: this.user_id,
						position_id: Number(this.idx),
						industry_id: this.id || 0,
						name: this.name
					}).then(res => {

					}, err => {
						if (err.response.status == 401) {
							// token过期
							this.overtime();
						}
					});
				} else if (type == '4') {
					// 集团管理
					this.$store.dispatch('setCompany', {
						token: this.token,
						user_id: this.user_id,
						position_id: Number(this.idx),
						company_id: this.id || 0,
						name: this.name
					}).then(res => {

					}, err => {
						if (err.response.status == 401) {
							// token过期
							this.overtime();
						}
					});
				}
			}
		}
	}
</script>

<style type="text/css" scoped>
#mechanism_parent_child {
	background: #f6f6f6;
	width: 100%;
	height: 100%;
}
#mechanism_parent_child input {
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