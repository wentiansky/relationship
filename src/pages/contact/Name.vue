<template>
	<div id="create_name">
		<!-- 姓名头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">姓名</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<!-- 输入姓名 -->
		<input type="text" placeholder="请输入姓名" v-model="name">
	</div>
</template>

<script type="text/javascript">
	import ContactHeader from '@/components/contact/ContactHeader'
	import { mapState } from 'vuex'
	export default {
		mounted() {
			this.name = this.Name;
		},
		data() {
			return {
				name: '',
				token: sessionStorage.getItem('token'),
        		user_id: Number(sessionStorage.getItem('userId')),
        		user_data_id: Number(sessionStorage.getItem('user_data_id')),
        		address_book_id: Number(sessionStorage.getItem('address_book_id')),
        		is_bind: Number(sessionStorage.getItem('is_bind')),
        		add: sessionStorage.getItem('add')
			}
		},
		computed: {
			...mapState({
				Name: state => state.contact.name
			})
		},
		methods: {
			// 返回创建页面
			goLast() {
				if (this.add == 'false') {
					this.$router.push({ name: 'Edit' });
				} else {
					this.$router.push({ name: 'Create' });
				}
			},
			// 处理完成
			handleOpt() {
				// 姓名只能包含中文和字母
				var reg = /^[\u4e00-\u9fa5|a-zA-Z]+$/;
				if (reg.test(this.name)) {
					if (this.add == 'false') {
						// 修改姓名
						this.$store.dispatch('saveName', {
							token: this.token,
							user_id: this.user_id,
							name: this.name,
							user_data_id: this.user_data_id,
							is_bind: this.is_bind,
						}).then(res => {
							// 跳转回编辑页面
							this.$router.push({ name: 'Edit' });
						}, err => {
							if (err.response.status == 401) {
								// 重新登录
								this.overtime();
							}
						});
						return;
					}
					// 保存姓名至数据库
					this.$store.dispatch('saveName', {
						token: this.token,
						user_id: this.user_id,
						name: this.name,
						is_bind: 1,
						address_book_id: 0
					}).then(res => {
						// 跳转回编辑页面
						sessionStorage.setItem('add', false);
						sessionStorage.setItem('is_bind', 1);
						this.$router.push({ name: 'Edit' });
					}, err => {
						if (err.response.status == 401) {
							// 重新登录
							this.overtime();
						}
					});
				} else {
					this.$message({
		            	message: '姓名只能包含中文和字母',
		            	type: 'warning',
		            	duration: 1500
		        	});
				}
			}
		},
	}
</script>

<style type="text/css" scoped>
#create_name {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
}
#create_name input {
	margin-top: 0.16rem;
	width: 100%;
	padding: 0 0.16rem;
	height: 0.48rem;
	border-top: 0.01rem solid #e9e9e9;
	border-bottom: 0.01rem solid #e9e9e9;
	font-size: 0.16rem;
	color: #222;
}
/*修改浏览器默认字体*/
input::-webkit-input-placeholder { /* WebKit browsers*/ 
  font-size: 0.16rem;
  color: #ccc;
}
input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/ 
  font-size: 0.16rem;
  color: #ccc;
}
input::-moz-placeholder {  /* Mozilla Firefox 19+*/ 
　font-size: 0.16rem;
  color: #ccc;
}
input:-ms-input-placeholder { /* Internet Explorer 10+*/ 
  font-size: 0.16rem;
 	color: #ccc;
}
</style>