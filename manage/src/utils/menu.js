import isUrl from './isUrl';

const menuData = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    path: 'dashboard'
  },
  {
    name: '话题管理',
    icon: 'laptop',
    path: 'topic',
    children: [
      {
        name: '列表',
        path: 'list'
      }
    ]
  },
  {
    name: '系统设置',
    icon: 'setting',
    path: 'system',
    children: [
      {
        name: '基本信息',
        path: 'basic'
      },
      {
        name: '站点管理',
        path: 'site'
      }
    ]
  }
];

function formatter(data, parentPath = '/') {
  return data.map(item => {
    let { path } = item;

    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    
    const result = {
      ...item,
      path
    };

    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`);
    }

    return result;
  });
}

export const getMenuData = () => formatter(menuData);