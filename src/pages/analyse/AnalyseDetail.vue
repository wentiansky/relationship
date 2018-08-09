<template>
	<div id="analyse_detail">
		<RelationshipHeader :header="header"></RelationshipHeader>
		<!-- 筛选层 -->
		<ChooseBox></ChooseBox>
		<!-- 菜单栏 -->
		<div class="menu">
			<ul>
				<li @click="markBackground">
					<i class="iconfont icon-Subtraction6 icon icon1"></i>
					<span>标记背景</span>
				</li>
				<li @click="markFavorite">
					<i class="iconfont icon-Subtraction8 icon icon2"></i>
					<span>标记亲信</span>
				</li>
				<li @click="alertRelation">
					<i class="iconfont icon-Subtraction2 icon icon3"></i>
					<span>新增关系</span>
				</li>
			</ul>
		</div>
		<!-- 选择关系弹框 -->
		<div class="mask" @click="cancelNew(box_id)"></div>
		<div class="type_box">
			<h4>温馨提示: 如需自定义关系,请先取消选中的关系</h4>
			<input type="text" placeholder="自定义关系" v-model="type_name" ref='defineLink'>
			<ul>
				<li :key="index" v-for="(type, index) in typeList" @click="handleChoose(type.link_id, type.link_name, index, type.flag)" :class="{ chooseActive: isType===index }">{{ type.link_name }}</li>
			</ul>
			<button type="button" class="newRelation" @click="newRelation">新建关系</button>
		</div>
		<!-- 关系图 -->
		<div id="main">
			
		</div>
	</div>
</template>

<script type="text/javascript">
import RelationshipHeader from "@/components/relationship/RelationshipHeader";
import ChooseBox from "@/components/common/ChooseBox";
import echarts from "echarts";
import { mapState } from "vuex";

