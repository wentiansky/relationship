<template>
	<div id="mechanism_index">
		<!-- 机构头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">设置机构</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<SearchBox :search="search" page="mechanism" :mainMechanism="main_mechanism" v-on:mechanism="receive" v-on:mainMechanism="receiveMechanism"></SearchBox>
		<div class="list">
			<!-- 内部 -->
			<h4>内部管理</h4>
			<ul>
				<li @click="goParentChild(0)">
					<span class="title">上级机构</span>
					<span class="content">{{ other_mechanism.inside_name }}</span>
					<i class="iconfont icon-jiantou icon"></i>
				</li>
			</ul>
			<!-- 垂直 -->
			<h4>垂直管理</h4>
			<ul>
				<li @click="goParentChild(1)">
					<span class="title">上级机构</span>
					<span class="content">{{ other_mechanism.plumb_name }}</span>
					<i class="iconfont icon-jiantou icon"></i>
				</li>
			</ul>
			<!-- 地区 -->
			<h4>地区管理</h4>
			<ul>
				<li @click="goParentChild(2)">
					<span class="title">上级机构</span>
					<span class="content">{{ other_mechanism.region_name }}</span>
					<i class="iconfont icon-jiantou icon"></i>
				</li>
			</ul>
			<!-- 行业 -->
			<h4>行业管理</h4>
			<ul>
				<li @click="goParentChild(3)">
					<span class="title">上级机构</span>
					<span class="content">{{ other_mechanism.industry_name }}</span>
					<i class="iconfont icon-jiantou icon"></i>
				</li>
			</ul>
			<!-- 集团 -->
			<h4>集团管理</h4>
			<ul>
				<li @click="goParentChild(4)">
					<span class="title">上级机构</span>
					<span class="content">{{ other_mechanism.company_name }}</span>
					<i class="iconfont icon-jiantou icon"></i>
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/javascript">
	import SearchBox from '@/components/common/SearchBox'
	import { mapState } from 'vuex'
	export default {
		created() {
			// 机构回显
			this.$store.dispatch('showMechanism', {
				token: this.token,
				user_id: this.user_id,
				position_id: Number(this.idx),
			}).then(res => {
				// 主要机构
				this.main_mechanism = res.mechanism_name;
				// 内部管理
				this.other_mechanism.inside_id = res.inside_id;
				this.other_mechanism.inside_name = res.inside_name;
				// 垂直管理
				this.other_mechanism.plumb_id = res.plumb_id;
				this.other_mechanism.plumb_name = res.plumb_name;
				// 地区管理
				this.other_mechanism.region_id = res.region_id;
				this.other_mechanism.region_name = res.region_name;
				// 行业管理
				this.other_mechanism.industry_id = res.industry_id;
				this.other_mechanism.industry_name = res.industry_name;
				// 集团管理
				this.other_mechanism.company_id = res.company_id;
				this.other_mechanism.company_name = res.company_name;
			}, err => {
				if (err.response.status == 401) {
					// token过期
					this.overtime();
				}
			});
		},
		data() {
			return {
				// 搜索组件参数
				search: {
					placeholder: '请输入机构',
					content: '没有找到? 点击添加机构'
				},
				// 职位索引
				idx: this.$route.query.id,
				// 主要机构
				main_mechanism: '',
				// 其他机构
				other_mechanism: {},
				// 相关参数
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
			}
		},
		methods: {
			// 返回职位详情页
			goLast() {
				var id = this.idx;
				this.$router.push({ name: 'PositionChoose', query: { id } });
			},
			// 保存机构
			handleOpt() {
				if (!this.content)
				this.$store.dispatch('saveMechanism', {
					token: this.token,
					user_id: this.user_id,
					position_id: Number(this.idx),
					mechanism_name: this.main_mechanism,
					inside_id: this.other_mechanism.inside_id || 0,
					inside_name: this.other_mechanism.inside_name,
					company_id: this.other_mechanism.company_id || 0,
					company_name: this.other_mechanism.company_name,
					region_id: this.other_mechanism.region_id || 0,
					region_name: this.other_mechanism.region_name,
					industry_id: this.other_mechanism.industry_id || 0,
					industry_name: this.other_mechanism.industry_name,
					plumb_id: this.other_mechanism.plumb_id || 0,
					plumb_name: this.other_mechanism.plumb_name,
				}).then(res => {
					location.reload();
				}, err => {
					if (err.response.status == 401) {
						// token过期
						this.overtime();
					}
				});
			},
			// 跳转到子机构
			goParentChild(type) {
				var id = this.idx;
				this.$router.push({ name: 'MechanismParentChild', query: { id, type } });
			},
			// 接收返回的主要机构名称
			receiveMechanism(data) {
				this.main_mechanism = data;
			},
			// 接收匹配到的其他机构
			receive(data) {
				this.other_mechanism = data;
			}
		},
		components: {
			SearchBox
		}
	}
</script>

<style type="text/css" scoped>
#mechanism_index {
	background: #f6f6f6;
	width: 100%;
	height: 100%;
}
#mechanism_index h4 {
	padding-left: 0.16rem;
	font-size: 0.12rem;
	color: #888;
	height: 0.36rem;
	line-height: 0.36rem;
}
#mechanism_index ul {
	background: #fff;
	padding: 0 0.16rem;
	box-sizing: border-box;
	border-top: 0.01rem solid #e6e6e6;
	border-bottom: 0.01rem solid #e6e6e6;
}
#mechanism_index ul li {
	position: relative;
	display: flex;
	align-items: center;
	height: 0.5rem;
	border-bottom: 0.01rem solid #f1f1f1;
}
#mechanism_index ul li:last-child {
	border-bottom: none;
}
#mechanism_index ul li .title {
	font-size: 0.16rem;
	color: #222;
}
#mechanism_index ul li .content {
	position: absolute;
	font-size: 0.14rem;
	color: #999;
	top: 0.13rem;
	right: 0.15rem;
}
#mechanism_index ul li .icon {
	position: absolute;
	font-size: 0.12rem;
	color: #999;
	top: 0.15rem;
	right: 0;
}
</style>
