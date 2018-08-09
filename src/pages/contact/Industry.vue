<template>
	<div id="industry">
		<!-- 行业头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">行业</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<h4>选择</h4>
		<EditList :isImg="isImg" :list="industryList" :multi="multi" page="industry" v-on:industry="receiveIndustry"></EditList>
	</div>
</template>

<script type="text/javascript">
	import EditList from '@/components/contact/EditList'
	import { mapState } from 'vuex'
	export default {
		created() {
			// 加载行业列表
			this.$store.dispatch('industry').then(res => {
				// 回显第一页用户资料中的行业
				this.$store.dispatch('dataFirstList', {
					token: this.token,
					user_id: this.user_id,
					address_book_id: this.address_book_id,
					is_bind: this.is_bind
				}).then(res => {
					// 回显列表选中项
					this.industryList.forEach((item, index) => {
						if (item.name == res.trade) {
							item.flag = true;
							console.log(this);
							this.industry = item.id;
						} else {
							item.flag = false;
						}
					});
				}, err => {
					if (err.response.status == 401) {
						// 重新登录
						this.overtime();
					}
				});
			}, err => {

			});
		},
		mounted() {
			var lisTop = document.getElementById('edit_list').offsetTop,
				screenY = document.documentElement.clientHeight;
			document.getElementById('edit_list').style.height = (screenY - lisTop) + 'px';
		},
		data() {
			return {
				// 不显示头像
				isImg: false,
				// 单选
				multi: false,
				// 行业
				industry: '',
				token: sessionStorage.getItem('token'),
        		user_id: Number(sessionStorage.getItem('userId')),
        		user_data_id: Number(sessionStorage.getItem('user_data_id')),
        		address_book_id: Number(sessionStorage.getItem('address_book_id')),
        		is_bind: Number(sessionStorage.getItem('is_bind'))
			}
		},
		computed: {
			...mapState({
				// 导入vuex中行业列表
				industryList: state => state.contact.industryList,
				// 导入vuex中选择的行业
				Industry: state => state.contact.industry
			})
		},
		methods: {
			// 接收选择列表传回的行业
			receiveIndustry(data) {
				this.industry = data;
			},
			// 返回创建页面
			goLast() {
				this.$router.push({ name: 'Edit' });
			},
			// 处理完成
			handleOpt() {
				// 保存行业到后台
				this.$store.dispatch('saveIndustry', {
					token: this.token,
					user_id: this.user_id,
					trade_id: this.industry,
					user_data_id: this.user_data_id
				}).then(res => {
					// 跳转回编辑页面
					this.$router.push({ name: 'Edit' });
				}, err => {
					if (err.response.status == 401) {
						// 重新登录
						this.overtime();
					}
				});
			}
		},
		components: {
			EditList
		}
	}
</script>

<style type="text/css" scoped>
#industry {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
}
#industry h4 {
	padding-left: 0.16rem;
	box-sizing: border-box;
	height: 0.4rem;
	display: flex;
	align-items: center;
	font-weight: normal;
	font-size: 0.14rem;
	color: #666;
}
</style>