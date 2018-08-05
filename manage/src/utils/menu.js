const menuData = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    path: 'dashboard'
  },
  {
    name: '内容管理',
    icon: 'laptop',
    path: 'content',
    children: [
      {
        name: '用户',
        path: 'user',
        icon: 'user'
      },
      {
        name: '话题',
        path: 'topic',
        icon: 'profile'
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