// 去重(相同方向连线显示一条线)
function noRepeat(arr, obj) {
  for (var i = 0; i < arr.length; i++) {
    if (
      obj.source == arr[i].source.toString() &&
      obj.target == arr[i].target.toString()
    ) {
      // 存在
      return [i, obj.name];
    }
  }
  // 不存在
  return -1;
}
export default {
  created() {
    // 得到分析的两个联系人id
    this.addRelation =
      JSON.parse(sessionStorage.getItem("relation_user_id")) || [];
    // 加载关系分类列表
    this.$store
      .dispatch("relationType", {
        token: this.token,
        user_id: this.user_id
      })
      .then(
        res => {},
        err => {
          if (err.response.status == 401) {
            // token过期
            this.overtime();
          }
        }
      );
    // 回显关系图
    this.showRelation();
  },
  mounted() {
    this.$nextTick(function() {
      // 开始绘图
      this.drawPie("main");
      // 绑定点击事件
      var Vue = this;
      this.charts.on("click", function(params) {
        console.log(params);
        // 取消选中
        if (params.value == 1) {
          // 从addRelation数组中删除该id
          var idx = Vue.addRelation.indexOf(params.data.name);
          Vue.addRelation.splice(idx, 1);
          // 取消变色
          Vue.$set(
            Vue.opinionData[params.dataIndex].itemStyle.normal,
            "color",
            "#1e88e5"
          );
          // 改变value标记
          Vue.$set(Vue.opinionData[params.dataIndex], "value", 0);
          params.value = 0;
          // 重新渲染关系图
          Vue.drawPie("main");
        } else if (params.value == 0) {
          // 选中, 只能选择两个人
          if (Vue.addRelation.length < 2) {
            // 添加该id到addRelation数组
            Vue.addRelation.push(params.data.name);
            // 选中变色
            Vue.$set(
              Vue.opinionData[params.dataIndex].itemStyle.normal,
              "color",
              "#eda150"
            );
            // 改变value标记
            Vue.$set(Vue.opinionData[params.dataIndex], "value", 1);
            params.value = 1;
            // 重新渲染关系图
            Vue.drawPie("main");
          }
        }
      });
    });
  },
  data() {
    return {
      header: {
        person: "",
        title: "分析图"
      },
      // 自定义关系
      type_id: "",
      type_name: "",
      // 关系框id
      box_id: "",
      // 是否选中
      isType: "",
      // echarts
      charts: "",
      // 人物数据
      opinionData: [],
      // 关系
      link: [],
      relationList: JSON.parse(sessionStorage.getItem("relationList")),
      // 新增关系数组
      addRelation: [],
      // 相关参数
      token: sessionStorage.getItem("token"),
      user_id: Number(sessionStorage.getItem("userId"))
    };
  },
  computed: {
    ...mapState({
      // 关系列表
      typeList: state => state.analyse.typeList
    })
  },
  methods: {
    // 定义回显关系图函数
    showRelation() {
      // 发送分析人id到后台
      this.$store
        .dispatch("sendAnalyseInfo", {
          token: this.token,
          user_id: this.user_id,
          user_data_id: this.addRelation[0],
          link_user_data_id: this.addRelation[1]
        })
        .then(
          res => {
            // 清空数据
            this.opinionData = [];
            this.link = [];
            var color = "",
              value = "",
							symbol = "";
            // 组装关系图数据
            res.name.forEach((item, index) => {
              // 选中的人物变色
              if (
                item.source_id == this.addRelation[0] ||
                item.source_id == this.addRelation[1]
              ) {
                color = "#eda150";
                value = 1;
              } else {
                color = "#1e88e5";
                value = 0;
              }
							// 有无头像
							if (item.head_pic) {
								symbol = 'image://' + item.head_pic;
							} else {
								symbol = 'rect';
							}
              // 添加人物
              this.opinionData.push({
                // 人物id, 唯一索引
                name: item.source_id,
								// 头像图片
								symbol,
                // 作为是否选中标记, 0未选中, 1选中
                value,
                // 覆盖在圆形上的标签(文字部分)
                label: {
                  show: true,
									padding: 20,
									/* 
									backgroundColor: {
										image: item.head_pic
									},
									borderRadius: 100, */
                  // label的值替换掉name的值
                  formatter: function(params) {
                    return item.source.slice(0, 3);
                  },
                 /*  formatter: function (params) {
										return '{pic|' + item.source.slice(0, 3) + '}';
									},
                  rich: {
                    pic: {
                      backgroundColor: {
                        image: item.head_pic
                      },
                    },
                  }, */
                },
                // 图形样式
                itemStyle: {
                  normal: {
                    color,
										borderWidth: 1,
										borderColor: '#000',
                  }
                }
              });
            });

            // 组装关系图关系
            res.link_data.forEach((item, index) => {
              var temp = {
                source: item.source_id.toString(),
                target: item.target_id.toString(),
                name: item.name
              };
              var idx = noRepeat(this.link, temp);
              if (idx == -1) {
                // 不存在, 添加进link
                this.link.push(temp);
              } else {
                // 同一条线, 拼接不同的关系
                this.link[idx[0]].name = this.link[idx[0]].name + ", " + idx[1];
              }
            });
            // 开始绘图
            this.drawPie("main");
          },
          err => {
            if (err.response.status == 401) {
              // token过期
              this.overtime();
            }
          }
        );
    },

    // 弹出新增关系弹框
    alertRelation() {
      document.querySelector(".mask").style.height = "100%";
      document.querySelector(".type_box").style.minHeight = "2.2rem";
      document.querySelector(".type_box").style.top = "35%";
      setTimeout(() => {
        document.querySelector(".type_box").style.height = "auto";
      }, 260);

      // 新增关系弹框id赋值
      this.box_id = 1;
    },

    // 点击mask, 弹框消失
    cancelNew(id) {
      if (id == 1) {
        // 新增关系弹框消失
        document.querySelector(".type_box").style.minHeight = "0rem";
        document.querySelector(".type_box").style.height = "0";
        document.querySelector(".type_box").style.top = "0";
      } else {
        // 新建联系人弹框消失
      }
      document.querySelector(".mask").style.height = "0rem";
    },

    // 选择关系
    handleChoose(id, name, idx, flag) {
      if (flag) {
        // 取消选中
        this.type_id = 0;
        this.type_name = "";
        this.isType = "";
        this.$refs.defineLink.removeAttribute("readonly");
        this.typeList[idx].flag = false;
      } else {
        // 选中
        this.typeList.forEach(item => {
          item.flag = false;
        });
        this.type_id = id;
        this.type_name = name;
        this.isType = idx;
        this.$refs.defineLink.setAttribute("readonly", "readonly");
        this.typeList[idx].flag = true;
      }
    },

    // 新建关系
    newRelation() {
      // 关闭弹框
      document.querySelector(".mask").style.height = "0rem";
      document.querySelector(".type_box").style.height = "0rem";
      document.querySelector(".type_box").style.minHeight = "0rem";
      document.querySelector(".type_box").style.top = "0";
      // 发送新建请求
      this.$store
        .dispatch("addRelation", {
          token: this.token,
          user_id: this.user_id,
          user_data_id: this.addRelation[0],
          link_user_data_id: this.addRelation[1],
          link_id: this.type_id || 0,
          link_name: this.type_name
        })
        .then(
          res => {
            // 保存要分析人的id到本地
            // sessionStorage.setItem('relation_user_id', JSON.stringify(this.addRelation));
            // 回显关系
            this.showRelation();
          },
          err => {
            if (err.response.status == 401) {
              // token过期
              this.overtime();
            }
          }
        );
    },

    // 新建背景
    markBackground() {
      this.$store
        .dispatch("addRelation", {
          token: this.token,
          user_id: this.user_id,
          user_data_id: this.addRelation[0],
          link_user_data_id: this.addRelation[1],
          link_id: 3,
          link_name: "背景"
        })
        .then(
          res => {
            // 保存要分析人的id到本地
            // sessionStorage.setItem('relation_user_id', JSON.stringify(this.addRelation));
            // 回显关系
            this.showRelation();
          },
          err => {
            if (err.response.status == 401) {
              // token过期
              this.overtime();
            }
          }
        );
    },

    // 新建亲信
    markFavorite() {
      this.$store
        .dispatch("addRelation", {
          token: this.token,
          user_id: this.user_id,
          user_data_id: this.addRelation[0],
          link_user_data_id: this.addRelation[1],
          link_id: 4,
          link_name: "亲信"
        })
        .then(
          res => {
            // 保存要分析人的id到本地
            // sessionStorage.setItem('relation_user_id', JSON.stringify(this.addRelation));
            // 回显关系
            this.showRelation();
          },
          err => {
            if (err.response.status == 401) {
              // token过期
              this.overtime();
            }
          }
        );
    },

    // 开始绘制图
    drawPie(id) {
      this.charts = echarts.init(document.getElementById(id));
      // 设置参数
      this.charts.setOption({
        // 标题
        title: { text: "关系图谱" },
        //工具箱，每个图表最多仅有一个工具箱
        /*toolbox: {
					show : true,
					//启用功能
						feature : {
							//dataView数据视图，打开数据视图，可设置更多属性,readOnly 默认数据视图为只读(即值为true)，可指定readOnly为false打开编辑功能
							dataView: { show: true, readOnly: true },
							//restore，还原，复位原始图表
							restore : { show: true },
							//saveAsImage，保存图片
							saveAsImage : { show: true }
						}
				},*/
        // 鼠标移到相应位置时显示的提示
        tooltip: {
          formatter: function(params) {
            return params.data.des;
          }
        },
        // 图例, 每个图表最多仅有一个图例
        legend: {
          // 布局方向
          orient: "vertical",
          // 位置
          x: "left",
          // 配置json数据
          data: null
        },
        // 设置图表的数据
        series: [
          {
            type: "graph",
            // 力向图
            layout: "force",
            // 节点大小
            symbolSize: 40,
            // 相连关系高亮
            // focusNodeAdjacency: true,
            // 开启鼠标缩放和平移漫游
            roam: true,
            // 力引导布局
            force: {
              repulsion: 400, // 节点之间的斥力因子(默认50)
              edgeLength: 200 // 边的长度, 可以是数组范围
            },
            // 可拖拽
            draggable: true,
            // 边两端形状
            edgeSymbol: ["rect", "arrow"],
            // 边两端的大小
            edgeSymbolSize: [4, 10],
            // 边上面的文字
            edgeLabel: {
              normal: {
                // 显示
                show: true,
                // 文本内容
                formatter: function(params) {
                  return params.data.name;
                },
                textStyle: {
                  fontSize: 12,
									color: '#8d8d8d'
                }
              }
            },
            // 连线样式
            lineStyle: {
              normal: {
								type: 'dotted',
                width: 2,
                color: "#1e88e5",
                // 线的弧度, 取值[0, 1]
                curveness: 0.3
              }
            },
            // 节点上的文本标签
            label: {
              normal: {
                show: true,
                textStyle: {},
              }
            },
            data: this.opinionData,
            links: this.link
          }
        ]
      });
      // 设置图容器的高度
      var picTop = document.querySelector("#main").offsetTop,
        screenY = document.documentElement.clientHeight;
      document.querySelector("#main").style.height = screenY - picTop + "px";
    }
  },
  components: {
    RelationshipHeader,
    ChooseBox
  }
};
</script>

