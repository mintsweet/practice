const data = [
  {
    name: '数据概览',
    icon: 'dashboard',
    path: 'dashboard',
  },
  {
    name: '内容管理',
    icon: 'laptop',
    path: 'content',
    children: [
      {
        name: '用户',
        icon: 'user',
        path: 'user',
      },
      {
        name: '话题',
        icon: 'profile',
        path: 'topic',
      }
    ],
  },
  {
    name: '系统管理',
    icon: 'setting',
    path: 'system',
    children: [
      {
        name: '设置',
        icon: 'tool',
        path: 'setting',
      },
    ],
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

export default formatter(data);
