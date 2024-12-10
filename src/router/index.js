import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/teaching',
    component: Layout,
    redirect: '/teaching/educational',
    name: 'TeachingCloud',
    meta: {
      title: '教学管理云',
      icon: 'el-icon-reading'
    },
    children: [
      {
        path: 'educational',
        component: () => import('@/views/teaching/educational/index'),
        name: 'Educational',
        meta: {
          title: '教务管理系统',
          icon: 'el-icon-notebook-2'
        }
      },
      {
        path: 'student',
        component: () => import('@/views/teaching/student/index'),
        name: 'Student',
        meta: {
          title: '学生管理系统',
          icon: 'el-icon-user'
        }
      },
      {
        path: 'practice',
        component: () => import('@/views/teaching/practice/index'),
        name: 'Practice',
        meta: {
          title: '实习实训系统',
          icon: 'el-icon-office-building'
        }
      },
      {
        path: 'online',
        component: () => import('@/views/teaching/online/index'),
        name: 'Online',
        meta: {
          title: '网络教学平台',
          icon: 'el-icon-monitor'
        }
      },
      {
        path: 'graduation',
        component: () => import('@/views/teaching/graduation/index'),
        name: 'Graduation',
        meta: {
          title: '毕业管理系统',
          icon: 'el-icon-collection'
        }
      }
    ]
  },
  {
    path: '/enrollment',
    component: Layout,
    redirect: '/enrollment/freshman',
    name: 'EnrollmentCloud',
    meta: {
      title: '招生就业云',
      icon: 'el-icon-user-solid'
    },
    children: [
      {
        path: 'freshman',
        component: () => import('@/views/enrollment/freshman/index'),
        name: 'Freshman',
        meta: {
          title: '迎新系统',
          icon: 'el-icon-user-solid'
        }
      },
      {
        path: 'employment',
        component: () => import('@/views/enrollment/employment/index'),
        name: 'Employment',
        meta: {
          title: '就业管理系统',
          icon: 'el-icon-suitcase'
        }
      },
      {
        path: 'cooperation',
        component: () => import('@/views/enrollment/cooperation/index'),
        name: 'Cooperation',
        meta: {
          title: '校企合作系统',
          icon: 'el-icon-connection'
        }
      }
    ]
  },
  {
    path: '/campus',
    component: Layout,
    redirect: '/campus/office',
    name: 'CampusCloud',
    meta: {
      title: '校园服务云',
      icon: 'tree'
    },
    children: [
      {
        path: 'office',
        component: () => import('@/views/campus/office/index'),
        name: 'Office',
        meta: {
          title: '办公管理系统',
          icon: 'el-icon-office-building'
        }
      },
      {
        path: 'personnel',
        component: () => import('@/views/campus/personnel/index'),
        name: 'Personnel',
        meta: {
          title: '人事管理系统',
          icon: 'el-icon-user'
        }
      },
      {
        path: 'logistics',
        component: () => import('@/views/campus/logistics/index'),
        name: 'Logistics',
        meta: {
          title: '后勤管理系统',
          icon: 'el-icon-box'
        }
      },
      {
        path: 'dormitory',
        component: () => import('@/views/campus/dormitory/index'),
        name: 'Dormitory',
        meta: {
          title: '宿舍管理系统',
          icon: 'el-icon-house'
        }
      },
      {
        path: 'it',
        component: () => import('@/views/campus/it/index'),
        name: 'IT',
        meta: {
          title: 'IT运维管理系统',
          icon: 'el-icon-monitor'
        }
      },
      {
        path: 'asset',
        component: () => import('@/views/campus/asset/index'),
        name: 'Asset',
        meta: {
          title: '资产管理系统',
          icon: 'el-icon-money'
        }
      }
    ]
  },
  {
    path: '/research',
    component: Layout,
    redirect: '/research/project',
    name: 'ResearchCloud',
    meta: {
      title: '科研创新云',
      icon: 'skill'
    },
    children: [
      {
        path: 'project',
        component: () => import('@/views/research/project/index'),
        name: 'ResearchProject',
        meta: {
          title: '科研项目管理',
          icon: 'el-icon-s-cooperation'
        }
      },
      {
        path: 'achievement',
        component: () => import('@/views/research/achievement/index'),
        name: 'ResearchAchievement',
        meta: {
          title: '科研成果管理',
          icon: 'el-icon-trophy'
        }
      }
    ]
  },
  {
    path: '/party',
    component: Layout,
    redirect: '/party/organization',
    name: 'PartyCloud',
    meta: {
      title: '党建思政云',
      icon: 'star'
    },
    children: [
      {
        path: 'organization',
        component: () => import('@/views/party/organization/index'),
        name: 'PartyOrganization',
        meta: {
          title: '党组织管理',
          icon: 'el-icon-s-custom'
        }
      },
      {
        path: 'education',
        component: () => import('@/views/party/education/index'),
        name: 'PartyEducation',
        meta: {
          title: '党建教育管理',
          icon: 'el-icon-reading'
        }
      },
      {
        path: 'ideology',
        component: () => import('@/views/party/ideology/index'),
        name: 'PartyIdeology',
        meta: {
          title: '思政教育管理',
          icon: 'el-icon-edit-outline'
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
