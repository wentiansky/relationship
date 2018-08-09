<template>
	<div id="rela_header">
		<div class="return" @click="goLast">
			<i class="iconfont icon-fanhui icon icon1"></i><span>返回</span>
		</div>
		<h3><span>{{ header.person }}</span>{{ header.title }}</h3>
		<div class="choose" @click="handleChoose">
			<span>筛选</span>
			<i class="iconfont icon-shaixuan icon icon2"></i>
		</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		data() {
			return {
				chooseFlag: false
			}
		},
		props: {
			header: null
		},
		methods: {
			// 返回上一页
			goLast() {
				this.$router.go(-1);
			},
			handleChoose() {
				if (this.chooseFlag == false) {
					document.getElementById('choose_box').style.height = '2.38rem';
					this.chooseFlag = true;
				} else {
					document.getElementById('choose_box').style.height = '0rem';
					this.chooseFlag = false;
				}
			}
		}
	}
</script>

<style type="text/css">
#rela_header {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 0.44rem;
	padding: 0 0.15rem; 
	background: #fff;
}
#rela_header h3 {
	font-size: 0.18rem;
	color: #222;
}
#rela_header h3 span {
	margin-right: 0.08rem;
}
#rela_header .choose {
	display: flex;
	align-items: center;
	height: 0.44rem;
}
#rela_header .choose span {
	font-size: 0.14rem;
	margin-right: 0.03rem;
	color: #1e88e5;
}
#rela_header .choose .icon {
	/*margin-top: 0.04rem;*/
	font-size: 0.15rem;
	color: #1e88e5;
}
#rela_header .return {
	display: flex;
	align-items: center;
	height: 0.44rem;
}
#rela_header .return .icon {
	font-size: 0.22rem!important;
	color: #1e88e5;
	margin-right: 0.04rem;	
}
#rela_header .return span {
	font-size: 0.14rem;
	color: #1e88e5;
}
</style>