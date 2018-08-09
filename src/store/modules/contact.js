/* 联系人数据仓库 */
import axios from 'axios'

const state = {
	// 联系人列表
	contactList: [],
	// 分组的联系人列表
	groupContactList: [
		{
			phone_group_id: 0,
			phone_group_name: '全部',
			flag: false,
			data: []
		},
		{
			phone_group_id: 1,
			phone_group_name: '同乡',
			flag: false,
			data: []
		},
		{
			phone_group_id: 2,
			phone_group_name: '朋友',
			flag: false,
			data: []
		},
		{
			phone_group_id: 3,
			phone_group_name: '工作',
			flag: false,
			data: []
		},
		{
			phone_group_id: 4,
			phone_group_name: '校友',
			flag: false,
			data: []
		},
		{
			phone_group_id: 5,
			phone_group_name: '家庭',
			flag: false,
			data: []
		},
	],
	// 分组名列表
	groups: '',
	// 背景/亲信人物列表
	backgroundList: '',
	// 行业列表
	industryList: '',
	// 部门列表
	departmentList: '',
	// 地区列表
	areaList: '',
	// 用户资料id
	user_data_id: '',
	// 通讯录id
	address_book_id: '',
	// 头像
	headImg: '',
	// 姓名
	name: '',
	// 行业
	industry: '',
	// 背景
	background: '',
	// 亲信
	favorite: '',
	// 联系方式
	phone: '',
	// 所有职位id数组
	postionArr: [],
	// 主要职位
	main_position: '',
	// 主要机构
	mainMechanism: '',
}

const getters = {
	
}

const mutations = {
	/************为各个列表赋值******************/
	// 通讯列表录赋值
	contactList(state, payload) {
		// 若is_bind为0, 显示我
		payload.forEach((item, index) => {
			if (item.is_bind == 0 && !item.name) {
				item.name = '我';
			} else if (item.is_bind == 0) {
				item.name = item.name + '(我)';
			}
			item.flag = false;
		});
		state.contactList = payload;
		// 对联系人列表进行分组
		state.groupContactList.forEach((item, index) => {
			item.data = [];
			item.flag = false;
		});
		payload.forEach((item, index) => {
			if (item.phone_group_id == 0) {
				// 全部
				state.groupContactList[0].data.push(item);
				state.groupContactList[0].flag = true;
			} else if (item.phone_group_id == 1) {
				// 同乡
				state.groupContactList[1].data.push(item);
				state.groupContactList[1].flag = true;
			} else if (item.phone_group_id == 2) {
				// 朋友
				state.groupContactList[2].data.push(item);
				state.groupContactList[2].flag = true;
			} else if (item.phone_group_id == 3) {
				// 工作
				state.groupContactList[3].data.push(item);
				state.groupContactList[3].flag = true;
			} else if (item.phone_group_id == 4) {
				// 校友
				state.groupContactList[4].data.push(item);
				state.groupContactList[4].flag = true;
			} else if (item.phone_group_id == 5) {
				// 家庭
				state.groupContactList[5].data.push(item);
				state.groupContactList[5].flag = true;
			} 
		});
	},
	// 分组列表赋值
	groupList(state, payload) {
		state.groups = payload;
	},
	// 为背景/亲信列表赋值
	backgroundList(state, payload) {
		var background_list = JSON.parse(sessionStorage.getItem('background_list')) || [],
			favorite_list = JSON.parse(sessionStorage.getItem('favorite_list')) || [],
			isBackground = sessionStorage.getItem('isBackground');
		// 若为背景列表
		if (isBackground == 'true') {
			if (background_list) {
				state.backgroundList = payload.concat(background_list);
				sessionStorage.setItem('background_list', JSON.stringify([]));
			} else {
				state.backgroundList = payload;
			}
		} else if (isBackground == 'false') {
			// 若为亲信列表
			if (favorite_list) {
				state.backgroundList = payload.concat(favorite_list);
				sessionStorage.setItem('favorite_list', JSON.stringify([]));
			} else {
				state.backgroundList = payload;
			}
		}
		// 添加flag: false键值对
		state.backgroundList.forEach((item) => {
			item.flag = false;
		});
	},
	// 第一页回显列表
	dataFirstList(state, payload) {
		state.headImg = payload.head_pic;
		state.name = payload.name;
		state.phone = payload.phone;
		state.favorite = payload.cronies;
		state.background = payload.background;
		state.industry = payload.trade;
		state.user_data_id = payload.user_data_id;
		state.address_book_id = payload.address_book_id;
		state.main_position = payload.main_position_name;
	},
	// 行业列表赋值
	industry(state, payload) {
		// 添加flag: false键值对
		payload.forEach((item) => {
			item.flag = false;
		});
		state.industryList = payload;
	},
	// 部门列表赋值
	departmentList(state, payload) {
		// 添加flag: false键值对
		payload.forEach((item) => {
			item.flag = false;
		});
		state.departmentList = payload;
	},
	// 省列表赋值
	province(state, payload) {
		state.areaList = payload;
	},
	// 城市列表赋值
	city(state, payload) {
		state.areaList = payload;
	},
	// 县列表赋值
	county(state, payload) {
		state.areaList = payload;
	},
	// 镇列表赋值
	town(state, payload) {
		state.areaList = payload;
	},
	// 村列表赋值
	community(state, payload) {
		state.areaList = payload;
	},
	// 主要机构赋值
	mainMechanism(state, payload) {
		state.mainMechanism = payload.mechanism_name;
	},
	/************为各个列表赋值******************/

	/****************保存相关信息**************/
	// 保存用户头像
	saveHeadImg(state, payload) {
		state.headImg = payload;
	},
	// 保存姓名 
	saveName(state, payload) {
		// 新建联系人, 保存相关id至sessionStorage
		var add = sessionStorage.getItem('add')
		if (add) {
			sessionStorage.setItem('address_book_id', payload.address_book_id);
			sessionStorage.setItem('user_data_id', payload.user_data_id);
		}
	},
	// 保存省份id
	saveProvince(state,	id) {
		state.province = id;
	},
	// 保存城市id
	saveCity(state, id) {
		state.city = id;
	},
	// 保存县id
	saveCounty(state, id) {
		state.county = id;
	},
	// 保存镇id
	saveTown(state, id) {
		state.town = id;
	},
	// 保存村id
	saveCommunity(state, id) {
		state.community = id;
	},
	/****************保存相关信息**************/

	/****************改变相关信息**************/
	// 清空新建页面信息
	resetInfo(state) {
		state.headImg = '';
		state.name = '';
		state.phone = '';
		state.industry = '';
		state.background = '';
		state.favorite = '';
		state.main_position = '';
	},
	/****************改变相关信息**************/
}

