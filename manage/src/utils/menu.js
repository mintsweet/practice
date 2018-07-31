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

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

function formatter(data, parentPath = '/') {
  return data.map(item => {
    let { path } = item;

    if (!reg.test(path)) {
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