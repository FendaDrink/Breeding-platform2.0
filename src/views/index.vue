<template>
  <div class="home_container app-container home">
    <div class="container-fuild">
      <!-- 导航 -->
      <div class="header-nav">
        <!-- 导航logo -->
        <div class="header-nav-logo">
          <img src="@/assets/img/hzauLogo.png" />
        </div>
      </div>
      <!-- banner -->
      <div class="article_banner">
        <img src="@/assets/img/banner/banner1.jpg" alt="banner" />
      </div>
      <!-- 科研项目 -->
      <div class="container-stage" style="margin-top: 30px;">
        <div class="stage-row">
          <div class="stage-col" v-for="(item, index) in typeList" :key="index">
            <div class="col-container">
              <img :src="item.logo" alt=""/>
              <div class="overlay">
                <span>{{ item.title }}</span>
                <h4>
                  <a href="">{{ item.titleDescription }}</a>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="Index">
import useUserStore from "@/store/modules/user";
import type1 from "@/assets/img/1.jpg"
import type2 from "@/assets/img/2.jpg"
import type3 from "@/assets/img/3.jpg"
import type4 from "@/assets/img/4.jpg"
const user = useUserStore();
const version = ref("3.8.2");

function goTarget(url) {
  window.open(url, "__blank");
}

const typeList = reactive([
  {
    logo: type1,
    title: "表型管理",
    description:"这是作物表型管理平台的表型管理部分"
  },
  {
    logo: type2,
    title: "基因型管理",
    description:"这是作物表型管理平台的图片管理部分"
  },
  {
    logo: type3,
    title: "图片管理",
    description:"这是作物表型管理平台的图片自动上传部分"
  },
  {
    logo: type4,
    title: "材料管理",
    description:"这是作物表型管理平台的图片自动上传部分"
  },
])


</script>

<style scoped lang="less">
.home_container {
  width: 100%;
}

.container-fuild {
  position: relative;
}

.header-nav::after {
  position: absolute;
  left: 0;
  bottom: -0.5vw;
  content: "";
  height: 5vw;
  width: 100%;
  background: url(@/assets/img/brush-down.png);
  z-index: 2;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
  box-sizing: border-box;
}


/* 顶部 */
.container-fuild {
  background: #fff;
  transition: all ease 0.6s;
  width: 100%;
  height: 5vw;
  left: 0;
  top: 0;
}

/* 导航栏 */
.container-fuild .header-nav {
  height: 7vw;
  display: flex;
  justify-content: space-between;
  position: relative;
  
}

/* 导航栏logo */
.container-fuild .header-nav .header-nav-logo {
  width: 25vw;
  height: 100%;
  float: left;
  position: relative;
}

/* 导航栏logo图片 */
.container-fuild .header-nav .header-nav-logo img {
  height: 4.5vw;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  
}

.article_banner {
  width: 100%;
  height: 11vw;
  overflow: hidden;
   background-size: cover;
  opacity: 0;  // 默认设置为透明
  animation: fadeIn 2s forwards;  // 2秒渐显效果
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.article_banner img {
  width: 100vw;
  height: 100%;
  object-fit: cover;
  
}


.container {
  width: 100vw;
  margin: auto;
}

.text-center {
  text-align: center;
  margin-top: 2vw;
}

.server-wrapper {
  margin: 1vw;
}

.center-block {
  display: block;
  margin-right: auto;
  margin-left: auto;
}

.row {
  margin-right: -1vw;
  margin-left: -1vw;
  display: flex;
  color: #1f4e3d;
  border-color: #1f4e3d;
}

.col-md-3 {
  width: 25%;
}

/* 科研项目 */
.container-stage {
  width: auto;
  min-width: auto;
  max-width: inherit;
  padding-right: 0;
  .stage-row {
    --bs-gutter-x: 1.8vw;
    --bs-gutter-y: 0;
    display: flex;
    flex-wrap: wrap;
    margin-top: calc(-1 * var(--bs-gutter-y));
    margin-right: calc(-0.5 * var(--bs-gutter-x));
    margin-left: calc(-0.5 * var(--bs-gutter-x));
    justify-content: center !important;

    .stage-col {
      flex: 0 0 auto;
      width: 23%;
      max-width: 90%;
      padding-right: calc(var(--bs-gutter-x) * 0.5);
      padding-left: calc(var(--bs-gutter-x) * 0.5);
      margin-top: var(--bs-gutter-y);

      .col-container {
        position: relative;
        padding-bottom: 2vw;
        overflow: hidden;
        cursor: pointer;
        display: flex;
        align-items: flex-end;

        img {
          border: none;
          outline: none;
          max-width: 100%;
          height: 18vw;
          vertical-align: middle;
        }

        .overlay {
          background: #099a4a;
          display: inline-block;
          position: absolute;
          z-index: 1;
          bottom: -1vw;
          left: 50%;
          transform: translateX(-50%);
          padding: 2vw 5vw;
          min-width: 65%;
          height: 6vw;
          transition: height 0.3s;
          box-sizing: border-box;

          span {
           display: inline-block;
            font-family: "Handlee", cursive;
            font-weight: 800;
            color: #fff;
            opacity: 0.95;
            white-space: nowrap;
            font-size: 1.2vw;
          }

          h4 {
            font-size: 2vw;
            a {
              pointer-events: none;
              white-space: nowrap;
              color: #fff;
            }
          }
        }

        .overlay::after {
          position: absolute;
          right: 0;
          bottom: 0;
          content: "";
          height: 6vw;
          width: 6vw;
          background: url(../assets/img/leaf-2.png);
          background-position-x: 0%;
          background-position-y: 0%;
          background-repeat: repeat;
          background-size: auto;
          background-repeat: no-repeat;
          background-position: right bottom;
          background-size: contain;
          z-index: -1;
          opacity: 0.1;
        }
      }

      .col-container:hover .overlay {
        visibility: visible;
        height: 7vw;
        opacity: 1;
        box-sizing: border-box;
       
      }
    }
  }
}
</style>