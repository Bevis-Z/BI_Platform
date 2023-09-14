export default [
  { name: 'Login', path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  { name: 'Register', path: '/user', layout: false, routes: [{ path: '/user/register', component: './User/Register' }] },
  { name: 'Landing Page', path: '/welcome', icon: 'smile', component: './Welcome' },
  { name: 'Analyst History', path: '/history', icon: 'pieChart', component: './History' },
  { name: 'Intelligent Analyst', path: '/add_chart', icon: 'barChart', component: './AddChart' },
  { path: '/add_chart_async', name: 'Intelligent Analysis (Asynchronous)）', icon: 'barChart', component: './AddChartAsync' },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    name: 'Admin Page',
    routes: [
      { path: '/admin', name: 'Test Page', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
