# API文档

## 获取社区规范文档

### 请求Url

```bash
/v1/static/norms
```

### 请求方式

```bash
GET
```

### 返回示例

```text
# 关于薄荷糖社区...
```

## 获取图形验证码

### 请求Url

```bash
/v1/aider/captcha
```

### 请求方式

```bash
GET
```

### 返回示例

```json
{
  "token": "D4AW1",
  "url": "data:image/bmp;base64...."
}
```

## 头像上传

### 请求Url

```bash
/v1/aider/upload_avatar
```

### 请求方式

```bash
POST
```

### 参数

| 参数   | 是否必选 | 类型 | 说明     |
| :----- | :------: | :--- | :------- |
| avatar |   Yes    | file | 头像文件 |

### 返回示例

```text
http://...
```

## 注册

### 请求Url

```bash
/v1/signup
```

### 请求方式

```bash
POST
```

### 参数类型

| 参数     | 是否必选 | 类型   | 说明                                             |
| :------- | :------: | :----- | :----------------------------------------------- |
| email    |   Yes    | string | 邮箱地址                                         |
| password |   Yes    | string | 数字、字母和特殊字符其中两种组成并且在6-18位之间 |
| nickname |   Yes    | string | 4-8位字符                                        |

### 返回示例

```text
/v1/set_active?token=xxxxxx&email=xxxxx
```

## 账户激活

### 请求Url

```bash
/v1/set_active
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数  | 是否必选 | 类型   | 说明 |
| :---- | :------: | :----- | :--- |
| email |   Yes    | string | 邮箱 |
| token |   Yes    | string | 密钥 |

## 登录

### 请求Url

```bash
/v1/signin
```

### 请求方式

```bash
POST
```

### 参数类型

| 参数     | 是否必选 | 类型   | 说明 |
| :------- | :------: | :----- | :--- |
| email    |   Yes    | string | 邮箱 |
| password |    No    | string | 密码 |

### 返回示例

```text
Bearer <token>
```

## 忘记密码

### 请求Url

```bash
/v1/forget_pass
```

### 请求方式

```bash
POST
```

### 参数类型

| 参数  | 是否必选 | 类型   | 说明 |
| :---- | :------- | :----- | :--- |
| email | Yes      | string | 邮箱 |

### 返回示例

```text
/reset_pass?token=xxxx&email=xxxx
```

## 重置密码

### 请求Url

```bash
/v1/reset_pass
```

### 请求方式

```bash
POST
```

### 参数类型

| 参数    | 是否必选 | 类型          | 说明 |
| :------ | :------- | :------------ | :--- |
| newPass | Yes      | string        | 密码 |
| email   | Yes      | string(query) | 邮箱 |
| token   | Yes      | string(query) | 密钥 |

## 获取当前用户信息

### 请求Url

```bash
/v1/info
```

### 前置条件

*携带jwt*

### 请求方式

```bash
GET
```

### 返回示例

```json
{
  "id": 1,
  "nickname": "青湛"
}
```

## 更新个人信息

### 请求Url

```bash
/v1/setting
```

### 请求方式

```bash
PUT
```

### 前置条件

*携带jwt*

### 参数类型

| 参数      | 是否必选 | 类型   | 说明                 |
| :-------- | :------: | :----- | :------------------- |
| nickname  |    No    | string | 用户昵称，昵称唯一性 |
| avatar    |    No    | string | 用户头像             |
| location  |    No    | string | 所在地               |
| signature |    No    | string | 签名                 |

## 修改密码

### 请求Url

```bash
/v1/update_pass
```

### 前置条件

*携带jwt*

### 请求方式

```bash
PATCH
```

### 参数类型

| 参数    | 是否必选 | 类型   | 说明                                               |
| :------ | :------: | :----- | :------------------------------------------------- |
| oldPass |   Yes    | string | 不为空                                             |
| newPass |   Yes    | string | 新数字、字母和特殊字符其中两种组成并且在6-18位之间 |

## 获取积分榜用户列表

### 请求Url

```bash
/v1/users/top
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数  | 是否必选 | 类型   | 说明 |
| :---- | :------: | :----- | :--- |
| count |    No    | number | 数量 |

