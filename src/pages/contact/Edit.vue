<template>
	<div id="edit">
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">编辑</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<div class="background"></div>
		<!-- 编辑列表 -->
		<ContactCreate></ContactCreate>
		<!-- 退出登录 -->
		<button @click="logout()" v-if="is_bind==0">退出登录</button>
		<!-- 删除好友 -->
		<button @click="delContact()" v-else>删除</button>
	</div>	
</template>

<script type="text/javascript">
	import ContactCreate from '@/components/contact/ContactCreate'
	import { mapState } from 'vuex'
	export default {
		created() {
			// 回显第一页用户资料
			this.$store.dispatch('dataFirstList', {
				token: this.token,
				user_id: this.user_id,
				address_book_id: this.address_book_id,
				is_bind: this.is_bind
			}).then(res => {
				
			}, err => {
				if (err.response.status == 401) {
					// 重新登录
					this.overtime();
				}
			});
		},
		data() {
			return {
				token: sessionStorage.getItem('token'),
        		user_id: Number(sessionStorage.getItem('userId')),
        		user_data_id: Number(sessionStorage.getItem('user_data_id')),
        		address_book_id: Number(sessionStorage.getItem('address_book_id')),
        		is_bind: Number(sessionStorage.getItem('is_bind'))
			}
		},
		computed: {
			...mapState({
				// 导入姓名
				name: state => state.contact.name,
				// 导入职位
				position: state => state.contact.position,
				// 导入行业
				industry: state => state.contact.industry,
				// 导入背景
				background: state => state.contact.background,
				// 导入亲信
				favorite: state => state.contact.favorite,
				// 导入联系方式
				telphone: state => state.contact.telphone
			})
		},
		methods: {
			// 返回通讯录页面
			goLast() {
				this.$router.push({ name: 'Contact' });
			},
			// 处理完成
			handleOpt() {
				// 保存修改后的信息
				this.$router.push({ name: 'Contact' });
			},
			// 退出登录
			logout() {
				this.$store.dispatch('logout', {
					token: this.token,
					user_id: this.user_id,
				}).then(res => {
					// 退出登录
					if (res.status == 200) {
						sessionStorage.setItem('token', '');
						this.$router.push({ name: 'Login'});
					}
				}, err => {
					if (err.response.status == 401) {
						// 重新登录
						this.overtime();
					}
				});
			},
			// 删除好友
			delContact() {
				this.$store.dispatch('deleteContact', {
					token: this.token,
					user_id: this.user_id,
					user_data_id: this.user_data_id
				}).then(res => {
					this.$router.push({ name: 'Contact'});
				}, err => {
					if (err.response.status == 401) {
						// 重新登录
						this.overtime();
					}
				});
			}
		},
		components: {
			ContactCreate
		}
	}
</script>

<style type="text/css" scoped>
#edit {
	width: 100%;
	height: 100%;
	background: #fff;
}
#edit .background {
	height: 0.16rem;
	background: #f6f6f6;
}
#edit button {
	display: block;
	box-sizing: border-box;
	width: 90%;
	height: 0.46rem;
	background: #fff;
	border: 0.01rem solid #1e88e5;
	border-radius: 0.06rem;
	color: #1e88e5;
	font-size: 0.16rem;
	padding: 0 0.15rem;
	margin: 0 auto;
}
</style>