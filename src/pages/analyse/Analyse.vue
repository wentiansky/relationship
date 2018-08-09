<template>
	<div id="analyse">
		<!-- 头部 -->
		<div id="contact_header">
			<div class="return"></div>
			<div class="title">选择对象</div>
			<div class="opt" @click="handleOpt">分析</div>
		</div>
		<EditList :isImg="isImg" :list="analyseList" :multi="multi" page="analyse" v-on:analyse="receive"></EditList>
		<Tabar class="tabar"></Tabar>
	</div>
</template>

<script type="text/javascript">
	import { mapState } from 'vuex'
	import EditList from '@/components/contact/EditList'
	import Tabar from '@/components/common/Tabar';
	export default {
		created() {
			// 加载分析列表
			this.$store.dispatch('analyseList', {
				token: this.token,
				user_id: this.user_id,    
			}).then(res => {	
				
			}, err => {
				if (err.response.status == 401) {
					// token过期
					this.overtime();
				}
			});
		},
		mounted() {
			var lisTop = document.getElementById('edit_list').offsetTop,
				tabTop = document.getElementsByClassName('tabar')[0].offsetTop;
			document.getElementById('edit_list').style.height = (tabTop - lisTop) + 'px';
		},
		data() {
			return {
				isImg: true,
				multi: true,
				// 分析的联系人
				analyse: [],
				// 相关参数
				token: sessionStorage.getItem('token'),
        		user_id: Number(sessionStorage.getItem('userId')),
			}
		},
		computed: {
			...mapState({
				// 导入分析列表
				analyseList: state => state.analyse.analyseList
			})
		},
		methods: {
			handleOpt() {
				// 保存要分析人的id到本地
				sessionStorage.setItem('relation_user_id', JSON.stringify(this.analyse));
				// 跳转至分析详情页面
				this.$router.push({ name: 'AnalyseDetail'});
			},
			// 接收选中的联系人
			receive([flag, content]) {
				// 添加进分析
				if (flag == 1) {
					this.analyse.push(content);
				}
				// 从分析中删除
				else if (flag == 0) {
					// splice(index, len, item), 参数为: 索引, 长度, 替换的值
					// 找到删除项的索引
					var idx = this.analyse.indexOf(content);
					// 删除该项
					this.analyse.splice(idx, 1);
				}
			}
		},
		components: { 
			EditList,
			Tabar
		}
	}
</script>

<style type="text/css" scoped>
#analyse {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
}
#contact_header {
	margin-bottom: 0.16rem;
}
</style>