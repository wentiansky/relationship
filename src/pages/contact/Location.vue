<template>
	<div id="location">
		<!-- 范围头部 -->
		<div id="contact_header">
			<div class="return" @click="goLast">
				<i class="iconfont icon-fanhui icon"></i><span>返回</span>
			</div>
			<div class="title">行政范围</div>
			<div class="opt" @click="handleOpt">完成</div>
		</div>
		<!-- 当前选择 -->
		<div class="selected">
			<h4>当前选择</h4>
			<ul>
				<li v-for="(place, index) in places" @click="choosePlace(index)" :class="{ active: level == index }" :key="index">{{ place }}
					<span style="margin-left: 0.04rem">></span>
				</li>
			</ul>
		</div>
		<div class="choose">
			<h4>选择</h4>
			<div id="edit_list">
				<ul>
					<li v-for="(item, index) in areaList" @click="choose(index, item)" :key="index">
						<span>{{ item.name }}</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import { mapState } from 'vuex'
	export default {
		mounted() {
			// 设置列表的高度
			var lisTop = document.getElementById('edit_list').offsetTop,
				screenY = document.documentElement.clientHeight;
			document.getElementById('edit_list').style.height = (screenY - lisTop) + 'px';
			// 加载省份列表
			this.$store.dispatch('province', {
				token: this.token,
				user_id: this.user_id,
				is_bind: 1
			}).then(res => {
					// 
				}, err => {
					// token过期
					this.overtime();				
				});
		},
		data() {
			return {
				// 地区级别 0: 省, 1: 市, 2: 县, 3: 镇, 4: 村
				level: 0,
				// 地区选项
				places: ['省', '市', '县', '镇', '村'],
				// 职位索引
				idx: this.$route.query.id,
				// 相关参数
				token: sessionStorage.getItem('token'),
				user_id: Number(sessionStorage.getItem('userId')),
				// 地区相关id
				province: '',  // 省份/自治区/直辖市/特别行政区/
				city: '',      // 城市/地区/州
				county: '',    // 县/区
				town: '',      // 镇/乡
				community: '', // 社区/村
			}
		},
		computed: {
			...mapState({
				// 导入地区列表
				areaList: state => state.contact.areaList
			})
		},
		methods: {
			// 返回职位选择页
			goLast() {
				var id = this.idx;
				this.$router.push({ name: 'PositionChoose', query: { id } });
			},
			// 处理完成
			handleOpt() {
				// 保存行政范围
				if (!this.province || !this.city || !this.county || !this.town || !this.community) {
					this.$message({
		            	message: '请选择完整的地区',
		            	type: 'error',
		            	center: true,
		            	duration: 1500
		        	});
		        	return;
				}
				this.$store.dispatch('saveRegion', {
					token: this.token,
					user_id: this.user_id,
					position_id: Number(this.idx),
					province_id: this.province.toString(),
					city_id: this.city.toString(),
					county_id: this.county.toString(),
					town_id: this.town.toString(),
					community_id: this.community.toString()
				}).then(res => {
					// 返回职位选择页
					this.$router.push({ name: 'PositionChoose', query: { id } });
				}, err => {
					if (err.response.status == 401) {
						// token过期
						this.overtime();
					}
				});	
			},
			// 重置地区
			choosePlace(idx) {
				if (idx == 0) {
					// 重置省份
					this.places = ['省', '市', '县', '镇', '村'];
					// 置空所有id
					this.province = '';
					this.city = '';
					this.county = '';
					this.town = '';
					this.community = '';
					this.level = 0;
					// 重新请求省列表
					this.$store.dispatch('province', {
						token: this.token,
						user_id: this.user_id,
						is_bind: 1
					}).then(res => {
							
					}, err => {
						// token过期
						this.overtime();				
					});
				} else if (idx == 1) {
					// 不能直接选城市
					var province_id = this.province;
					if (province_id) {
						// 重置城市
						this.places.splice(1, 4, '市', '县', '镇', '村');
						// 置空id
						this.city = '';
						this.county = '';
						this.town = '';
						this.community = '';
						// 重新请求城市列表
						this.$store.dispatch('city', province_id)
						.then(res => {
							this.level = 1;
						});
					}
					
				} else if (idx == 2) {
					// 不能直接选县
					var city_id = this.city;
					if (city_id) {
						// 重置县
						this.places.splice(2, 3, '县', '镇', '村');
						// 置id
						this.county = '';
						this.town = '';
						this.community = '';
						// 重新请求县列表
						this.$store.dispatch('county', city_id)
						.then(res => {
							this.level = 2;
						});
					}
					
				} else if (idx == 3) {
					// 不能直接选镇
					var county_id = this.county;
					if (county_id) {
						// 重置镇
						this.places.splice(3, 2, '镇', '村');
						// 置空id
						this.town = '';
						this.community = '';
						// 重新请求镇列表
						this.$store.dispatch('town', county_id)
						.then(res => {
							this.level = 3;
						});
					}
				} else if (idx == 4) {
					// 不能直接选村
					var town_id = this.town;
					if (town_id) {
						// 重置村
						this.places.splice(4, 1, '村');
						// 置空村id
						this.community = '';
						// 重新请求村列表
						this.$store.dispatch('community', town_id)
						.then(res => {
							this.level = 4;
						});
					}
				} 
			},
			// 选择地区，加载对应的列表
			choose(idx, item) {
				if (this.level == 0) {
					// 获取城市
					this.$store.dispatch('city', item.province_id

					).then(res => {
						// 保存省份
						this.province = item.province_id
						// 改变展示
						this.places[0] = item.name;
						this.level = 1;
					}, err => {
						console.log(err);			
					});	
				} else if (this.level == 1) {
					// 获取县
					this.$store.dispatch('county', item.city_id

					).then(res => {
						// 保存城市
						this.city = item.city_id;
						// 改变展示
						this.places[1] = item.name;
						this.level = 2;
					}, err => {
						console.log(err);			
					});	
				} else if (this.level == 2) {
					// 获取镇
					this.$store.dispatch('town', item.county_id

					).then(res => {
						// 保存县
						this.county = item.county_id;
						// 改变展示
						this.places[2] = item.name;
						this.level = 3;
					}, err => {
						console.log(err);			
					});	
				} else if (this.level == 3) {
					// 获取村
					this.$store.dispatch('community', item.town_id

					).then(res => {
						// 保存镇
						this.town = item.town_id;
						// 改变展示
						this.places[3] = item.name;
						this.level = 4;
					}, err => {
						console.log(err);			
					});	
				} else if (this.level == 4) {
					// 保存村
					this.community = item.community_id;
					// 改变展示
					// vue中无法直接通过索引更改数组值触发视图更新，故采用数组的splice方法触发视图更新
					this.places.splice(4, 1, item.name); 
				}				
			}
		}
	}
</script>

<style type="text/css" scoped>
#location {
	background: #f6f6f6;
	width: 100%;
	height: 100%;
}
#location .selected {
	/*height: 0.8rem;*/
	background: #fff;
}
#location .selected h4 {
	height: 0.3rem;
	padding-left: 0.16rem;
	box-sizing: border-box;
	line-height: 0.3rem;
	font-size: 0.12rem;
	color: #888;
	background: #f6f6f6;
}
#location .selected ul {
	padding-left: 0.16rem;
	box-sizing: border-box;
	height: 0.5rem;
	border-top: 0.01rem solid #e9e9e9;
	border-bottom: 0.01rem solid #e9e9e9;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}
#location .selected ul li {
	font-size: 0.14rem;
	color: #222;
	margin-right: 0.12rem;
}
#location .selected ul li:last-child span {
	display: none;
}
.active {
	color: #1e88e5!important;
}
#location .choose {
	background: #fff;
}
#location .choose h4 {
	height: 0.3rem;
	padding-left: 0.16rem;
	box-sizing: border-box;
	line-height: 0.3rem;
	font-size: 0.12rem;
	color: #888;
	background: #f6f6f6;
}
</style>