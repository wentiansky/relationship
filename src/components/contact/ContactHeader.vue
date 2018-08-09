<template>
	<div id="contact_header">
		<div class="return" @click="goLast">
			<i class="iconfont icon-fanhui icon"></i><span>返回</span>
		</div>
		<div class="title">{{header.title}}</div>
		<div class="opt" @click="handleOpt">{{ header.opt }}</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		data() {
			return {
				
			}
		},
		props: {
			// 头部信息
			header: null,
			// 即将跳转的页面
			page: null,
			// 发送何种请求
			request: null,
			// 姓名
			name: null,
			// 行业
			industry: null,
			// 背景
			background: null,
			// 亲信
			favorite: null,
			// 联系方式
			telphone: null,
		},
		methods: {
			goLast() {
				if (this.page == 'create') {
					this.$router.push({ name: 'Contact' });
				} else {
					this.$router.go(-1);
				}
			},
			// 处理操作
			handleOpt() {
				var path = '';
				switch(this.page) {
					case 'Create': 
						path = 'Create';
						if (this.request == 'name') {
							// 改变vuex中name
							this.$store.commit('changeName', this.name);
							// 发送name到后台保存

						} else if (this.request == 'industry') {
							// 改变vuex中industry
							this.$store.commit('changeIndustry', this.industry);
							// 发送industry到后台保存
							
						} else if (this.request == 'background') {
							// 改变vuex中background
							this.$store.commit('changeBackground', this.background);
							// 发送background到后台保存
							
						} else if (this.request == 'favorite') {
							// 改变vuex中favorite
							this.$store.commit('changeFavorite', this.favorite);
							// 发送favorite到后台保存
							
						} else if (this.request == 'telphone') {
							// 改变vuex中telphone
							this.$store.commit('changeTelphone', this.telphone);
							// 发送telphone到后台保存
							
						}
						break;
					case 'positionIndex':
						path = 'PositionIndex';
						var { id, flag } = this.$route.query;
						console.log(id, flag);
						if (flag) {
							console.log('aaa');
							// 显示主职位
							this.$store.commit('changeMainFlag', [id, true]);
						}
						// console.log(id, flag);
						break;
				}
				this.$router.push({ name: path });
			}
		}
	}
</script>

<style type="text/css" scoped>
#contact_header {
	position: relative;
	padding: 0 0.15rem; 
	height: 0.46rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #fff;
}
#contact_header .return {
	display: flex;
	align-items: center;
	height: 0.46rem;
}
#contact_header .icon {
	font-size: 0.22rem!important;
	color: #1e88e5;
	margin-right: 0.04rem;	
}
#contact_header .return span {
	font-size: 0.14rem;
	color: #1e88e5;
}
#contact_header .title {
	font-size: 0.18rem;
	color: #222;
}
#contact_header .opt {
	font-size: 0.14rem;
	color: #1e88e5;
}
</style>