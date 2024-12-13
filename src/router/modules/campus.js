{
  path: '/campus/it/settings',
  component: Layout,
  redirect: '/campus/it/settings/event-type',
  name: 'ITSettings',
  meta: { title: '基础设置', icon: 'setting' },
  children: [
    {
      path: 'event-type',
      component: () => import('@/views/campus/it/settings/event-type'),
      name: 'EventType',
      meta: { title: '事件类型' }
    },
    {
      path: 'priority',
      component: () => import('@/views/campus/it/settings/priority'),
      name: 'Priority', 
      meta: { title: '优先级定义' }
    },
    {
      path: 'status',
      component: () => import('@/views/campus/it/settings/status'),
      name: 'Status',
      meta: { title: '状态定义' }
    }
  ]
} 