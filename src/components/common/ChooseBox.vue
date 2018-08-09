<template>
	<div id="choose_box">
		<div class="row">
			<h4>查看范围</h4>
			<ul>
				<li v-for="(range, index) in ranges" :class="{chooseActive: isRange===index}" @click="changeRange(index)">{{ range }}</li>
			</ul>
		</div>
		<div class="row">
			<h4>查看类型</h4>
			<ul class="type">
				<li v-for="(type, index) in types" :class="{chooseActive: isType===index}" @click="changeType(index)">{{ type }}</li>
			</ul>
		</div>
		<div class="confirm">
			<button>确定</button>
		</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		data() {
			return {
				ranges: ['全部', '地区', '垂管', '行业', '集团'],
				types: ['职务管理', '组织机构', '机构关联', '地区分管'],
				isRange: 0,
				isType: 1
			}
		},
		methods: {
			changeRange(idx) {
				this.isRange = idx;
			},
			changeType(idx) {
				this.isType = idx;
			}
		}
	}
</script>

<style type="text/css" scoped>
 #choose_box {
	position: absolute;
	width: 100%;
	height: 0;
	background: #fff;
	border-top: 0.02rem solid #f2f2f2;
	transition: all 0.5s;
	overflow: hidden;
	z-index: 10;
}
 #choose_box .row {
	height: 0.8rem;
	padding: 0 0.15rem;
	overflow: hidden;
}
 #choose_box .row h4 {
	font-size: 0.14rem;
	color: #333333;
	margin-top: 0.1rem;
	margin-bottom: 0.1rem;
}
 #choose_box .row ul {
	display: flex;
	justify-content: space-between;
	height: 0.38rem;
	border-bottom: 0.02rem solid #f8f8f8;
}
 #choose_box .row ul li {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 0.6rem;
	height: 0.24rem;
	font-size: 0.12rem;
	color: #666;
	border-radius: 0.2rem;
	border: 0.01rem solid #cacaca;
}
 #choose_box .row .type li {
	width: 0.76rem;
}
 #choose_box .confirm {
	margin-top: 0.14rem;
	padding: 0 0.15rem;
}
 #choose_box .confirm button {
	width: 100%;
	height: 0.46rem;
	background: #fff;
	border: 0.01rem solid #1e88e5;
	border-radius: 0.06rem;
	color: #1e88e5;
	font-size: 0.16rem;
}
.chooseActive {
	background: #1e88e5;
	color: #fff!important;
	border: none;
}
</style>