### 返回示例

```json
[{
  "id": 1,
  "nickname": "青湛"
}, {
  "id": 2,
  "nickname": "啦啦啦"
}]
```

## 根据ID获取用户信息

### 请求Url

```bash
/v1/user/:uid
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| uid  |   Yes    | string | 用户ID |

### 返回示例

```json
{
  "id": 1,
  "nickname": "青湛"
}
```

## 获取用户动态

### 请求Url

```bash
/v1/user/:uid/action
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| uid  |   Yes    | string | 用户ID |

### 返回示例

```json
[
  {
    "id": 1,
    "type": "create"
  }
]
```

## 获取用户专栏列表

### 请求Url

```bash
/v1/user/:uid/create
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| uid  |   Yes    | string | 用户ID |

### 返回示例

```json
[
  {
    "id": 1
  }
]
```

## 获取用户喜欢列表

### 请求Url

```bash
/v1/user/:uid/like
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| uid  |   Yes    | string | 用户ID |

### 返回示例

```json
[
  {
    "id": 1
  }
]
```

## 获取用户收藏列表

### 请求Url

```bash
/v1/user/:uid/collect
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| uid  |   Yes    | string | 用户ID |

### 返回示例

```json
[
  {
    "id": 1
  }
]
```

## 获取用户粉丝列表

### 请求Url

```bash
/v1/user/:uid/follower
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| uid  |   Yes    | string | 用户ID |

### 返回示例

```json
[
  {
    "id": 1,
    "nickname": "青湛"
  }
]
```

## 获取用户关注列表

### 请求Url

```bash
/v1/user/:uid/following
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| uid  |   Yes    | string | 用户ID |

### 返回示例

```json
[
  {
    "id": 1,
    "nickname": "青湛"
  }
]
```

## 关注或者取消关注用户

### 请求Url

```bash
/v1/user/:uid/follow_or_un
```

### 请求方式

```bash
PATCH
```

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| uid  |   Yes    | string | 用户ID |

### 返回示例

```text
follow or un_follow
```

## 获取本周新增用户数

### 请求Url

```bash
/v2/users/new_this_week
```

### 请求方式

```bash
GET
```

### 前置条件

*携带jwt，且为管理员*

### 返回示例

```text
10
```

## 获取上周新增用户数

### 请求Url

```bash
/v2/users/new_last_week
```

### 请求方式

```bash
GET
```

### 前置条件

*携带jwt，且为管理员*

### 返回示例

```text
10
```

## 获取用户总数

### 请求Url

```bash
/v2/users/total
```

### 请求方式

```bash
GET
```

### 前置条件

*携带jwt，且为管理员*

### 返回示例

```
10
```

## 获取用户列表

### 请求Url

```bash
/v2/users/list
```

### 请求方式

```bash
GET
```

### 前置条件

*携带jwt，且为管理员*

### 返回示例

```json
{
  "users": [
    {
      "id": 1,
      "nickname": "青湛"
    },
    {
      "id": 2,
      "nickname": "管理员"
    }
  ],
  "page": 1,
  "size": 10,
  "total": 30
}
```

## 新增用户

### 请求Url

```bash
/v2/users/create
```

### 请求方式

```bash
POST
```

### 前置条件

*携带jwt，且为管理员*

### 参数类型

| 参数     | 是否必选 | 类型   | 说明                                    |
| :------- | :------: | :----- | :-------------------------------------- |
| email    |   Yes    | string | 标准邮箱                                |
| password |   Yes    | string | 6至18位数字、字母和特殊字符任意两种组合 |
| nickname |   Yes    | string | 2至8位长度昵称                          |
| role     |   Yes    | string | 0至100位的权限值                        |

## 删除用户(物理)

### 请求Url

```bash
/v2/user/:uid/delete
```

### 请求方式

```bash
DELETE
```

### 前置条件

*携带jwt，且为超级管理员*

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| uid  |   Yes    | string | 用户ID |

## 设为星标用户

### 请求Url

```bash
/v2/user/:uid/star
```

### 请求方式

```bash
PATCH
```

### 前置条件

*携带jwt，且为管理员*

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| uid  |   Yes    | string | 用户ID |

### 返回示例

```text
star or un_star
```

## 锁定用户(封号)

### 请求Url

```bash
/v2/user/:uid/lock
```

### 请求方式

```bash
PATCH
```

### 前置条件

*携带jwt，且为管理员*

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| uid  |   Yes    | string | 用户ID |

### 返回示例

```
lock or un_lock
```

## 创建话题

### 请求Url

```bash
/v1/create
```

### 请求方式

```bash
POST
```

### 前置条件

*携带jwt*

### 参数类型

| 参数    | 是否必选 | 类型   | 说明     |
| :------ | :------: | :----- | :------- |
| tab     |   Yes    | string | 所属标签 |
| title   |   Yes    | string | 话题标题 |
| content |   Yes    | string | 话题内容 |

## 删除话题

### 请求Url

```bash
/v1/topic/:tid/delete
```

### 请求方式

```bash
DELETE
```

### 前置条件

*携带jwt，并且为当前用户所创建话题*

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| tid  |   Yes    | string | 话题ID |

## 编辑话题

### 请求Url

```bash
/v1/topic/:tid/update
```

### 请求方式

```bash
PUT
```

### 前置条件

*携带jwt，并且为当前用户所创建话题*

### 参数类型

| 参数    | 是否必选 | 类型   | 说明     |
| :------ | :------: | :----- | :------- |
| tab     |    NO    | string | 所属标签 |
| title   |    NO    | string | 话题标题 |
| content |    NO    | string | 话题内容 |

## 获取话题列表

### 请求Url

```bash
/v1/topics/list
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数 | 是否必选 | 类型   | 说明     |
| :--- | :------: | :----- | :------- |
| tab  |    No    | string | 所属标签 |
| page |    No    | string | 当前页数 |
| size |    No    | string | 每页个数 |

