<template> 
  <div id="uploadImg">
    <div id="contact_header">
      <div class="return" @click="goLast">
        <i class="iconfont icon-fanhui icon"></i><span>返回</span>
      </div>
      <div class="title">上传头像</div>
      <div class="opt" @click="handleOpt">完成</div>
    </div>
    <div class="picture" :style="'backgroundImage:url('+headerImage+')'"></div> 
    <div class="container"> 
      <input type="file" id="upload" accept="image" @change="upload"> 
      <label for="upload" class="uploadTip">上传头像</label> 
    </div> 
  </div>  
</template> 
<script> 
  import Exif from 'exif-js'
  import { mapState } from 'vuex'
  export default { 
    mounted() {
      // 回显头像
      this.headerImage = this.headerImg;
    },
    data () { 
      return { 
        headerImage:'', 
        token: sessionStorage.getItem('token'),
        user_id: Number(sessionStorage.getItem('userId')),
        user_data_id: Number(sessionStorage.getItem('user_data_id')),
      } 
    }, 
    computed: {
      ...mapState({
        headerImg: state => state.contact.headImg
      })
    },
    methods: { 
      // 返回创建页面
      goLast() {
        this.$router.push({ name: 'Edit' });
      },
      // 处理完成
      handleOpt() {
        // 上传头像至后台
        if (this.headerImage) {
          this.postImg();
        }
      },
      upload (e) { 
        let files = e.target.files || e.dataTransfer.files; 
        if (!files.length) 
          return; 
        this.picValue = files[0]; 
        this.imgPreview(this.picValue); 
      }, 
      imgPreview (file) { 
        let self = this; 
        let Orientation; 
        //去获取拍照时的信息，解决拍出来的照片旋转问题 
        Exif.getData(file, function(){ 
          Orientation = Exif.getTag(this, 'Orientation'); 
        }); 
        // 看支持不支持FileReader 
        if (!file || !window.FileReader) 
          return; 
        if (/^image/.test(file.type)) { 
          // 创建一个reader 
          let reader = new FileReader(); 
          // 将图片将转成 base64 格式 
          reader.readAsDataURL(file); 
          // 读取成功后的回调 
          reader.onloadend = async function () { 
            let result = this.result; 
            let img = new Image(); 
            img.src = result; 
            // 图片赋值
            self.headerImage = this.result;
            //判断图片是否小于100K,是就直接上传，反之压缩图片 
            /*if (this.result.length <= (100 * 1024)) { 
              self.headerImage = this.result; 
              // self.postImg(); 
            } else { 
              img.onload = function () { 
                let data = self.compress(img, Orientation); 
                self.headerImage = data; 
                // self.postImg(); 
              } 
            }*/ 
          } 
        } 
      }, 
      postImg () { 
        //这里写接口 
        this.$store.dispatch('saveHeadImg', {
          token: this.token,
          user_id: this.user_id,
          user_data_id: this.user_data_id,
          head_pic: this.headerImage,
        }).then(res => {
           this.$router.push({ name: 'Edit' });
        }, err => {

        });
      }, 
      rotateImg (img, direction, canvas) { 
        //最小与最大旋转方向，图片旋转4次后回到原方向 
        const min_step = 0; 
        const max_step = 3; 
        if (img == null)
          return; 
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错 
        let height = img.height; 
        let width = img.width; 
        let step = 2; 
        if (step == null) { 
          step = min_step; 
        } 
        if (direction == 'right') { 
          step++; 
          //旋转到原位置，即超过最大值 
          step > max_step && (step = min_step); 
        } else { 
          step--; 
          step < min_step && (step = max_step); 
        } 
        //旋转角度以弧度值为参数 
        let degree = step * 90 * Math.PI / 180; 
        let ctx = canvas.getContext('2d'); 
        switch (step) { 
          case 0: 
            canvas.width = width; 
            canvas.height = height; 
            ctx.drawImage(img, 0, 0); 
            break; 
          case 1: 
            canvas.width = height; 
            canvas.height = width; 
            ctx.rotate(degree); 
            ctx.drawImage(img, 0, -height); 
            break; 
          case 2: 
            canvas.width = width; 
            canvas.height = height; 
            ctx.rotate(degree); 
            ctx.drawImage(img, -width, -height); 
            break; 
          case 3: 
            canvas.width = height; 
            canvas.height = width; 
            ctx.rotate(degree); 
            ctx.drawImage(img, -width, 0); 
            break; 
        } 
      }, 
      /*compress(img, Orientation) { 
        let canvas = document.createElement("canvas"); 
        let ctx = canvas.getContext('2d'); 
        //瓦片canvas 
        let tCanvas = document.createElement("canvas"); 
        let tctx = tCanvas.getContext("2d"); 
        let initSize = img.src.length; 
        let width = img.width; 
        let height = img.height; 
        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下 
        let ratio; 
        if ((ratio = width * height / 4000000) > 1) { 
          console.log("大于400万像素") 
          ratio = Math.sqrt(ratio); 
          width /= ratio; 
          height /= ratio; 
        } else { 
          ratio = 1; 
        } 
        canvas.width = width; 
        canvas.height = height; 
        // 铺底色 
        ctx.fillStyle = "#fff"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
        //如果图片像素大于100万则使用瓦片绘制 
        let count; 
        if ((count = width * height / 1000000) > 1) { 
          console.log("超过100W像素"); 
          count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片 
          //  计算每块瓦片的宽和高 
          let nw = ~~(width / count); 
          let nh = ~~(height / count); 
          tCanvas.width = nw; 
          tCanvas.height = nh; 
          for (let i = 0; i < count; i++) { 
            for (let j = 0; j < count; j++) { 
              tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh); 
              ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh); 
            } 
          } 
        } else { 
          ctx.drawImage(img, 0, 0, width, height); 
        } 
        //修复ios上传图片的时候 被旋转的问题 
        if (Orientation != "" && Orientation != 1) { 
          switch (Orientation) { 
            case 6://需要顺时针（向左）90度旋转 
              this.rotateImg(img,'left',canvas); 
              break; 
            case 8://需要逆时针（向右）90度旋转 
              this.rotateImg(img,'right',canvas); 
              break; 
            case 3://需要180度旋转 
              this.rotateImg(img,'right',canvas);//转两次 
              this.rotateImg(img,'right',canvas); 
              break; 
          } 
        } 
        //进行最小压缩 
        let ndata = canvas.toDataURL('image/jpeg', 0.1); 
        console.log('压缩前：' + initSize); 
        console.log('压缩后：' + ndata.length); 
        console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%"); 
        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0; 
        return ndata; 
      },*/ 
    } 
  } 
</script> 
<style> 
#uploadImg .picture { 
  margin: 0 auto;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  border-radius: 50%; 
  width: 1rem; 
  height: 1rem; 
  overflow: hidden; 
  background-position: center center; 
  background-repeat: no-repeat; 
  background-size: cover; 
  border: 1px solid #d5d5d5;
} 
#uploadImg .container {
  display: flex;
  align-items: center;
  justify-content: center;
}
#uploadImg .container input {
  margin-left: 0.9rem;
  /* color: #fff;
  background-color: #409eff;
  border-color: #409eff;  */
}
#upload {
  width: 0.1px; 
  height: 0.1px; 
  opacity: 0; 
  overflow: hidden; 
  position: absolute; 
  z-index: -1;
}
.uploadTip {
  display: flex;
  background: #ea6f5a;
  align-items: center;
  justify-content: center;
  width: 1.4rem;
  height: 0.4rem;
  border-radius: 0.06rem;
  font-size: 0.16rem;
  color: white;
}
</style>