export const directive = {
	directives: {
		// 自定义聚焦指令
		focus: {
			inserted: function(el) {
				el.focus();
			},
			
		}
	}
}