import router from './router';
import { ElMessage } from 'element-plus';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken } from '@/utils/auth';
import { isHttp } from '@/utils/validate';
import { isRelogin } from '@/utils/request';
import useUserStore from '@/store/modules/user';
import useSettingsStore from '@/store/modules/settings';
import usePermissionStore from '@/store/modules/permission';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/auth-redirect', '/bind', '/register', '/searching', '/searching/index', '/searching/result', '/searching/highSearch', 'user/bigDataCenter', '/test', '/src'];

router.beforeEach((to, from, next) => {
  // 跳转路由前取消所有上一个页面未发送的请求
  window._axiosPromiseArr.forEach((ele,index) => {
    ele.cancel() // 路由跳转之前，终止上一个页面正在请求的内容
    // 清空请求的参数
    delete window._axiosPromiseArr[index];
  });
  NProgress.start();
  if (getToken()) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title);
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      if (useUserStore().roles.length === 0) {
        isRelogin.show = true;
        // 判断当前用户是否已拉取完user_info信息
        useUserStore().getInfo().then(() => {
          isRelogin.show = false;
          usePermissionStore().generateRoutes().then(accessRoutes => {
            // let fatherPath = accessRoutes[0].path==='/'?'/':accessRoutes[0].path+'/'
            // let firstPath = fatherPath + accessRoutes[0].children[0].path
            // router.addRoute(accessRoutes) // 动态添加可访问路由表
            // if(1||to.path === '/index'){
            //   next({ path: firstPath, replace: true })
            // }else{
            // 根据roles权限生成可访问的路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            // }

            // 根据roles权限生成可访问的路由表
            accessRoutes.forEach(route => {
              if (!isHttp(route.path)) {
                router.addRoute(route); // 动态添加可访问路由表
              }
            });
          });
        }).catch(err => {
          useUserStore().logOut().then(() => {
            ElMessage.error(err);
            next({ path: '/' });
          });
        });
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1 || to.path.substring(0, 5) === '/user') {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
