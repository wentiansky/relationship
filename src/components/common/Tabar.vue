<template>
  <div id="tabar">
    <ul>
      <li><router-link to="/relationship"><i class="iconfont icon-Union1 icon"></i><span>关系链</span></router-link></li>
      <li><router-link to="/analyse"><i class="iconfont icon-Union2 icon"></i><span>分析</span></router-link></li>
      <li><router-link to="/contact"><i class="iconfont icon-Subtraction10 icon"></i><span>通讯录</span></router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Tabar',
  data () {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#tabar {
  border-top: 0.01rem solid #e6e6e6;
  width: 100%;
  height: 0.5rem;
  position: absolute;
  bottom: 0;
  left: 0;
}
#tabar ul {
  display: flex;
  height: 0.5rem;
  justify-content: space-around;
  align-items: center;
  background: #fff;
}
#tabar ul li a {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#tabar ul li a {
  color: #9d9d9d;
}
#tabar ul li a .icon {
  font-size: 0.2rem!important;
}
#tabar ul li a span {
  font-size: 0.12rem;
}
.router-link-exact-active {
  color: #1e88e5!important;
}
</style>
