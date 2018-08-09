<template>
	<div id="contact_group">
		<!-- 头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">分组</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<div class="group_box">
			<h4>选择组别</h4>
			<div class="group">
				<ul>
					<li v-for="(group, index) in groups" :class="{ groupActive: isGroup===index }" @click="changeGroup(index, group.phone_group_id, group.name)" :key="index">{{ group.name }}</li>
				</ul>
			</div>
		</div>
		<EditList :isImg="isImg" :list="contactList" :multi="multi" page="group" v-on:group="receive"></EditList>
	</div>
</template>

<script type="text/javascript">
	import { mapState } from 'vuex'
	import EditList from '@/components/contact/EditList'
	export default {
		created() {
			// 加载分组名称
			this.$store.dispatch('groupList', {
				token: this.token,
				user_id: this.user_id,
			}).then(res => {
				
			}, err => {
				if (err.response.status == 401) {
					// 重新登录
					this.overtime();
				}
			});
			// 清空联系人列表
			this.$store.commit('changeContactList');
			// 加载通讯录列表
			this.$store.dispatch('contactList', {
				token: this.token,
				user_id: this.user_id,    
				page: this.page,
				page_num: 10,
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
				screenY = document.documentElement.clientHeight;
			document.getElementById('edit_list').style.height = (screenY - lisTop) + 'px'; 
		},
		data() {
			return {
				token: sessionStorage.getItem('token'),
        		user_id: Number(sessionStorage.getItem('userId')),
        		page: 1,
				isGroup: '',
				// 临时保存分组联系人id
				group: [],
				isImg: true,
				multi: true,
				// 分组id
				phone_group_id: '',
				// 分组名称
				phone_group_name: '',
			}
		},
		computed: {
			...mapState({
				// 导入分组名称
				groups: state => state.contact.groups,
				// 导入通讯录联系人
				contactList: state => state.contact.contactList
			})
		},
		methods: {
			changeGroup(idx, id, name) {
				this.isGroup = idx;
				this.phone_group_id = id;
				this.phone_group_name = name;
			},
			// 返回通讯录页面
			goLast() {
				this.$router.push({ name: 'Contact' });
			},
			// 处理完成
			handleOpt() {
				if (this.group.length == 0 || !this.phone_group_id) {
					// 未选择分组
					this.$message({
		            	message: '亲，未选择分组哦!',
		            	type: 'warning',
		            	duration: 1500
		        	});
		        	return;
				}
				// 保存分组
				this.$store.dispatch('saveGroup', {
					token: this.token,
					user_id: this.user_id,    
					phone_group_id: Number(this.phone_group_id),
					phone_group_name: this.phone_group_name,
					address_book_id: this.group.join('-')
				}).then(res => {
					this.$router.push({ name: 'Contact' });
				}, err => {
					if (err.response.status == 401) {
						// token过期
						this.overtime();
					}
				});
			},
			// 接收选中的联系人
			receive([flag, content]) {
				// 添加进分组
				if (flag == 1) {
					this.group.push(content);
				}
				// 从分组中删除
				else if (flag == 0) {
					// splice(index, len, item), 参数为: 索引, 长度, 替换的值
					// 找到删除项的索引
					var idx = this.group.indexOf(content);
					// 删除该项
					this.group.splice(idx, 1);
				}
			}
		},
		components: { 
			EditList
		}
	}
</script>

<style type="text/css" scoped>
#contact_group {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
}
#contact_group .group_box {
	height: 0.8rem;
	margin: 0.16rem 0;
	padding: 0 0.15rem;
	background: #fff; 
}
#contact_group .group_box h4 {
	height: 0.4rem;
	display: flex;
	align-items: center;
	font-weight: normal;
	font-size: 0.14rem;
	color: #666;
}
#contact_group .group_box .group ul {
	display: flex;
	justify-content: space-between;
}
#contact_group .group_box .group ul li {
	width: 0.6rem;
	height: 0.22rem;
	font-size: 0.16rem;
	color: #444;
	text-align: center;
	border: 0.01rem solid #cacaca;
	-webkit-border-radius: 0.2rem;
  -moz-border-radius: 0.2rem;
  -ms-border-radius: 0.2rem;
}
.groupActive {
	background: #1e88e5;
	color: #fff!important;
	font-size: 0.14rem!important;
	border: none;
}
</style>