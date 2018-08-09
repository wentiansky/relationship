<template>
	<div id="create">
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">创建新资源</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<div class="background"></div>
		<!-- 编辑列表 -->
		<ContactCreate></ContactCreate>
	</div>	
</template>

<script type="text/javascript">
	import ContactCreate from '@/components/contact/ContactCreate'
	import { mapState } from 'vuex'
	export default {
		mounted() {
			// 置空信息列表
			this.$store.commit('resetInfo');
		},
		data() {
			return {

			}
		},
		computed: {
			...mapState({

			})
		},
		methods: {
			// 返回创建页面
			goLast() {
				this.$router.push({ name: 'Contact' });
			},
			// 处理完成
			handleOpt() {
				this.$router.push({ name: 'Contact' });
			}
		},
		components: {
			ContactCreate
		}
	}
</script>

<style type="text/css" scoped>
#create {
	width: 100%;
	height: 100%;
	background: #fff;
}
#create .background {
	height: 0.16rem;
	background: #f6f6f6;
}
</style>