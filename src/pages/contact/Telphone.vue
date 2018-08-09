<template>
	<div id="telphone">
		<!-- 姓名头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">联系方式</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<!-- 输入联系方式 -->
		<input type="text" name="name" placeholder="请输入号码" v-model="telphone">
	</div>
</template>

<script type="text/javascript">
	import ContactHeader from '@/components/contact/ContactHeader'
	import { mapState } from 'vuex'
	export default {
		mounted() {
			this.telphone = this.Telphone;
		},
		data() {
			return {
				telphone: '',
				token: sessionStorage.getItem('token'),
        		user_id: Number(sessionStorage.getItem('userId')),
        		user_data_id: Number(sessionStorage.getItem('user_data_id'))
			}
		},
		computed: {
			...mapState({
				// 导入vuex联系方式
				Telphone: state => state.contact.phone,
			})
		},
		methods: {
			// 返回创建页面
			goLast() {
				this.$router.push({ name: 'Edit' });
			},
			// 处理完成
			handleOpt() {
				// 手机号码正则匹配
				var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
				if (reg.test(this.telphone)) {
					// 保存电话至数据库
					this.$store.dispatch('savePhone', {
						token: this.token,
						user_id: this.user_id,
						user_data_id: this.user_data_id,
						phone: this.telphone,
					}).then(res => {
						// 跳转回创建页面
						this.$router.push({ name: 'Edit' });
					}, err => {
						if (err.response.status == 401) {
							// 重新登录
							this.overtime();
						}
					});
				} else {
					this.$message({
		            	message: '亲，你的手机号码格式有误!',
		            	type: 'warning',
		            	duration: 1500
		        	});
				}
			}
		},
		components: {
			ContactHeader
		}
	}
</script>

<style type="text/css" scoped>
#telphone {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
}
#telphone input {
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