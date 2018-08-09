// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

/***********************************自定义部分***********************************/
/*******************************************************************************/

/************************* 引入插件css *************************/
// 引入iconfont
import './assets/iconfont/iconfont.css'
// 引入公共样式文件
import './assets/css/common.css'
import './assets/css/reset.css'
// 引入element-UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

/************************* 全局定义过滤器 *************************/
/**
 * 格式化多项内容显示
 */
Vue.filter('setContent', function(content) {
    var formatText = content.join(',');
    return formatText;
});
Vue.filter('setSlice', function(content) {
    var formatText = content.slice(0, 2);
    return formatText;
});

/************************* 全局定义函数 *************************/
/** 
 * token过期，重新登录
 */
Vue.prototype.overtime = function() {
    // 提示token已过期
    this.$message({
        message: 'token已过期，请重新登录',
        type: 'error',
        duration: 1500
    });
    setTimeout(() => {
        // 如果token过期, 置空token，跳转登录页面
        sessionStorage.setItem('token', '');
        this.$router.push({ name: 'Login' });
    }, 2000);
}

/**
 * 全局路由
 * 登录之后才能访问其他页面
 * 解决无限循环，最终必须next()跳出
 */
router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem('token');
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (token) {
            // token存在, 代表已登录
            next();
        } else {
            // 在这里堆栈溢出, 去登录页面
            next('/login');
        }
    } else {
        // 一定要调用next()
        next();
    }
});

/***********************************自定义部分***********************************/
/*******************************************************************************/

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})