<template>
	<div id="edit_list">
		<ul>
			<li v-for="(item, index) in list" @click="choose(index)" :key="index">
				<div class="headImg" v-if="isImg===true">
					<img :src="item.head_pic" alt="头像" v-if="item.head_pic!=''">
					<span v-else>{{ item.name | setSlice }}</span>
				</div>
				<span>{{ item.name }}</span>
				<i class="iconfont icon-Subtraction7 isChoose" v-if="item.flag==true"></i>
				<i class="iconfont icon-Subtraction9 noChoose" v-else></i>
			</li>
		</ul>
	</div>
</template>

<script type="text/javascript">
	import Vue from 'vue'
	export default {
		props: {
			// 是否显示头像
			isImg: null,
			// 列表数据
			list: null,
			// 是否多选
			multi: null,
			// 哪个页面调用
			page: null
		},
		data() {
			return {
				// 选择长度
				length: 0,
				// 选择开关
				switch: true,
			}
		},
		methods: {
			choose(idx) {
				// 多选
				if (this.multi) {
					if (this.list[idx].flag == false) {
						// 关闭选择功能
						if (!this.switch)
						return;
						this.list[idx].flag = true;
						// vue是通过检测get,set才得知数据是否更新的，而对于数组来说，是没有get，set方法的，所以需要我们自己手动触发，需要发送消息通知vue
						Vue.set(this.list, idx, this.list[idx]);
						// 列表选中项的个数增加
						this.length++;
						if (this.page == 'background') {
							// 向背景页面传值
							if (this.list[idx].user_data_id) {
								// 请求回来的背景传id
								this.$emit('background', [1, this.list[idx].user_data_id]);
							} else {
								// 本地添加的背景传新姓名
								this.$emit('background', [1, this.list[idx].name]);
							}
						} else if (this.page == 'favorite') {
							// 向亲信页面传值
							if (this.list[idx].user_data_id) {
								// 请求回来的亲信传id
								this.$emit('favorite', [1, this.list[idx].user_data_id]);
							} else {
								// 本地添加的亲信传新姓名
								this.$emit('favorite', [1, this.list[idx].name]);
							}
						} else if (this.page == 'group') {
							// 向分组页面传值
							// 请求回来的联系人传id
							this.$emit('group', [1, this.list[idx].address_book_id]);
						} else if (this.page == 'analyse') {
							// 向分析页面传值
							this.$emit('analyse', [1, this.list[idx].user_data_id]);
							if (this.length == 2) {
								// 最多只能选择两个人, 关闭选择功能
								this.switch = false;
							}
						}
					} else {
						// 取消选择
						this.list[idx].flag = false;
						Vue.set(this.list, idx, this.list[idx]);
						// 列表选中项的个数减少
						this.length--;
						if (this.page == 'background') {
							// 向背景页面传值
							if (this.list[idx].user_data_id) {
								// 请求回来的背景传id
								this.$emit('background', [0, this.list[idx].user_data_id]);
							} else {
								// 本地添加的背景传新姓名
								this.$emit('background', [0, this.list[idx].name]);
							}
						} else if (this.page == 'favorite') {
							// 向亲信页面传值
							if (this.list[idx].user_data_id) {
								// 请求回来的亲信传id
								this.$emit('favorite', [0, this.list[idx].user_data_id]);
							} else {
								// 本地添加的亲信传新姓名
								this.$emit('favorite', [0, this.list[idx].name]);
							}
						} else if (this.page == 'group') {
							// 向分组页面传值
							// 请求回来的联系人传id
							this.$emit('group', [0, this.list[idx].address_book_id]);
						} else if (this.page == 'analyse') {
							if (this.length == 1) {
								// 打开选择功能
								this.switch = true;
							}
							// 向分析页面传值
							this.$emit('analyse', [0, this.list[idx].user_data_id]);
						}
					}
				} else if (!this.multi) {
					// 单选
					if (this.list[idx].flag == false) {
						// 选中当前
						this.list.forEach((item) => {
							item.flag = false;
						}); 
						this.list[idx].flag = true;
						if (this.page == 'industry') {
							// 向行业页面传值
							this.$emit('industry', this.list[idx].id);
						} else if (this.page == 'department') {
							// 向部门页面传值
							this.$emit('department', [this.list[idx].department_id, this.list[idx].name]);
						}
					} else {
						// 取消选择
						this.list[idx].flag = false;
						if (this.page == 'industry') {
							// 向行业页面传值
							this.$emit('industry', '');
						} else if (this.page == 'department') {
							// 向部门页面传值
							this.$emit('department', ['', '']);
						}
					}
				} 
			}
		}
	}
</script>

<style type="text/css" scoped>

</style>