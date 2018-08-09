<template>
	<div id="position_choose">
		<!-- 职位头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">职位</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<!-- 输入职位并选择 -->
		<!-- <SearchBox :search="search" page="positionChoose" v-on:selfPosition="receive"></SearchBox> -->
		<!-- 输入职位 -->
		<input type="text" placeholder="请输入职位名称" v-model="positionName">
		<div class="list">
		<!-- 上下级职位 -->
			<h4>上下级职位</h4>
			<ul>
				<li @click="goParentChild(0)">
					<span class="title">上级职位</span>
					<span class="content">{{ positionInfo.p_name }}</span>
					<i class="iconfont icon-jiantou icon"></i>
				</li>
				<li @click="goParentChild(1)">
					<span class="title">下级职位</span>
					<span class="content">{{ positionInfo.c_name }}</span>
					<i class="iconfont icon-jiantou icon"></i>
				</li>
			</ul>
			<!-- 从属 -->
			<h4>从属</h4>
			<ul>
				<li @click="goNext(0)">
					<span class="title">行政范围</span>
					<span class="content">{{ positionInfo.region }}</span>
					<i class="iconfont icon-jiantou icon"></i>
				</li>
				<li @click="goNext(1)">
					<span class="title">机构</span>
					<span class="content">{{ positionInfo.mechanism_name }}</span>
					<i class="iconfont icon-jiantou icon"></i>
				</li>
				<li @click="goNext(2)">
					<span class="title">部门</span>
					<span class="content">{{ department }}</span>
					<i class="iconfont icon-jiantou icon"></i>
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/javascript">
	// import SearchBox from '@/components/common/SearchBox'
	import { mapState } from 'vuex'
	export default {
		created() {
			if (this.add_pos == 0) {
				// 修改职位信息
				// 职位信息回显
				this.$store.dispatch('positionInfo', {
					token: this.token,
					user_id: this.user_id,
					position_id: Number(this.idx),
				}).then(res => {
					this.positionInfo = res;
					this.positionName = res.name;
					this.department = res.department[0].department_name;
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
				// 区分主兼职位
				isMain: this.$route.query.flag,
				// 相关参数
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
				user_data_id: Number(sessionStorage.getItem('user_data_id')),
				position_id: Number(sessionStorage.getItem('position_id')) || 0,
				is_main: Number(sessionStorage.getItem('is_main')),
				add_pos: Number(sessionStorage.getItem('add_pos')),
				// 职位名称
				positionName: '',
				// 部门
				department: '',
				// 职位详细信息
				positionInfo: ''
			}
		},
		computed: {
			...mapState({

			})
		},
		methods: {
			// 返回职位主页
			goLast() {
				this.$router.push({ name: 'PositionIndex' });
			},
			// 处理完成
			handleOpt() {
				// 保存职位
				var main = 0;
				if (this.is_main == 0) {
					main = 0;
				} else {
					main = 1;
				}
				this.$store.dispatch('savePosition', {
					token: this.token,
					user_id: this.user_id,
					user_data_id: this.user_data_id,
					position_id: this.idx || 0,
					name: this.positionName,
					is_main: main
				}).then(res => {
					// 跳转回职位主页
					this.$router.push({ name: 'PositionIndex' });
				}, err => {
					if (err.response.status == 401) {
						// token过期
						this.overtime();
					}
				});	
			},
			// 跳转到上下级职位页面
			goParentChild(level) {
				var id = this.idx;
				// 保存职位后, 才能进入
				if (!id) {
					this.$message({
		            	message: '亲，需要先保存职位哦!',
		            	type: 'warning',
		            	duration: 1500
		        	});
				} else {
					this.$router.push({ name: 'PositionParentChild', query: { id, level } });
				}
			},
			// 跳转子页面
			goNext(index) {
				// 职位索引
				var id = this.idx;
				// 保存职位后, 才能进入
				if (!id) {
					this.$message({
		            	message: '亲，需要先保存职位哦!',
		            	type: 'warning',
		            	duration: 1500
		        	});
				} else {
					if (index == 0) {
						// 跳转行政范围页面
						this.$router.push({ name: 'Location', query: { id } });
					} else if (index == 1) {
						// 跳转机构页面
						this.$router.push({ name: 'MechanismIndex', query: { id } });
					} else if (index == 2) {
						// 跳转部门页面
						this.$router.push({ name: 'Department', query: { id } });
					}
				}
			}
		},
		/*components: {
			SearchBox
		}*/
	}
</script>

<style type="text/css" scoped>
#position_choose {
	background: #f6f6f6;
	width: 100%;
	height: 100%;
}
#position_choose input {
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
#position_choose h4 {
	padding-left: 0.16rem;
	font-size: 0.12rem;
	color: #888;
	height: 0.36rem;
	line-height: 0.36rem;
}
#position_choose ul {
	background: #fff;
	padding: 0 0.16rem;
	box-sizing: border-box;
	border-top: 0.01rem solid #e6e6e6;
	border-bottom: 0.01rem solid #e6e6e6;
}
#position_choose ul li {
	position: relative;
	display: flex;
	align-items: center;
	height: 0.5rem;
	border-bottom: 0.01rem solid #f1f1f1;
}
#position_choose ul li:last-child {
	border-bottom: none;
}
#position_choose ul li .title {
	font-size: 0.16rem;
	color: #222;
}
#position_choose ul li .content {
	position: absolute;
	font-size: 0.14rem;
	color: #999;
	top: 0.13rem;
	right: 0.15rem;
}
#position_choose ul li .icon {
	position: absolute;
	font-size: 0.12rem;
	color: #999;
	top: 0.15rem;
	right: 0;
}
</style>