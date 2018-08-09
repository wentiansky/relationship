<template>
	<div id="favorite">
		<!-- 亲信头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">亲信</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<button @click="handleAdd" class="add">没有找到? 点击添加亲信</button>
		<EditList :isImg="isImg" :list="backgroundList" :multi="multi" page="favorite" v-on:favorite="receive"></EditList>
	</div>
</template>

<script type="text/javascript">
	import Vue from 'vue'
	import EditList from '@/components/contact/EditList'
	import { mapState } from 'vuex'
	export default {
		created() {
			// 加载背景亲信列表
			this.$store.dispatch('backgroundList', {
				token: this.token,
				user_id: this.user_id,    
				user_data_id: this.user_data_id
			}).then(res => {
				// 回显第一页用户资料中的亲信
				this.$store.dispatch('dataFirstList', {
					token: this.token,
					user_id: this.user_id,
					address_book_id: this.address_book_id,
					is_bind: this.is_bind
				}).then(res => {
					// 选中的亲信
					var names = res.cronies.split('-');
					// 回显列表选中项
					this.backgroundList.forEach((item, index) => {
						for (var i = 0; i < names.length; i++) {
							if (item.name == names[i]) {
								item.flag = true;
								Vue.set(this.backgroundList, index, this.backgroundList[index]);
								if (item.user_data_id)
									this.favorite.push(item.user_data_id);
								else 
									this.favorite.push(item.name);
								break;
							} else {
								item.flag = false;
								Vue.set(this.backgroundList, index, this.backgroundList[index]);
							}
						}
					});
				}, err => {
					if (err.response.status == 401) {
						// 重新登录
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
				// 显示头像
				isImg: true,
				// 多选
				multi: true,
				// 亲信
				favorite: [],
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
				user_data_id: Number(sessionStorage.getItem('user_data_id')),
				address_book_id: Number(sessionStorage.getItem('address_book_id')),
        		is_bind: Number(sessionStorage.getItem('is_bind'))
			}
		},
		computed: {
			...mapState({
				// 导入vuex中背景亲信列表
				backgroundList: state => state.contact.backgroundList,
				// 导入vuex中添加的亲信
				Favorite: state => state.contact.favorite
			})
		},
		methods: {
			// 返回创建页面
			goLast() {
				this.$router.push({ name: 'Edit' });
			},
			// 处理完成
			handleOpt() {
				// 保存亲信到后台
				this.$store.dispatch('saveFavorite', {
					token: this.token,
					user_id: this.user_id,    
					user_data_id: this.user_data_id,
					cronies: this.favorite.join('-')
				}).then(res => {
					// 跳转回创建页面
					this.$router.push({ name: 'Edit' });		
				}, err => {
					if (err.response.status == 401) {
						// token过期
						this.overtime();
					}
				});
			},
			handleAdd() {
				this.$router.push({ name: 'FavoriteAdd' });
			},
			// 接收选中的亲信
			receive([flag, content]) {
				// 添加亲信
				if (flag == 1) {
					this.favorite.push(content);
				}
				// 删除亲信
				else if (flag == 0) {
					// splice(index, len, item), 参数为: 索引, 长度, 替换的值
					// 找到删除项的索引
					var idx = this.favorite.indexOf(content);
					// 删除该项
					this.favorite.splice(idx, 1);
				}
				console.log(this.favorite)
			}
		},
		components: {
			EditList
		}
	}
</script>

<style type="text/css" scoped>
#favorite {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
}
#favorite .add {
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