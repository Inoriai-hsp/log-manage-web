import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  }
]

export const asyncRouterMap = [
  {
    path:'/log',
    component: Layout,
    redirect: '/log/logList',
    name: 'log',
    meta: {title: '日志管理', icon: 'table'},
    children: [
      {
        path: 'logList',
        name: 'logList',
        component: () => import('@/views/log/logList/index'),
        meta: {title: '日志列表', icon: 'product-list'}
      },
      {
        path: 'addLog',
        name: 'addLog',
        component: () => import('@/views/log/addLog/index'),
        meta: {title: '上传日志', icon: 'product-add'}
      },
      {
        path: 'objectConfig',
        name: 'objectConfig',
        component: () => import('@/views/log/objectConfig/index'),
        meta: {title: '数据对象', icon: 'product-add'}
      },
      {
        path: 'addChain',
        name: 'addChain',
        component: () => import('@/views/log/addChain/index'),
        meta: {title: '日志上链', icon: 'product-add'},
        hidden: true
      }
    ]
  },
  {
    path:'/trace',
    component: Layout,
    redirect: '/trace/traceQuery',
    name: 'trace',
    
    // hidden: true,
    children: [
      {
        path: 'traceQuery',
        name: 'traceQuery',
        component: () => import('@/views/trace/traceQuery/index'),
        // meta: {title: '溯源查询', icon: 'eye'}
        meta: {title: '日志溯源', icon: 'tree'},
      },
    ]
  },
  {
    path:'/user',
    component: Layout,
    redirect: '/user',
    name: 'user',
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: {title: '用户管理', icon: 'ums-admin'}
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

