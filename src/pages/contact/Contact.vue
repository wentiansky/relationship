<template>
	<div id="contact">
		<!-- 头部 -->
		<header>
			<div class="search_box">
				<i class="iconfont icon-fangdajing scale"></i>
				<input type="search" class="search" placeholder="搜索" v-model="search">
			</div>
			<span class="manage" @click="handleSearch">搜索</span>
		</header>

		<!-- 添加或分组 -->
		<div class="option">
			<ul>
				<li><i class="iconfont icon-Subtraction4 icon3"></i><span>更新导入手机通讯录</span></li>
				<li @click="goCreate"><i class="iconfont icon-Subtraction5 icon1"></i><span>新的朋友</span></li>
				<li @click="goGroup"><i class="iconfont icon-Subtraction3 icon2"></i><span>分组</span></li>
			</ul>
		</div>

		<!-- 联系人列表 -->
		<div class="groupList">
			<div v-for="(group, index) in groupContactList" v-if="group.flag==true" :key="index">
				<div class="all">{{ group.phone_group_name }}</div>
				<!-- v-on:scroll="handleScroll" -->
				<div class="contact_list" ref="list">
					<ul>
						<li v-for="(person, index) in group.data" @click="goEdit(person.is_bind, person.address_book_id, person.user_data_id)" :key="index">
							<div class="headImg" :class="{ backColor: person.head_pic!='' }">
								<img :src="person.head_pic" alt="头像" v-if="person.head_pic!=''">
								<span v-else>{{ person.name | setSlice }}</span>
							</div>
							<span>{{ person.name }}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
		
		<Tabar class='tabar'></Tabar>
	</div> 
</template>

