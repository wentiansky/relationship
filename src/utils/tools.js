/** 
 * cookie API 
 * 存储cookie: cookie(key, value, options)
 * 读取cookie: cookie(key)
 */
export const cookie = (key, value, options) => {
    /* 存储cookie */
    if (typeof value !== "undefined") { // 有传递 value 则保存cookie
        options = options || {};
        // 构建cookie字符串
        var _cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        // 判断是否有可选参数的设置
        if (options.expires) { // 有设置失效时间
            var date = new Date();
            date.setDate(date.getDate() + options.expires);
            _cookie += ";expires=" + date.toUTCString();
        }
        if (options.path) // 有设置路径
            _cookie += ";path=" + options.path;
        if (options.domain) // 有设置域
            _cookie += ";domain=" + options.domain;
        if (options.secure) // 有设置链接条件
            _cookie += ";secure";

        // 保存
        return document.cookie = _cookie;
    }

    /* 读取cookie */
    // 获取所有的cookie
    var cookies = document.cookie.split("; ")
        // 遍历每条cookie，判断是否当前要找的 cookie 内容
    for (var i = 0, len = cookies.length; i < len; i++) {
        // 将当前遍历到的 key=value 内容以 = 分割
        var parts = cookies[i].split("=");
        // 数组中第一个元素为 cookie 名
        var name = decodeURIComponent(parts.shift());
        // 判断当前cookie名是否为要查找的cookie名称
        if (name === key)
            return decodeURIComponent(parts.join("=")); // 返回cookie 值
    }
    // 如果不存在查找的cookie
    return undefined;
}

/**
 * 删除cookie 
 */
export const removeCookie = (key, options) => {
    options = options || {};
    options.expires = -1;
    cookie(key, '', options);
}

/**
 * 存储storage API
 * sessionStorage API
 * localStorage API
 */
export const setStorage = (type, key, value) => {
	if (!key) return;
	if (typeof value != 'string') {
		value = JSON.stringify(value);
	}
	if (type === 'session') {
		window.sessionStorage.setItem(key, value);
	} else {
		window.localStorage.setItem(key, value);
	}
}

/**
 * 获取storage 
*/
export const getStorage = (type, key) => {
	if (!key) return;
	if (type === 'session') {
		return window.sessionStorage.getItem(key);
	} else {
		return window.localStorage.getItem(key);
	}
}

/**
 * 删除storage 
 */
export const removeStorage = (type, key) => {
	if (!key) return;
	if (type === 'session') {
		window.sessionStorage.removeItem(key);
	} else {
		window.localStorage.removeItem(key);
	}
}