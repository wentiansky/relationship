<template>
	<div id="department">
		<!-- 部门头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">部门</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<button @click="handleAdd" class="add">没有找到? 点击添加部门</button>
		<EditList :isImg="isImg" :list="departmentList" :multi="multi" page="department" v-on:department="receive"></EditList>
	</div>
</template>

<script type="text/javascript">
	import EditList from '@/components/contact/EditList'
	import { mapState } from 'vuex'
	export default {
		created() {
			// 加载部门列表
			this.$store.dispatch('departmentList', {
				token: this.token,
				user_id: this.user_id,
				user_data_id: this.user_data_id
			}).then(res => {
				var departmentArr = res;
				// 回显已选部门
				this.$store.dispatch('positionInfo', {
					token: this.token,
					user_id: this.user_id,
					position_id: this.idx
				}).then(res => {
					departmentArr.forEach((item, index) => {
						if (item.name == res.department[0].department_name) {
							item.flag = true;
							this.department_id = item.department_id;
							this.department_name = item.name;
						} else {
							item.flag = false;
						}
					});
				}, err => {
					if (err.response.status == 401) {
						// token过期
						this.overtime();
					}
				});
			}, err => {
				if (err.response.status == 401) {
					// token过期
					this.overtime();
				}
			});
		},
		mounted() {
			var lisTop = document.getElementById('edit_list').offsetTop,
				screenY = document.documentElement.clientHeight;
			document.getElementById('edit_list').style.height = (screenY - lisTop) + 'px';
		},
		data() {
			return {
				// 不显示头像
				isImg: false,
				// 多选
				multi: false,
				// 职位索引
				idx: this.$route.query.id,
				// 部门
				department_id: '',
				department_name: '',
				// 相关参数
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
				user_data_id: Number(sessionStorage.getItem('user_data_id')),
			}
		},
		computed: {
			...mapState({
				// 导入部门列表
				departmentList: state => state.contact.departmentList
			})
		},
		methods: {
			// 返回职位选择页面
			goLast() {
				var id = this.idx;
				this.$router.push({ name: 'PositionChoose', query: { id } });
			},
			// 处理完成
			handleOpt() {
				var id = this.idx;
				// 选择部门, 并保存
				this.$store.dispatch('saveDepartment', {
					token: this.token,
					user_id: this.user_id,
					position_id: Number(id),
					name: this.department_name,
					department_id: this.department_id
				}).then(res => {
					// 返回职位选择页
					this.$router.push({ name: 'PositionChoose', query: { id } });
				}, err => {
					if (err.response.status == 401) {
						// 重新登录
						this.overtime();
					}
				});
			},
			handleAdd() {
				// 跳转添加部门页面
				var id = this.idx;
				this.$router.push({ name: 'DepartmentAdd', query: { id } });
			},
			// 接收选中的部门
			receive([id, name]) {
				this.department_id = id;
				this.department_name = name;
				console.log(this.department_id, this.department_name)
			}
		},
		components: {
			EditList
		}
	}
</script>

<style type="text/css" scoped>
#department {
	background: #f6f6f6;
	width: 100%;
	height: 100%;
}
#department .add {
	display: block;
	box-sizing: border-box;
	width: 90%;
	height: 0.46rem;
	background: #fff;
	border: 0.01rem solid #1e88e5;
	border-radius: 0.06rem;
	color: #1e88e5;
	font-size: 0.16rem;
	padding: 0 0.15rem;
	margin: 0.16rem auto;
}
</style>