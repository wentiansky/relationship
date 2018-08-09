import {
	RECORD_USERINFO
} from './mutation-types.js'
import { setStorage, getStorage } from '@/utils/tools.js'

export default {
	// 记录用户信息
	[RECORD_USERINFO](state, info) {
		setStorage('session', 'token', info.token);
		setStorage('session', 'userId', info.user_id);
	}
}