### 返回示例

```json
[
  {
    "id": 1,
    "title": "test title"
  },
  {
    "id": 2,
    "title": "test title 2"
  }
]
```


## 搜索话题列表

### 请求Url

```bash
/v1/topics/search
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数  | 是否必选 | 类型   | 说明             |
| :---- | :------: | :----- | :--------------- |
| title |   Yes    | string | 话题标题模糊查询 |

### 返回示例

```json
[
  {
    "id": 1,
    "title": "test title"
  },
  {
    "id": 2,
    "title": "test title 2"
  }
]
```

## 获取无人回复的话题

### 请求Url

```bash
/v1/topics/no_reply
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数  | 是否必选 | 类型   | 说明                 |
| :---- | :------: | :----- | :------------------- |
| count |    No    | string | 获取数量，默认为为10 |

### 返回示例

```json
[
  {
    "id": 1,
    "title": "test title"
  },
  {
    "id": 2,
    "title": "test title 2"
  }
]
```

## 根据ID获取话题详情

### 请求Url

```bash
/v1/topic/:tid
```

### 请求方式

```bash
GET
```

### 参数类型

| 参数 | 是否必选 | 类型 | 说明 |
| :--- | :------: | :--- | :--- ||
| tid  |   Yes    | string | 话题ID |

### 返回示例

```json
{
  "id": 1,
  "title": "这是一个标题",
  "content": "# 哈哈哈哈内容",
  "author": {
    "id": 2,
    "nickname": "青湛"
  }
}
```

## 喜欢或者取消喜欢话题

### 请求Url

```bash
/v1/topic/:tid/like_or_un
```

### 请求方式

```bash
PATCHA
```

### 前置条件

*携带jwt，并且不能为自己创建的话题*

### 参数类型

| 参数 | 是否必选 | 类型 | 说明 |
| :--- | :------: | :--- | :--- ||
| tid  |   Yes    | string | 话题ID |

### 返回示例

```
like or un_like
```

## 收藏或者取消收藏话题

