/* 用户数据仓库 */
import axios from 'axios'

const state = {
	// 注册返回数据
	register_info: '',
	// 验证码图片
	validate_src: '',
	// 登录返回信息
	login_info: ''
}

const getters = {
	
}

const mutations = {
	/* 为注册信息赋值 */
	register(state, result) {
		state.register_info = result
	},
	/* 为登录信息赋值 */
	login(state, result) {
		state.login_info = result;
	},
	/* 为验证码图片赋值 */
	validate(state, result) {
		state.validate_src = result;
	}
}

const actions = {
	/* 获取验证码图片 */
	validate({ commit }, payload) {
		axios.get('/api/captcha/' + payload)
		.then((res) => {
			commit('validate', res.data);
		});
	},
	/* 注册请求 */
	register({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/register', payload)
			.then((res) => {
				commit('register', res.data);
				resolve(res.data);
			}, err => {
				reject(err);
			});
		});	
	},
	/* 登录请求 */
	login( { commit }, payload) {
		console.log(process.env.API_ROOT);
		return new Promise((resolve, reject) => {
			// process.env.API_ROOT + 
			axios.post(process.env.API_ROOT + '/api/login', payload)
			.then(res => {
				commit('login', res.data);
				resolve(res.data);
			}, err => {
				reject(err);
			});
		});
	},
	// 注销
	logout( { commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/logout', payload)
			.then(res => {
				resolve(res);
			}, err => {
				reject(err);
			});
		});
	},
}

export default {
	state,
	getters,
	mutations,
	actions
}