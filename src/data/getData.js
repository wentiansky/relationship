import fetch from '../utils/fetch'

// 用户登录
export const login = (username, password) => fetch('/api/login', {
		username,
		password
}, 'POST');
