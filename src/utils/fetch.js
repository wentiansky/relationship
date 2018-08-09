const baseUrl = process.env.API_ROOT;

export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
	type = type.toUpperCase();
	url = baseUrl + url;

	// GET方法
	if (type === 'GET') {
		let dataStr = ''; // 数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		});

		if (dataStr !== '') {
			// 去掉最后的&符号
			dataStr = dataStr.substring(0, dataStr.length - 1);
			// 拼接url
			url = url + '?' + dataStr;
		}
	}

	// DELETE方法
	if (type === 'DELETE') {
		url = url + '/' + data.id;
	}

	// 若浏览器支持fetch方法
	if (window.fetch && method === 'fetch') {
		console.log('支持fetch')
		let requestConfig = {
			credentials: 'include', // 是否发送cookie到服务端
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'cors', // 跨域设置
			cache: 'force-cache'
		}

		if (type === 'POST') {
			if (window.FormData && data instanceof FormData) {
				Object.defineProperty(requestConfig, 'body', {
					value: formDataToJson(data)
				})
			} else {
				Object.defineProperty(requestConfig, 'body', {
					value: JSON.stringify(data)
				});	
			}
		}

		try {
			const response = await fetch(url, requestConfig);
			const responseJSON = await response.json();
			return responseJSON;
		} catch (error) {
			throw new Error(error);
		}
	} else {
		// 浏览器不支持fetch方法
		return new Promise((resolve, reject) => {
			let requestObj;
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
				console.log('高版本ie')
			} else {
				// 兼容低版本IE
				requestObj = new ActiveXObject;
				console.log('低版本ie')
			}

			let sendData = '';
			if (type === 'POST') {
				sendData = JSON.stringify(data);
			}

			requestObj.open(type, url, true);
			requestObj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			requestObj.send(sendData);

			requestObj.onreadystatechange = () => {
				if (requestObj.readyState === 4) {
					if (requestObj.status === 200) {
						let obj = requestObj.response;
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj);
					} else {
						reject(requestObj);
					}
				}
			}
		});
	}
}