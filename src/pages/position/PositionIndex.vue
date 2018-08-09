<template>
	<div id="position_index">
		<!-- 职位头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">职位</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<!-- 主副职位列表 -->
		<div class="list">
			<ul>
				<li v-for="(pos, index) in positionList">
					<!-- 显示主职位标题 -->
					<span class="title" v-if="pos.is_main==0">主职位</span>
					<!-- 显示兼职位标题 -->
					<span class="title" v-else>兼职位</span>
					<!-- 设为主职位 -->
					<span class="set" v-if="pos.is_main==1" @click="setMain(pos.position_id)">设置为主职位</span>
					<!-- 显示职位 -->
					<div @click="goPos({ id: pos.position_id, flag: pos.is_main })">
						<span class="content">{{ pos.position_name }}</span>
						<i class="iconfont icon-jiantou icon"></i>
					</div>
				</li>
			</ul>
			<!-- 新增职位 -->
			<div class="confirm">
				<button @click="addPos">新增职位</button>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import ContactHeader from '@/components/contact/ContactHeader'
	import { mapState } from 'vuex'
	export default {
		created () {
			// 加载职位列表
			this.positionArr = [];
			this.$store.dispatch('positionList', {
				token: this.token,
				user_id: this.user_id,
				user_data_id: this.user_data_id
			}).then(res => {
				if (res.length == 0) {
					// 设置新增职位标记为0(表示主职位)
					sessionStorage.setItem("is_main", 0);
				} else {
					// 设置新增职位标记为1(表示兼职位)
					sessionStorage.setItem("is_main", 1);	
				}
				this.positionList = res;
				// 组装所有职位id
				res.forEach((pos, index) => {
					this.positionArr.push(pos.position_id);
				});
			}, err => {
				if (err.response.status == 401) {
					// token过期
					this.overtime();
				}
			});	
		},
		data() {
			return {
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
				user_data_id: Number(sessionStorage.getItem('user_data_id')),
				positionList: [],
				positionArr: []
			}
		},
		computed: {
			...mapState({

			})
		},
		methods: {
			// 跳转至职位详情页面
			goPos({ id, flag }) {
				// 设置增加职位标记为0,  表示修改
				sessionStorage.setItem('add_pos', 0);
				this.$router.push({ name: 'PositionChoose', query: { id, flag } });
			},
			// 新增职位
			addPos() {
				// 设置增加职位标记为1
				sessionStorage.setItem('add_pos', 1);
				this.$router.push({ name: 'PositionChoose' });
			},
			// 返回创建页面
			goLast() {
				this.$router.push({ name: 'Edit' });
			},
			// 处理完成
			handleOpt() {
				// 跳转回创建页面
				this.$router.push({ name: 'Edit' });
			},
			// 设置主职位
			setMain(id) {
				// 主职位id
				var main_position_id = Number(id),
					index = this.positionArr.indexOf(id),
					// 其他职位id
					position_id = this.positionArr.splice(index, 1);
				this.$store.dispatch('setMainPos', {
					token: this.token,
					user_id: this.user_id,
					user_data_id: this.user_data_id,
					main_position_id,
					position_id: this.positionArr.join('-')
				}).then(res => {
					this.positionArr = [];
					// 重新请求数据
					this.$store.dispatch('positionList', {
						token: this.token,
						user_id: this.user_id,
						user_data_id: this.user_data_id
					}).then(res => {
						if (res.length == 0) {
							// 设置新增职位标记为0(表示主职位)
							sessionStorage.setItem("is_main", 0);
						} else {
							// 设置新增职位标记为1(表示兼职位)
							sessionStorage.setItem("is_main", 1);	
						}
						this.positionList = res;
						// 组装所有职位id
						res.forEach((pos, index) => {
							this.positionArr.push(pos.position_id);
						});
					}, err => {
						if (err.response.status == 401) {
							// token过期
							this.overtime();
						}
					});
				}, err => {
					if (err.response.status == 401) {
						// token过期
						this.overtime();
					}
				});	
			}
		}
	}
</script>

<style type="text/css" scoped>
#position_index {
	background: #f6f6f6;
	width: 100%;
	height: 100%;
}
#position_index .list {
	background: #fff;
	margin: 0.16rem 0;
	padding: 0 0.16rem;
	border-top: 0.01rem solid #e6e6e6;
	border-bottom: 0.01rem solid #e6e6e6;
}
#position_index .list ul li {
	position: relative;
	display: flex;
	align-items: center;
	height: 0.5rem;
	width: 100%;
	border-bottom: 0.01rem solid #f1f1f1;
}
#position_index .list ul li .title {
	font-size: 0.16rem;
	color: #555;
	margin-right: 0.8rem;
}
#position_index .list ul li .set {
	font-size: 0.12rem;
	color: #1e88e5;
}
#position_index .list ul li div {
	display: flex;
	align-items: center;
	position: absolute;
	right: 0;
	top: 0.13rem;
}
#position_index .list ul li div .content {
	font-size: 0.14rem;
	color: #999;
	margin-right: 0.04rem;
}
#position_index .list ul li div .icon {
	font-size: 0.12rem;
	color: #999;
}
#position_index .confirm {
	margin-top: 0.16rem;
	padding: 0 0.15rem;
	padding-bottom: 0.16rem;
}
#position_index .confirm button {
	width: 100%;
	height: 0.46rem;
	background: #fff;
	border: 0.01rem solid #1e88e5;
	border-radius: 0.06rem;
	color: #1e88e5;
	font-size: 0.16rem;
}
</style>