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

### 参数类型：params

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

### 参数类型：params

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

### 参数类型：params

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

### 参数类型：params

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

### 参数类型：query

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

### 参数类型：query

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

### 参数类型：query

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

### 参数类型：parmas

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

### 参数类型：parmas

| 参数    | 是否必选 | 类型   | 说明     |
| :------ | :------: | :----- | :------- |
| content |    No    | string | 话题内容 |
