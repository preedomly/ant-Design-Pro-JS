
export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user', 'menus'],
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
              },
              {
                path: '/admin',
                name: '测试一级菜单',
                icon: 'crown',
                component: './Admin',
                authority: ['admin'],
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: '测试二级菜单',
                    icon: 'crown',
                    component: './Welcome',
                    authority: ['admin'],
                  },
                ],
              },
              {
                name: 'list.table-list',
                icon: 'table',
                path: '/list',  
                component: './TableList',
              },
              {
                name: '定额管理',
                icon: 'table',
                path: '/quota',
                routes: [
                  {
                    path: '/quota/material',
                    name: '材料定额',
                    icon: 'crown',
                    component: './DemoTable',
                    authority: ['admin'],
                    cfg: 'query_material_admin',
                  },
                  {
                    path: '/quota/rate',
                    name: '费率项目',
                    icon: 'crown',
                    component: './DemoTable',
                    authority: ['admin'],
                    cfg: 'query_rate_admin',
                  }
                ]
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
]