<script type="text/javascript">
	// 引入tabar
	import Tabar from '@/components/common/Tabar'
	// 引入vuex
	import { mapState } from 'vuex'
	export default {
		/* 加载通讯录列表 */
		created() {
			// 清空联系人列表
			this.$store.dispatch('contactList', {
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
			this.setListHeight();
			window.addEventListener('resize', () => {
				this.setListHeight();
			}, false);
		},

		data() {
			return {
				flag: true,
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
				search: ''
			}
		},

		computed: {
			...mapState({
				// 导入通讯录联系人
				contactList: state => state.contact.contactList,
				// 导入分组联系人列表
				groupContactList: state => state.contact.groupContactList
			})
		},

		methods: {
			/* 动态设置列表的高度 */
			setListHeight() {
				var tabTop = document.getElementsByClassName('tabar')[0].offsetTop,
				lisTop = document.getElementsByClassName('groupList')[0].offsetTop;
				document.getElementsByClassName('groupList')[0].style.height = (tabTop - lisTop) + 'px';
				// alert(document.getElementsByClassName('groupList')[0].style.height);
			},

			/* 跳转分组页面 */
			goGroup() {
				this.$router.push({name: 'ContactGroup'});
			},

			/* 跳转至新建联系人页面 */
			goCreate() {
				sessionStorage.setItem('add', true);
				this.$router.push({ name: 'Create' });
			},

			/* 跳转至联系人编辑页面 */
			goEdit(is_bind, book_id, data_id) {
				// 标记为编辑
				sessionStorage.setItem('add', false);
				// 保存is_bind, address_book_id, user_data_id
				sessionStorage.setItem('is_bind', is_bind);
				sessionStorage.setItem('address_book_id', book_id);
				sessionStorage.setItem('user_data_id', data_id);
				this.$router.push({ name: 'Edit' });
			},

			/* 搜索联系人 */
			handleSearch() {
				this.$store.dispatch('contactList', {
					token: this.token,
					user_id: this.user_id,
					keywords: this.search
				}).then(res => {
					
				}, err => {
					if (err.response.status == 401) {
						// token过期
						this.overtime();
					}
				});
			},

			/* 滚动分页 */
			/*handleScroll() {
				var height = Number(this.$refs.list.style.height.slice(0, -2));
				if (this.flag) {
					if (this.$refs.list.scrollHeight - this.$refs.list.scrollTop == height) {
						// 加载更多数据
						// 出现加载图标
						const loading = this.$loading({
				        	lock: true,
				        	text: '加载更多联系人',
				        	spinner: 'el-icon-loading',
				        	background: 'rgba(0, 0, 0, 0.9)',
				        	target: document.querySelector('.tabar')
				        });
						this.page++;
						this.$store.dispatch('contactList', {
							token: this.token,
							user_id: this.user_id,    
							page: this.page,
							page_num: 10,
						}).then(res => {
							setTimeout(() => {
								// 关闭加载图标
								loading.close();
							}, 500);
							if (res.length == 0) {
								// 没有更多数据
								this.flag = false;
							}
						}, err => {
							if (err.response.status == 401) {
								// token过期
								this.overtime();
							}
						});
					}
				}	
			}*/
		},

		components: {
			Tabar
		}
	}
</script>

<style type="text/css" scoped>
#contact {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
}
#contact header {
	display: flex;
	align-items: center;
	height: 0.62rem;
	background: #fff;
	margin-bottom: 0.16rem;
	padding: 0.13rem 0.15rem;
}	
#contact header .search_box {
	display: flex;
	align-items: center;
	width: 3.02rem;
	height: 0.36rem;
	background: #ededee;
	-webkit-border-radius: 0.05rem;
  -moz-border-radius: 0.05rem;
  -ms-border-radius: 0.05rem;
}
#contact header .search_box .scale {
	margin-top: 0.04rem;
	margin-left: 0.1rem;
	margin-right: 0.06rem;
	font-size: 0.18rem!important;
	color: #aeaeae;
}
#contact header .search_box input[type="search"] {
	width: 2.6rem;
	height: 0.36rem;
	font-size: 0.14rem;
	color: #222222;
	background: #ededee;
}
#contact header .manage {
	position: absolute;
	right: 0.16rem;
	font-size: 0.14rem;
	color: #1e88e5;
}
/*修改浏览器默认字体*/
input::-webkit-input-placeholder { /* WebKit browsers*/ 
  font-size: 0.14rem;
  color: #aeaeae;
}
input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/ 
  font-size: 0.14rem;
  color: #aeaeae;
}
input::-moz-placeholder {  /* Mozilla Firefox 19+*/ 
　font-size: 0.14rem;
  color: #aeaeae;
}
input:-ms-input-placeholder { /* Internet Explorer 10+*/ 
  font-size: 0.14rem;
  color: #aeaeae;
}
#contact .option {
	/*height: 1.3rem;*/
	background: #fff;
}
#contact .option ul {
	padding-left: 0.15rem;
	/*height: 1.3rem;*/
	background: #fff;
}
#contact .option ul li {
	display: flex;
	align-items: center;
	height: 0.64rem;
	border-bottom: 0.01rem solid #f1f1f1;
}
#contact .option ul li .icon1 {
	font-size: 0.34rem;
  color: #51aa38;
  margin-top: 0.1rem;
  margin-right: 0.14rem;
}
#contact .option ul li .icon2 {
	font-size: 0.34rem;
  color: #e76b66;
  margin-top: 0.1rem;
  margin-right: 0.14rem;
}
#contact .option ul li .icon3 {
	font-size: 0.34rem;
  color: #eda150;
  margin-top: 0.1rem;
  margin-right: 0.14rem;
}
#contact .option ul li span {
	font-size: 0.16rem;
  color: #222;
}
#contact .groupList {
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}
#contact .all {
	padding-left: 0.15rem;
	display: flex;
	height: 0.3rem;
	align-items: center;
	font-size: 0.12rem;
  color: #9e9e9e;
}
#contact .contact_list {
	background: #fff;
}
#contact .contact_list ul {
	flex-direction: column;
	padding-left: 0.15rem;
	background: #fff;
	overflow: hidden;
}
#contact .contact_list ul li {
	display: flex;
	align-items: center;
	height: 0.64rem;
	border-bottom: 0.01rem solid #f1f1f1;
}
#contact .contact_list ul li .headImg {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 0.41rem;
	height: 0.41rem;
	margin-right: 0.12rem;
	border-radius: 50%;
	background: #1e88e5;
}
.backColor {
	background: #fff!important;
}
#contact .contact_list ul li .headImg img {
	width: 0.41rem;
	height: 0.41rem;
	border-radius: 50%;
}
#contact .contact_list ul li .headImg span {
	font-size: 0.12rem;
	color: #fff;
}
#contact .contact_list ul li span {
	font-size: 0.16rem;
  color: #222;
}
</style>