<style type="text/css" scoped>
#analyse_detail {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}
#analyse_detail .menu {
  height: 0.93rem;
  background: #fff;
  margin: 0.16rem 0;
}
#analyse_detail .menu ul {
  display: flex;
  align-items: center;
  height: 0.93rem;
  justify-content: center;
}
#analyse_detail .menu ul li {
  display: flex;
  width: 33.33%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 0.93rem;
}
#analyse_detail .menu ul li .icon {
  font-size: 0.44rem;
}
#analyse_detail .menu ul li .icon1 {
  color: #e76b66;
}
#analyse_detail .menu ul li .icon2 {
  color: #eda150;
}
#analyse_detail .menu ul li .icon3 {
  color: #51aa38;
}
#analyse_detail .menu ul li span {
  font-size: 0.12rem;
  color: #555;
}

/*遮罩*/
#analyse_detail .mask {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
  background: #000;
  opacity: 0.4;
}
/*新增联系弹出框*/
#analyse_detail .type_box {
  position: absolute;
  top: 0;
  left: 5%;
  width: 90%;
  height: 0;
  min-height: 0;
  z-index: 20;
  transition: all 0.4s;
  overflow: hidden;
  background: #fff;
  border-radius: 0.1rem;
}
#analyse_detail .type_box h4 {
  margin: 0.1rem 0;
  padding: 0 0.3rem;
  font-size: 0.12rem;
  color: #444;
  letter-spacing: 1px;
}
#analyse_detail .type_box input {
  display: block;
  width: 82%;
  height: 0.48rem;
  margin: 0 auto;
  margin-bottom: 0.26rem;
  border: 0.01rem solid #e6e6e6;
  text-indent: 1em;
  font-size: 0.16rem;
  color: #222;
  box-sizing: border-box;
}
#analyse_detail .type_box ul {
  margin: 0 auto;
  width: 82%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-bottom: 0.02rem solid #f5f5f5;
}
#analyse_detail .type_box ul li {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.6rem;
  height: 0.24rem;
  font-size: 0.12rem;
  color: #444;
  margin-bottom: 0.26rem;
  border-radius: 0.1rem;
  background: #f1f1f1;
}
.chooseActive {
  background: #1e88e5 !important;
  color: #fff !important;
}
#analyse_detail .type_box .newRelation {
  display: block;
  box-sizing: border-box;
  height: 0.46rem;
  background: #fff;
  color: #1e88e5;
  font-size: 0.16rem;
  margin: 0.1rem auto;
}
#main {
  width: 100%;
  height: 5rem;
  background: #fff;
}
</style>


