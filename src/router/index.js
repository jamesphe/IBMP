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
        meta: {
          title: '智慧校园总览',
          icon: 'dashboard',
          affix: true,
          roles: ['admin']
        }
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
        redirect: '/campus/it/index',
        meta: {
          title: 'IT运维管理系统',
          icon: 'el-icon-monitor'
        },
        children: [
          {
            path: 'index',
            component: () => import('@/views/campus/it/index'),
            name: 'ITDashboard',
            meta: {
              title: '系统概览',
              noCache: true,
              hidden: true
            }
          },
          {
            path: 'event',
            component: () => import('@/views/campus/it/event/index'),
            name: 'EventManagement',
            meta: {
              title: '事件管理',
              icon: 'el-icon-warning'
            },
            children: [
              {
                path: 'register',
                component: () => import('@/views/campus/it/event/register'),
                name: 'EventRegister',
                meta: {
                  title: '事件登记',
                  icon: 'el-icon-plus',
                  roles: ['admin', 'registrar']
                }
              },
              {
                path: 'process',
                component: () => import('@/views/campus/it/event/process'),
                name: 'EventProcess',
                meta: {
                  title: '事件处理',
                  icon: 'el-icon-s-operation',
                  roles: ['admin', 'handler']
                }
              },
              {
                path: 'history',
                component: () => import('@/views/campus/it/event/history'),
                name: 'EventHistory',
                meta: {
                  title: '历史查询',
                  icon: 'el-icon-time',
                  roles: ['admin', 'handler', 'registrar']
                }
              },
              {
                path: 'statistics',
                component: () => import('@/views/campus/it/event/statistics'),
                name: 'EventStatistics',
                meta: {
                  title: '事件统计',
                  icon: 'el-icon-data-line',
                  roles: ['admin']
                }
              },
              {
                path: 'category',
                component: () => import('@/views/campus/it/event/category'),
                name: 'EventCategory',
                meta: {
                  title: '分类管理',
                  icon: 'el-icon-collection-tag',
                  roles: ['admin']
                }
              },
              {
                path: 'detail/:id',
                component: () => import('@/views/campus/it/event/detail'),
                name: 'EventDetail',
                meta: {
                  title: '事件详情',
                  noCache: true
                },
                hidden: true
              }
            ]
          },
          {
            path: 'workorder',
            component: () => import('@/views/campus/it/workorder/index'),
            name: 'WorkOrder',
            meta: {
              title: '工单管理',
              icon: 'el-icon-document'
            },
            children: [
              {
                path: 'create',
                component: () => import('@/views/campus/it/workorder/create'),
                name: 'WorkOrderCreate',
                meta: {
                  title: '工单创建',
                  icon: 'el-icon-plus'
                }
              },
              {
                path: 'process',
                component: () => import('@/views/campus/it/workorder/process'),
                name: 'WorkOrderProcess',
                meta: {
                  title: '工单处理',
                  icon: 'el-icon-s-operation'
                }
              }
            ]
          },
          {
            path: 'sla',
            component: () => import('@/views/campus/it/service/sla/index'),
            name: 'SLAManagement',
            meta: {
              title: '服务级别管理',
              icon: 'el-icon-s-data'
            },
            children: [
              {
                path: 'definition',
                component: () => import('@/views/campus/it/service/sla/definition'),
                name: 'SLADefinition',
                meta: {
                  title: 'SLA指标定义',
                  icon: 'el-icon-edit-outline'
                }
              },
              {
                path: 'monitor',
                component: () => import('@/views/campus/it/service/sla/monitor'),
                name: 'SLAMonitor',
                meta: {
                  title: 'SLA实时监控',
                  icon: 'el-icon-monitor'
                }
              },
              {
                path: 'statistics',
                component: () => import('@/views/campus/it/service/sla/statistics'),
                name: 'SLAStatistics',
                meta: {
                  title: 'SLA达成统计',
                  icon: 'el-icon-data-analysis'
                }
              }
            ]
          },
          {
            path: 'catalog',
            component: () => import('@/views/campus/it/service/catalog/index'),
            name: 'ServiceCatalog',
            meta: {
              title: '服务目录管理',
              icon: 'el-icon-notebook-2'
            },
            children: [
              {
                path: 'maintenance',
                component: () => import('@/views/campus/it/service/catalog/maintenance'),
                name: 'CatalogMaintenance',
                meta: {
                  title: '目录维护',
                  icon: 'el-icon-edit-outline'
                }
              },
              {
                path: 'approval',
                component: () => import('@/views/campus/it/service/catalog/approval'),
                name: 'CatalogApproval',
                meta: {
                  title: '条目审批',
                  icon: 'el-icon-s-check'
                }
              },
              {
                path: 'statistics',
                component: () => import('@/views/campus/it/service/catalog/statistics'),
                name: 'CatalogStatistics',
                meta: {
                  title: '使用统计',
                  icon: 'el-icon-data-analysis'
                }
              }
            ]
          },
          {
            path: 'device',
            component: () => import('@/views/campus/it/device/index'),
            name: 'Device',
            meta: {
              title: '资产与设备',
              icon: 'el-icon-monitor'
            },
            children: [
              {
                path: 'loan',
                component: () => import('@/views/campus/it/device/loan'),
                name: 'DeviceLoan',
                meta: {
                  title: '设备借用管理',
                  icon: 'el-icon-connection'
                }
              },
              {
                path: 'asset',
                component: () => import('@/views/campus/it/device/asset'),
                name: 'AssetManagement',
                meta: {
                  title: '资产专项管理',
                  icon: 'el-icon-box'
                }
              }
            ]
          },
          {
            path: 'config',
            component: () => import('@/views/campus/it/config/index'),
            name: 'Config',
            meta: {
              title: '配置变更管理',
              icon: 'el-icon-setting'
            }
          },
          {
            path: 'backup',
            component: () => import('@/views/campus/it/backup/index'),
            name: 'Backup',
            meta: {
              title: '备份恢复管理',
              icon: 'el-icon-refresh'
            }
          }
        ]
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
