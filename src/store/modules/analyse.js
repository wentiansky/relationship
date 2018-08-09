// 分析数据仓库
import axios from 'axios'

const state = {
	// 分析人列表
	analyseList: '',
	// 关系列表
	typeList: '',
}

const getters = {

}

const mutations = {
	// 分析列表赋值
	analyseList(state, payload) {
		payload.forEach((item, index) => {
			item.flag = false;
		});
		state.analyseList = payload;
	},
	// 关系分类列表增加flag
	relationType(state, payload) {
		payload.forEach((item, index) => {
			item.flag = false;
		});
		state.typeList = payload;
	}
}

const actions = {
	// 请求分析列表
	analyseList({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/chain/lists', payload)
			.then(res => {
				commit('analyseList', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);
			});
		});
	},
	// 发送分析人的信息到后台
	sendAnalyseInfo({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/chain/getEveryChain', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);
			});
		});
	},
	// 获取关系分类
	relationType({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/chain/link', payload)
			.then(res => {
				commit('relationType', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);
			});
		});
	},
	// 新增关系
	addRelation({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/chain/create', payload)
			.then(res => {
				resolve(res.data);
			}, err => {
				reject(err);
			});
		});
	},
	// 生成个人中心的关系图
	relationMap({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/chain/get', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);
			});
		});
	},
	// 获取登录用户信息
	getUserInfo({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/chain/getUserInformation', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);
			});
		});
	},
	// 设置中心
	setCenter({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/chain/setCenter', payload)
			.then(res => {
				resolve(res.data.data);
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