### 请求Url

```bash
/v1/topics/:tid/collect_or_un
```

### 请求方式

```bash
PATCH
```

### 前置条件

*携带jwt，并且不能为自己创建的话题*

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| tid  |   Yes    | string | 话题ID |

### 返回示例

```
collect or un_collcet
```

## 获取本周新增话题数

### 请求Url

```bash
/v2/topics/new_this_week
```

### 请求方式

```bash
GET
```

### 前置条件

*携带jwt，且为管理员*

### 返回示例

```text
10
```

## 获取上周新增话题数

### 请求Url

```bash
/v2/users/new_last_week
```

### 请求方式

```bash
GET
```

### 前置条件

*携带jwt，且为管理员*

### 返回示例

```text
10
```

## 获取话题总数

### 请求Url

```bash
/v2/topics/total
```

### 请求方式

```bash
GET
```

### 前置条件

*携带jwt，且为管理员*

### 返回示例

```text
10
```

## 删除话题(物理)

### 请求Url

```bash
/v2/topic/:tid/delete
```

### 请求方式

```bash
DELETE
```

### 前置条件

*携带jwt，且为超级管理员*

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| tid  |   Yes    | string | 话题ID |

## 话题置顶

### 请求Url

```bash
/v2/topic/:tid/top
```

### 请求方式

```bash
PATCH
```

### 前置条件

*携带jwt，且为管理员*

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| tid  |   Yes    | string | 话题ID |

### 返回示例

```text
top or un_top
```

## 话题加精

### 请求Url

```bash
/v2/topic/:tid/good
```

### 请求方式

```bash
PATCH
```

### 前置条件

*携带jwt，且为管理员*

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| tid  |   Yes    | string | 话题ID |

### 返回示例

```
good or un_good
```

## 话题锁定(封贴)

### 请求Url

```bash
/v2/topic/:tid/lock
```

### 请求方式

```bash
PATCH
```

### 前置条件

*携带jwt，且为管理员*

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| tid  |   Yes    | string | 话题ID |

### 返回示例

```
lock or un_lock
```

## 创建回复

### 请求Url

```bash
/v1/topics/:tid/reply
```

### 请求方式

```bash
POST
```

### 前置条件

*携带jwt*

### 参数类型

| 参数     | 是否必选 | 类型   | 说明       |
| :------- | :------: | :----- | :--------- |
| content  |   Yes    | string | 回复内容   |
| reply_id |    No    | string | 多重回复ID |

## 删除回复

### 请求Url

```bash
/v1/reply/:rid/delete
```

### 请求方式

```bash
DELETE
```

### 前置条件

*携带jwt，并且为自己创建的回复*

### 参数类型

| 参数 | 是否必选 | 类型   | 说明   |
| :--- | :------: | :----- | :----- |
| rid  |   Yes    | string | 话题ID |

## 编辑回复

### 请求Url

```bash
/v1/reply/:rid/update
```

### 请求方式

```bash
PUT
```

### 前置条件

*携带jwt，并且为自己创建的回复*

### 参数类型

| 参数    | 是否必选 | 类型   | 说明     |
| :------ | :------: | :----- | :------- |
| content |    No    | string | 话题内容 |

## 回复点赞或者取消点赞

### 请求Url

```bash
/v1/reply/:rid/up_or_down
```

### 请求方式

```bash
PATCH
```

### 前置条件

*携带jwt，并且不能为自己创建的回复*

### 返回示例

```
down or up
```

## 获取用户消息

### 请求Url

```bash
/v1/notice/user
```

### 请求方式

```bash
GET
```

### 前置条件

*携带jwt*


### 返回示例

```json
[
  {
    "id": 1,
    "type": "reply",
    "content": "谁谁谁回复了你"
  }
]
```

## 获取系统消息

### 请求Url

```bash
/v1/notice/system
```

### 请求方式

```bash
GET
```

### 前置条件

*携带jwt*

### 返回示例

```json
[
  {
    "id": 1,
    "type": "system",
    "content": "系统通知"
  }
]
```

