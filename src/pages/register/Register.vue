<template>
  <div id="register">
    <header>
      <i class="iconfont icon-cha close" @click="goLast"></i>
      <span class="title">注册</span> 
    </header>
    <div class="form">
      <div class="row">
        <i class="iconfont icon-ren2 text"></i>
        <input type="text" name="id" placeholder="账号" @input="handleInput1" v-model="username">
      </div>
      <div class="row">
        <i class="iconfont icon-mima text"></i>
        <input type="password" name="password" placeholder="密码" @input="handleInput2" v-model="password">
      </div>
      <div class="row">
        <i class="iconfont icon-ecurityCode text vali_icon"></i>
        <input type="text" name="validateCode" placeholder="验证码" @input="handleInput3" style="width: 0.8rem;" v-model="code">
        <i class="iconfont icon-Subtraction1 error" v-if="correct===0"></i>
        <i class="iconfont icon-Subtraction correct" v-else-if="correct===1"></i>
        <img src="" alt="" class="validate_img" @click="changeImg">
      </div>
      <div class="submit">
        <button type="button" :class="{btnActive: complete, btnUnActive: unComplete}" :disabled="unComplete===true" @click="handleRegister">注册</button>
      </div>
    </div>
    <!-- <img src="../../assets/img/complate.gif" alt="" style="width: 0.3rem; height: 0.4rem; margin-left: 2rem; margin-top: 2rem;"> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Register',
  created() {
    this.$store.dispatch('validate', Math.random()); 
  },
  mounted() {
    // 获取验证码图片
    document.getElementsByClassName('validate_img')[0].src = 'http://gxl.xssy.work/api/captcha/' + Math.random();
  },
  data () { 
    return {
      // 验证码是否正确
      correct: 2,
      // 是否每个框输入
      input: [false, false, false],
      // 填写完整
      complete: false,
      // 未填写完整
      unComplete: true,
      username: '',
      password: '',
      code: ''
    }
  },
  computed: {
    ...mapState({
      // 验证码信息
      validate_src: state => state.user.validate_src,
      // 注册信息
      register_info: state => state.user.register_info    
    }), 
  },
  methods: {
    // 返回登录界面
    goLast() {
      this.$router.push({
          name: 'Login'
        });
    },
    // 判断第一个输入框是否输入
    handleInput1() {
      this.input[0] = true;
      if (this.input[0] === true && this.input[1] === true && this.input[2] === true) {
        this.complete = true;
        this.unComplete = false;
      }
    },
    // 判断第二个输入框是否输入
    handleInput2() {
      this.input[1] = true;
      if (this.input[0] === true && this.input[1] === true && this.input[2] === true) {
        this.complete = true;
        this.unComplete = false;
      }
    },
    // 判断第三个输入框是否输入
    handleInput3() {
      this.input[2] = true;
      if (this.input[0] === true && this.input[1] === true && this.input[2] === true) {
        this.complete = true;
        this.unComplete = false;
      } 
    },
    // 更换验证码
    changeImg() {
      document.getElementsByClassName('validate_img')[0].src = 'http://gxl.xssy.work/api/captcha/' + Math.random();
    },
    // 用户注册
    handleRegister() {
      // 分发注册请求
      this.$store.dispatch('register', {
        username: this.username,
        password: this.password,
        code: this.code
      }).then(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#register {
  position: relative;
  width: 100%;
  height: 100%;
}
#register header {
  padding: 0 0.16rem;
  display: flex;
  align-items: center;
  height: 0.48rem;
  background: #1e88e5;
}
#register header .close {
  font-size: 0.16rem;
  color: #fff;
}
#register header .title {
  margin-left: 1.38rem;
  font-size: 0.18rem;
  color: #fff;
}
#register .form {
  width: 100%;
  height: 1.5rem;
}
#register .form .row {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 0.5rem;
  padding: 0 0.16rem;
  border-bottom: 0.01rem solid #f8f8f8;
}
#register .form .row .text {
  font-size: 0.20rem!important;
  color: #1e88e5;
  margin-right: 0.14rem;
}
#register .form .row .vali_icon {
  font-size: 0.16rem!important;
}
#register .form .row input {
  width: 100%;
  height: 0.4rem;
  line-height: 0.2rem;
  font-size: 0.16rem;
  color: #222;
}
#register .form .row .correct {
  position: absolute;
  left: 1.3rem;
  color: #51aa38;
}
#register .form .row .error {
  position: absolute;
  left: 1.3rem;
  color: #e76b66;
}
#register .form .row .validate_img {
  margin-left: 1rem;
  width: 1.2rem;
  height: 0.32rem;
  vertical-align: center;
}
#register .form .submit {
  height: 0.94rem;
  padding: 0.24rem 0.3rem;
}
#register .form .submit button {
  width: 100%;
  height: 0.46rem;
  font-size: 0.16rem;
  color: #fff;
  -webkit-border-radius: 0.05rem;
  -moz-border-radius: 0.05rem;
  -ms-border-radius: 0.05rem;
	border-radius: 0.05rem;
}
.btnActive {
  background: #1e88e5;
}
.btnUnActive {
  background: #d2d2d2;
}
/*修改浏览器默认字体*/
input::-webkit-input-placeholder { /* WebKit browsers*/ 
  font-size: 0.16rem;
  color: #cccccc;
}
input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/ 
  font-size: 0.16rem;
  color: #cccccc;
}
input::-moz-placeholder {  /* Mozilla Firefox 19+*/ 
　font-size: 0.16rem;
  color: #cccccc;
}
input:-ms-input-placeholder { /* Internet Explorer 10+*/ 
  font-size: 0.16rem;
  color: #cccccc;
}
</style>
