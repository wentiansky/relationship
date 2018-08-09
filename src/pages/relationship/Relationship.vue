<template>
	<div id="relationship">
		<RelationshipHeader :header="header"></RelationshipHeader>
		<!-- 筛选层 -->
		<ChooseBox></ChooseBox>
		<!-- 菜单栏 -->
		<div class="menu">
			<ul>
				<li>
					<i class="iconfont icon-dianhua icon icon1"></i>
					<a :href="href" class="text tel">{{ phone }}</a>
				</li>
				<li @click="setCenter">
					<i class="iconfont icon-Union icon icon2"></i>
					<span class="text">设为中心</span>
				</li>
				<li>
					<i class="iconfont icon-Id icon icon3"></i>
					<span class="text position" v-if="positions" @click="alertPosBox">{{ positions[0].position_name }}</span>
					<img src="../../assets/img/sanjiao.png" alt="">
					<div class="job_box">
						<ul>
							<li v-for="(pos, index) in positions" @click="handlePosition(pos.position_name)" :key="index">{{ pos.position_name }}</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
		<!-- 关系图 -->
		<div id="main">
			
		</div>
		<Tabar></Tabar>
	</div>
</template>

<script type="text/javascript">
import RelationshipHeader from "@/components/relationship/RelationshipHeader";
import ChooseBox from "@/components/common/ChooseBox";
import Tabar from "@/components/common/Tabar";
import echarts from "echarts";

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
    // 显示关系图
    this.showRelation();
    // 请求用户信息
    this.$store
      .dispatch("getUserInfo", {
        token: this.token,
        user_id: this.user_id
      })
      .then(
        res => {
          // 设置数据
          this.header.person = res.name;
          this.phone = res.phone;
          this.href = "tel:" + res.phone;
          this.positions = res.position;
        },
        err => {
          if (err.response.status == 401) {
            // token过期
            this.overtime();
          }
        }
      );
  },
  mounted() {
    // 设置显示容器高度
    var mainTop = document.getElementById("main").offsetTop,
      screenY = document.documentElement.clientHeight;
    document.getElementById("main").style.height = screenY - mainTop + "px";
    // 隐藏返回按钮
    document.getElementsByClassName("return")[0].style.visibility = "hidden";
    // 开始绘图
    this.$nextTick(function() {
      this.drawPie("main");
      // 绑定点击事件
      var Vue = this;
      this.charts.on("click", function(params) {
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
          // 选中, 只能选择1个人
          if (Vue.addRelation.length < 1) {
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
        title: "关系链"
      },
      phone: "",
      href: "",
      positions: "",
      charts: "",
      opinionData: [],
      link: [],
      // 新增关系数组
      addRelation: [],
      // 相关参数
      token: sessionStorage.getItem("token"),
      user_id: Number(sessionStorage.getItem("userId")),
      user_data_id: ""
    };
  },
  methods: {
    // 定义回显关系图函数
    showRelation() {
      // 发送分析人id到后台
      this.$store
        .dispatch("relationMap", {
          token: this.token,
          user_id: this.user_id
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
              if (item.source_id == this.addRelation[0]) {
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
                  // label的值替换掉name的值
                  formatter: function(params) {
                    return item.source.slice(0, 3);
                  },
                  /*formatter: function (params) {
										return '{pic|' + item.source.slice(0, 3) + '}';
									},
                  rich: {
                    pic: {
                      backgroundColor: {
                        image: item.head_pic
                      },
                      height: 40
                    }
                  }*/
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

    // 弹出职位框
    alertPosBox() {
      document.getElementsByClassName("job_box")[0].style.display = "block";
    },
    handlePosition(pos) {
      var text = (document.getElementsByClassName("text")[2].innerText = pos);
      // 隐藏职位弹框
      document.getElementsByClassName("job_box")[0].style.display = "none";
    },

    // 设置中心
    setCenter() {
      this.$store
        .dispatch("setCenter", {
          token: this.token,
          user_id: this.user_id,
          user_data_id: this.addRelation[0]
        })
        .then(
          res => {
            // 回显关系
            // this.showRelation();
            // 设置数据
            this.header.person = res.name;
            this.phone = res.phone;
            this.href = "tel:" + res.phone;
            this.positions = res.position;
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
                textStyle: {}
              }
            },
            data: this.opinionData,
            links: this.link
          }
        ]
      });
    }
  },
  components: {
    RelationshipHeader,
    ChooseBox,
    Tabar
  }
};
</script>

<style type="text/css" scoped>
#relationship {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}
#relationship .menu {
  height: 0.89rem;
  background: #fff;
  margin: 0.16rem 0;
}
#relationship .menu > ul {
  display: flex;
  align-items: center;
  height: 0.89rem;
  justify-content: center;
}
#relationship .menu > ul > li {
  position: relative;
  display: flex;
  width: 33.33%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 0.58rem;
  border-right: 0.01rem solid #f1f1f1;
}
#relationship .menu > ul > li .icon {
  font-size: 0.26rem;
}
#relationship .menu > ul > li .icon1 {
  color: #e76b66;
}
#relationship .menu > ul > li .icon2 {
  color: #eda150;
}
#relationship .menu > ul > li .icon3 {
  color: #51aa38;
}
#relationship .menu > ul > li .text {
  font-size: 0.12rem;
  color: #333;
}
#relationship .menu > ul > li .position {
  width: 0.6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#relationship .menu > ul > li img {
  position: absolute;
  width: 0.12rem;
  height: 0.08rem;
  left: 0.86rem;
  top: 0.4rem;
}
#relationship .menu > ul > li .job_box {
  display: none;
  position: absolute;
  width: 98%;
  height: 1.22rem;
  top: 0.4rem;
  left: 0rem;
  background: #fff;
  z-index: 20;
}
#relationship .menu > ul > li .job_box ul {
  height: 1.22rem;
  padding: 0 0.1rem;
  display: flex;
  flex-direction: column;
  /*四周都有阴影*/
  box-shadow: 0 2px 16px #eee, 0 0 1px #eee, 0 0 1px #eee;
}
#relationship .menu > ul > li .job_box ul li {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0.4rem;
  border-bottom: 0.02rem solid #f8f8f8;
  font-size: 0.12rem;
  color: #333;
}
#relationship .menu > ul > li .job_box ul li:last-child {
  border: none;
}
#main {
  width: 100%;
  background: #fff;
}
</style>