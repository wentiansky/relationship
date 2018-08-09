<template>
	<div id="position_parent_child">
		<!-- 职位头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title" v-if="level==0">上级职位</div>
			<div class="title" v-else>下级职位</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<!-- 搜索职位 -->
		<!-- <SearchBox :search="search" page="positionParentChild" v-on:parentChildPos="receive"></SearchBox> -->
		<input type="text" placeholder="请输入职位名称" v-model="name">
	</div>
</template>

<script type="text/javascript">
	// import SearchBox from '@/components/common/SearchBox'
	export default {
		created() {
			if (this.add_pos == 0) {
				// 修改上下级职位
				this.$store.dispatch('positionInfo', {
					token: this.token,
					user_id: this.user_id,
					position_id: Number(this.idx),
				}).then(res => {
					if (this.level == 0) {
						// 回显上级职位
						this.name = res.p_name;
					} else {
						this.name = res.c_name;
					}
				}, err => {
					if (err.response.status == 401) {
						// token过期
						this.overtime();
					}
				});
			}
		},
		data() {
			return {
				// 搜索组件参数
				/*search: {
					placeholder: '请输入职位',
					content: '没有找到? 点击添加职位'
				},*/
				// 职位索引
				idx: this.$route.query.id,
				// 上下级职位索引
				level: this.$route.query.level,
				// 职位名称
				name: '',
				// 相关参数
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
				add_pos: Number(sessionStorage.getItem('add_pos'))
			}
		},
		methods: {
			// 返回职位详情页
			goLast() {
				var id = this.idx;
				this.$router.push({ name: 'PositionChoose', query: { id } });
			},
			// 处理完成
			handleOpt() {
				var id = this.idx,
					level = this.level;
				if (level == 0) {
					// 保存上级职位
					this.$store.dispatch('setParentPos', {
						token: this.token,
						user_id: this.user_id,
						position_id: Number(id),
						p_name: this.name
					}).then(res => {
						// 返回职位选择页
						this.$router.push({ name: 'PositionChoose', query: { id } });
					}, err => {
						if (err.response.status == 401) {
							// token过期
							this.overtime();
						}
					});	
				} else if (level == 1) {
					// 保存下级职位
					this.$store.dispatch('setChildPos', {
						token: this.token,
						user_id: this.user_id,
						position_id: Number(id),
						c_name: this.name
					}).then(res => {
						// 返回职位选择页
						this.$router.push({ name: 'PositionChoose', query: { id } });
					}, err => {
						if (err.response.status == 401) {
							// token过期
							this.overtime();
						}
					});
				}
				
			}
		},
		/*components: {
			SearchBox
		}*/
	}
</script>

<style type="text/css">
#position_parent_child {
	background: #f6f6f6;
	width: 100%;
	height: 100%;
}
#position_parent_child input {
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