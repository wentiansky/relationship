import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

// 引入用户模块
import user from './modules/user'
// 引入通讯录模块
import contact from './modules/contact'
// 导入分析模块
import analyse from './modules/analyse'

Vue.use(Vuex)
export default new Vuex.Store({
	mutations,
	modules: {
		user,
		contact,
		analyse
	}
});