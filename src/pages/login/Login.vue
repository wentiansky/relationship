<template>
	<div id="login">
		<!-- logo -->
		<div class="logo">
			<img src="../../assets/img/logo.png" alt="logo">
			<h2>政企关系链</h2>
		</div>
		<div class="form">
			<div class="row">
				<i class="iconfont icon-ren2 icon icon1"></i>
				<input type="text" name="id" placeholder="账号" v-model="username" autocomplete="off" v-focus>
			</div>	
			<div class="row">
				<i class="iconfont icon-unie65b icon"></i>
				<input type="password" name="password" placeholder="密码" v-model="password" @keyup.enter="handleLogin" autocomplete="off">
			</div>
			<div class="btn">
				<button type="button" class="login" @click="handleLogin">登录</button>
				<button type="button" class="register" @click="goRegister">立即注册</button>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import { login } from '@/data/getData'
	import { mapMutations } from 'vuex'
	import { directive } from '@/utils/mixin.js'

	export default {
		beforeRouteEnter(to, from, next) {
			var token = sessionStorage.getItem('token');
		    if (token) {
		    	// 已登录
		    	next(false);
		    } else {
		      	// 未登录
		      	next();
		    }
		},
		mounted() {
			// 避免手机输入法遮挡输入框
			var clientHeight = document.body.clientHeight,
				form = document.querySelector('.form');
			window.addEventListener('resize', function () {
				if (document.body.clientHeight < clientHeight) {
					form.scrollIntoView(false);
				}
			})
		},
		mixins: [directive],
		data() {
			return {
				username: '',
				password: '',
				res: ''
			}
		},
		methods: {
			...mapMutations([
				'RECORD_USERINFO',
			]),
			/* 登录操作 */
			async handleLogin() {
				// 是否填写完整
				if (!this.username || !this.password) {
					this.alert('请输入完整');
		        	return;
				}

				// 开始登录（用封装的fetch.js去请求数据）
				this.res = await login(this.username, this.password);
				let res = this.res;
				console.log(res);
				switch(res.status) {
					case 403:
						this.alert('用户名不存在');
						break;
					case 400:
						this.alert('密码错误');
						break;
					case 200:
						// 登录成功
						// 保存token, user_id
						this.RECORD_USERINFO(res);
						// 进入联系人页面
						this.$router.push({name: 'Contact'});
						break;
				}

				/* this.$store.dispatch('login', {
					username: this.username,
					password: this.password
				}).then(res => {
					if (res.status_code == -12) {
						this.alert('用户名不存在');
					} else if (res.status_code == -13) {
						this.alert('密码错误');
					} else {
						// 登录成功
						// 保存token, user_id
						sessionStorage.setItem('token', res.token);
						sessionStorage.setItem('userId', res.user_id)
						this.$router.push({name: 'Contact'});
					}
				}, err => {

				}); */
			},
			/* 跳转注册 */
			goRegister() {
				this.$router.push({
					name: 'Register'
				});
			},

			/* 封装错误提示函数 */
			alert(message) {
				this.$message({
					message,
					type: 'error',
					center: true,
					duration: 1500
				});
			}
		}
	}
</script>

<style type="text/css" scoped>
#login {
	overflow: hidden;
	width: 100%;
	height: 100%;
	background: url(../../assets/img/login_bg.png) no-repeat center center;
	background-size: 100% 100%;
}
/*logo*/
#login .logo {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 1.54rem;
	margin-top: 1rem;
	margin-bottom: 0.72rem;
}
#login .logo img {
	margin-bottom: 0.18rem;
}
#login .logo h2 {
	font-size: 0.22rem;
	font-weight: normal;
	color: #fff;
}
#login .form {
	padding: 0 0.52rem;
	height: 2.16rem;
}
#login .form .row {
	box-sizing: border-box;
	display: flex;
	padding-top: 0.1rem;
	padding-left: 0.07rem;
	height: 0.52rem;
	border-bottom: 0.02rem solid #8dc0ed;
}
#login .form .row .icon {
	font-size: 0.2rem!important;
	color: #fff;
	margin-right: 0.1rem;
	margin-top: 0.13rem;
}
#login .form .row .icon1 {
	font-size: 0.22rem!important;
}
#login .form input {
	height: 0.52rem;
	font-size: 0.16rem;
  color: #fff;
  background-color: transparent!important;
}
/*修改浏览器默认字体*/
input::-webkit-input-placeholder { /* WebKit browsers*/ 
  font-size: 0.14rem;
  color: rgba(255, 255, 255, 0.4);
}
input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/ 
  font-size: 0.14rem;
  color: rgba(255, 255, 255, 0.4);
}
input::-moz-placeholder {  /* Mozilla Firefox 19+*/ 
　font-size: 0.14rem;
  color: rgba(255, 255, 255, 0.4);
}
input:-ms-input-placeholder { /* Internet Explorer 10+*/ 
  font-size: 0.14rem;
 	color: rgba(255, 255, 255, 0.4);
}
#login .form .btn {
	width: 100%;
	height: 0.46rem;
	margin-top: 0.32rem;
}
#login .form .login {
	display: block;
  width: 100%;
  height: 0.46rem;
  font-size: 0.16rem;
  color: #1e88e5;
  background: #fff;
  -webkit-border-radius: 0.04rem;
  -moz-border-radius: 0.04rem;
  -ms-border-radius: 0.04rem;
}
#login .form .register {
	font-size: 0.12rem;
	color: #fff;
	display: block;
	background: transparent;
	margin: 0 auto;
	margin-top: 0.14rem;
}
</style>