const actions = {
	/*********************加载各种列表*********************/
	// 加载通讯录列表
	contactList({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/user/book/publish', payload)
			.then((res) => {
				commit('contactList', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);
			});
		});	
	},
	// 加载分组列表
	groupList({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/user/group', payload)
			.then((res) => {
				commit('groupList', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);
			});
		});	
	},
	// 加载第一页的回显列表
	dataFirstList({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/user/dataPublish', payload)
			.then((res) => {
				commit('dataFirstList', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);
			});
		});	
	},
	// 加载行业列表
	industry({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.get('/api/user/industry', payload)
			.then(res => {
				commit('industry', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 加载背景/亲信列表
	backgroundList({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/user/getAddressBook', payload)
			.then(res => {
				commit('backgroundList', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 加载部门列表
	departmentList({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/publishDepartment', payload)
			.then(res => {
				commit('departmentList', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 加载省份列表
	province({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.get('/api/common/province', payload)
			.then(res => {
				commit('county', res.data.data);
				resolve(res.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 加载城市列表
	city({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.get('/api/common/city/' + payload)
			.then(res => {
				commit('city', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 加载县区列表
	county({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.get('/api/common/county/' + payload)
			.then(res => {
				commit('county', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 加载镇列表
	town({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.get('/api/common/town/' + payload)
			.then(res => {
				commit('town', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 加载村列表
	community({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.get('/api/common/community/' + payload)
			.then(res => {
				commit('community', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 加载职位列表
	positionList({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/publishMainPosition', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 职位回显第一页
	positionInfo({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/publish', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	/*********************加载各种列表*********************/

	/*********************保存信息到后台*******************/
	// 保存分组
	saveGroup({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/user/phoneGroup', payload)
			.then(res => {
				// commit('saveGroup', res.data);
				resolve(res.data);
			}, err => {
				reject(err);
			});
		});
	},
	// 上传用户头像
	saveHeadImg({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/user/setHeadPic', payload)
			.then(res => {
				commit('saveHeadImg', res.data);
				resolve(res.data);
			}, err => {
				reject(err);
			});
		});
	},
	// 保存用户姓名至后台
	saveName({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/user/setName', payload)
			.then(res => {
				commit('saveName', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);
			});
		});
	},
	// 保存联系方式至后台
	savePhone({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/user/setPhone', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);
			});
		});
	},
	// 保存行业
	saveIndustry({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/user/setTrade', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);
			});
		});
	},
	//保存背景
	saveBackground({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/user/setBackground', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 保存亲信
	saveFavorite({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/user/setCronies', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 新增或者修改职位
	savePosition({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/setName', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 设置主职位
	setMainPos({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/setMainPosition', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 设置上级职位
	setParentPos({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/setParentName', payload)
			.then(res => {
				resolve(res.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 设置下级职位
	setChildPos({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/setChildName', payload)
			.then(res => {
				resolve(res.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 保存部门
	saveDepartment({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/setDepartment', payload)
			.then(res => {
				resolve(res.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 保存行政范围
	saveRegion({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/setRegion', payload)
			.then(res => {
				resolve(res.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 搜索机构
	searchMechanism({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/mechanismNameMatch', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 匹配机构
	matchMechanism({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/mechanismMatch', payload)
			.then(res => {
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 机构回显
	showMechanism({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/publishMechanism', payload)
			.then(res => {
				commit('mainMechanism', res.data.data);
				resolve(res.data.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 保存机构
	saveMechanism({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/setMechanism', payload)
			.then(res => {
				resolve(res.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 设置内部机构
	setInside({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/setInside', payload)
			.then(res => {
				resolve(res.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 设置垂直机构
	setPlumb({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/setPlumb', payload)
			.then(res => {
				resolve(res.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 设置地区机构
	setRegion({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/setRegionName', payload)
			.then(res => {
				resolve(res.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 设置行业机构
	setIndustry({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/setIndustry', payload)
			.then(res => {
				resolve(res.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 设置集团机构
	setCompany({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/position/setCompany', payload)
			.then(res => {
				resolve(res.data);
			}, err => {
				reject(err);	
			});
		});
	},
	// 删除联系人
	deleteContact({ commit }, payload) {
		return new Promise((resolve, reject) => {
			axios.post('/api/user/delete', payload)
			.then(res => {
				resolve(res.data);
			}, err => {
				reject(err);	
			});
		});
	},
	/*********************保存信息到后台*******************/
}

export default {
	state,
	getters,
	mutations,
	actions
}