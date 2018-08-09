<template>
	<div id="parent_child">
		<div v-for="(parent, index) in parentChild" :key="index">
			<h4>{{ parent.title }}</h4>
			<ul>
				<li v-for="(type, index) in parent.type" :key="index" @click="goNext(type)">
					<span class="title">{{ type }}</span>
					<span class="content">sdsda</span>
					<i class="iconfont icon-jiantou icon"></i>
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		props: {
			parentChild: null, 
		},
		methods: {
			goNext(type) {
				console.log(type);
				var path = '';
				switch(type) {
					case '上级职位':
						path = 'PositionParentChild';
						break;
					case '下级职位':
						path = 'PositionParentChild';
						break;
					case '行政范围':
						path = 'Location';
						break;	
					case '机构':
						path = 'MechanismIndex';
						break;
					case '上级机构':
						path = 'MechanismParentChild';
						break;
					case '下级机构':
						path = 'MechanismParentChild';
						break;
					case '部门':
						path = 'DepartmentIndex';
						break;
					case '上级部门':
						path = 'DepartmentParentChild';
						break;
					case '下级部门':
						path = 'DepartmentParentChild';
						break;
				}
				// 跳转至相应的页面
				this.$router.push({ name: path });
			}
		}
	}
</script>

<style type="text/css" scoped>
#parent_child {
	width: 100%;
	background: #f6f6f6;
	overflow: auto;
}
#parent_child h4 {
	padding-left: 0.16rem;
	font-size: 0.12rem;
	color: #888;
	height: 0.36rem;
	line-height: 0.36rem;
}
#parent_child ul {
	background: #fff;
	padding: 0 0.16rem;
	box-sizing: border-box;
	border-top: 0.01rem solid #e6e6e6;
	border-bottom: 0.01rem solid #e6e6e6;
}
#parent_child ul li {
	position: relative;
	display: flex;
	align-items: center;
	height: 0.5rem;
	border-bottom: 0.01rem solid #f1f1f1;
}
#parent_child ul li:last-child {
	border-bottom: none;
}
#parent_child ul li .title {
	font-size: 0.16rem;
	color: #222;
}
#parent_child ul li .content {
	position: absolute;
	font-size: 0.14rem;
	color: #999;
	top: 0.13rem;
	right: 0.15rem;
}
#parent_child ul li .icon {
	position: absolute;
	font-size: 0.12rem;
	color: #999;
	top: 0.13rem;
	right: 0;
}
</style>