<template>
	<div id="search_box">
		<input type="text" :placeholder="search.placeholder" v-model="content" @input="sendMainMechanism">
		<div class="search_list" v-show="isList===true">
			<ul>
				<li v-for="(mechanism, index) in mechanismList" @click="handleChoose(mechanism.mechanism_id, mechanism.mechanism_name)">{{ mechanism.mechanism_name }}</li>
			</ul>
			<!-- <button @click="handleAdd" v-show="isAdd==true">{{ search.content }}</button> -->
		</div>
	</div>
</template>

<script type="text/javascript">
	import { mapState } from 'vuex'
	// 节流函数
	const delay = (function() {
		let timer = 0;
		return function(callback, ms) {
	    	clearTimeout(timer);
	    	timer = setTimeout(callback, ms);
	  	};
	})();
	
	export default {
		props: {
			// 接受搜索组件参数
			search: null,
			// 跳转回去的页面
			page: null,
		},
		mounted() {
			setTimeout(() => {
				this.content = this.mainMechanism;
			}, 100);
		},
		data() {
			return {
				content: '',
				isList: true,
				isComplete: false,
				isFirst: true,
				// 相关参数
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
				// 职位索引
				idx: this.$route.query.id,
				mechanismList: [],
			}
		},
		computed: {
			...mapState({
				// 导入主要机构
				mainMechanism: state => state.contact.mainMechanism
			})
		},
		watch: {
			//监视content变化
			content() {
				this.isComplete = false;
		    	delay(() => {
		    		this.handleSearch();
		    	}, 300);
			},
		},
		methods: {
			// 发送主要机构
			sendMainMechanism() {
				this.$emit('mainMechanism', this.content);
			},
			// 输入内容，搜索机构
			handleSearch() {
				if (this.isFirst) {
					// 第一次改变content不搜索
					this.isFirst = false;
				} else {
					if (!this.isComplete) {
						this.isList = true;
						if (this.content) {
							this.$store.dispatch('searchMechanism', {
								token: this.token,
								user_id: this.user_id,
								name: this.content,
							}).then(res => {
								this.mechanismList = res;
							}, err => {
								if (err.response.status == 401) {
									// token过期
									this.overtime();
								}
							});
						} else {
							// 未找到
							this.isList = false;
							this.mechanismList = [];
						}
					}
				}
			},
			// 选择选项
			handleChoose(id, name) {
				this.content = name;
				// 匹配其他机构
				this.$store.dispatch('matchMechanism', {
					token: this.token,
					user_id: this.user_id,
					position_id: Number(this.idx),
					name: this.content
				}).then(res => {
					// 返回匹配到的机构
					this.$emit('mainMechanism', this.content);
					this.$emit('mechanism', res);
					this.isList = false;
					this.isComplete = true;
				}, err => {
					if (err.response.status == 401) {
						// token过期
						this.overtime();
					}
				});	
			}
		}
	}
</script>

<style type="text/css" scoped>

</style>