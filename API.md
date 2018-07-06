# API文档

## 目录

### 初始模块

  1. [测试](#测试)

### 静态模块

  1. [获取开始文档](#获取开始文档)
  2. [获取api文档](#获取api文档)
  3. [获取关于文档](#获取关于文档)

### 验证码模块

  1. [获取图形验证码](#获取图形验证码)
  2. [获取短信验证码](#获取短信验证码)

### 用户模块

  1. [注册](#注册)
  2. [登录](#登录)
  3. [登出](#登出)
  4. [忘记密码](#忘记密码)
  5. [获取当前登录用户信息](#获取当前登录用户信息)
  6. [更新个人信息](#更新个人信息)
  7. [修改密码](#修改密码)
  8. [获取星标用户列表](#获取星标用户列表)
  9. [获取积分榜前一百用户](#获取积分榜前一百用户)
  10. [根据ID获取用户信息](#根据ID获取用户信息)
  11. [关注或者取消关注某个用户](#关注或者取消关注某个用户)
  12. [获取用户喜欢列表](#获取用户喜欢列表)
  13. [获取用户收藏列表](#获取用户收藏列表)
  14. [获取用户回复列表](#获取用户回复列表)
  15. [获取用户粉丝列表](#获取用户粉丝列表)
  16. [获取用户关注列表](#获取用户关注列表)

### 话题模块

  1. [创建话题](#创建话题)
  2. [删除话题](#删除话题)
  3. [编辑话题](#编辑话题)
  4. [获取话题列表](#获取话题列表)
  5. [搜索话题列表](#搜索话题列表)
  6. [根据ID获取话题详情](#根据ID获取话题详情)
  7. [喜欢或者取消喜欢话题](#喜欢或者取消喜欢话题)
  8. [收藏或者取消收藏话题](#收藏或者取消收藏话题)

### 回复模块

  1. [创建回复](#创建回复)
  2. [编辑回复](#编辑回复)
  3. [删除回复](#删除回复)
  4. [回复点赞](#回复点赞)

### 消息模块

  1. [获取用户消息](#获取用户消息)
  2. [获取系统消息](#获取系统消息)

## 接口列表

### 测试

#### 请求Url

```bash
/
```

#### 请求方式

```bash
GET
```

#### 参数类型：

无

#### 返回示例

```json
{
  "status": 1,
  "data": "欢迎使用 Mints - 薄荷糖社区 API接口"
}
```

### 获取开始文档

#### 请求Url

```bash
/static/start
```

#### 请求方式

```bash
GET
```

#### 参数类型：

无

#### 返回示例

```json
{
    "status": 1,
    "data": "..."
}
```

### 获取api文档

#### 请求Url

```bash
/static/api
```

#### 请求方式

```bash
GET
```

#### 参数类型：

无

#### 返回示例

```json
{
  "status": 1,
  "data": "..."
}
```

### 获取关于文档

#### 请求Url

```bash
/static/about
```

#### 请求方式

```bash
GET
```

#### 参数类型：

无

#### 返回示例

```json
{
  "status": 1,
  "data": "..."
}
```

### 获取图形验证码

#### 请求Url

```bash
/captcha/pic
```

#### 请求方式

```bash
GET
```

#### 参数类型：

无

#### 返回示例

```json
{
  "status": 1,
  "data": {
    "token": "D4AW1",
    "url": "data:image/bmp;base64...."
  }
}
```

### 获取短信验证码

#### 请求Url

```bash
/msgcaptcha
```

#### 请求方式

```bash
GET
```

#### 参数类型：query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|mobile      |Yes       |string  |标准手机号格式 |

#### 返回示例

```json
{
  "status": 1
}
```

### 注册

#### 请求Url

```bash
/signup
```

#### 请求方式

```bash
POST
```

#### 前置条件

*需要注册的手机号首先要获取短信验证码*

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|mobile      |Yes       |string  |标准手机号格式|
|password    |Yes       |string  |数字、字母和特殊字符其中两种组成并且在6-18位之间|
|nickname    |Yes       |string  |4-8位字符|
|msgcaptcha  |Yes       |string  |6位随机字符|

#### 返回示例

```json
{
  "status": 1
}
```

### 登录

#### 请求Url

```bash
/signin
```

#### 请求方式

```bash
POST
```

#### 前置条件

*登录方式分两种.短信验证码登录方式需要首先获取短信验证码*

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|type        |Yes       |string  |acc 和 mct 两种，账号密码和短信验证码 |
|mobile      |Yes       |number  |标准手机号格式 |
|password    |No or msgcaptcha |number  |数字、字母和特殊字符其中两种组成并且在6-18位之间 |
|msgcaptcha  |No or password   |number  |6位字符 |

#### 返回示例

```json
{
  "status": 1,
  "data": {
    "avatar": "",
    "location": "",
    "signature": "",
    "score": 0,
    "is_star": false,
    "is_admin": false,
    "topic_count": 0,
    "like_count": 0,
    "collect_count": 0,
    "reply_count": 0,
    "follower_count": 0,
    "following_count": 0,
    "role": 0,
    "create_at": "2018-06-29T01:43:14.988Z",
    "update_at": "2018-06-29T01:43:14.991Z",
    "_id": "5b358eb2bd7b051770095853",
    "nickname": "青湛",
    "mobile": "18800000000"
  }
}
```

### 登出

#### 请求Url

```bash
/signout
```

#### 请求方式

```bash
DELETE
```

#### 参数类型

无

#### 返回示例

```json
{
  "status": 1
}
```

### 忘记密码

#### 请求Url

```bash
/forget_pass
```

#### 请求方式

```bash
PATCH
```

#### 前置条件

*需要获取短信验证码*

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|mobile      |Yes       |string  |标准手机号格式 |
|newPassword |Yes       |string  |数字、字母和特殊字符其中两种组成并且在6-18位之间 |
|msgcaptcha  |Yes       |string  |6位字符 |

#### 返回示例

```json
{
  "status": 1
}
```

### 获取当前登录用户信息

#### 请求Url

```bash
/info
```

#### 前置条件

*需要登录状态*

#### 请求方式

```bash
GET
```

#### 参数类型：

无

#### 返回示例

```json
{
  "status": 1,
  "data": {
    "avatar": "",
    "location": "",
    "signature": "",
    "score": 0,
    "is_star": false,
    "is_admin": false,
    "topic_count": 0,
    "like_count": 0,
    "collect_count": 0,
    "reply_count": 0,
    "follower_count": 0,
    "following_count": 0,
    "role": 0,
    "create_at": "2018-06-29T01:43:14.988Z",
    "update_at": "2018-06-29T01:43:14.991Z",
    "_id": "5b358eb2bd7b051770095853",
    "nickname": "青湛",
    "mobile": "18800000000"
  }
}
```

### 更新个人信息

#### 请求Url

```bash
/setting
```

#### 请求方式

```bash
PUT
```

#### 前置条件

*需要登录状态*

#### 参数类型：query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|nickname |No       |string  |用户昵称，昵称唯一性 |
|avatar   |No       |string  |用户头像 |
|location |No       |string  |所在地   |
|signature|No       |string  |签名    |

#### 返回示例

```json
{
  "status": 1
}
```

### 修改密码

#### 请求Url

```bash
/update_pass
```

#### 前置条件

*需要登录状态*

#### 请求方式

```bash
PATCH
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|oldPassword |Yes       |string  |数字、字母和特殊字符其中两种组成并且在6-18位之间 |
|newPassword |Yes       |string  |数字、字母和特殊字符其中两种组成并且在6-18位之间 |

#### 返回示例

```json
{
  "status": 1
}
```

### 获取星标用户列表

#### 请求Url

```bash
/users/star
```

#### 请求方式

```bash
GET
```

#### 参数类型：无

#### 返回示例

```json
{
  "status": 1,
  "data": []
}
```

### 获取积分榜前一百用户

#### 请求Url

```bash
/users/top100
```

#### 请求方式

```bash
GET
```

#### 参数类型：无

#### 返回示例

```json
{
  "status": 1,
  "data": []
}
```

### 根据ID获取用户信息

#### 请求Url

```bash
/user/:uid
```

#### 请求方式

```bash
GET
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|uid   |Yes      |string  |用户ID |

#### 返回示例

```json
{
  "status": 1,
  "data": {
    "avatar": "",
    "location": "",
    "signature": "",
    "score": 0,
    "topic_count": 0,
    "like_count": 0,
    "collect_count": 0,
    "reply_count": 0,
    "follower_count": 0,
    "following_count": 0,
    "_id": "5b358eb2bd7b051770095853",
    "nickname": "青湛"
  }
}
```

### 关注或者取消关注某个用户

#### 请求Url

```bash
/user/:uid/follow_or_un
```

#### 请求方式

```bash
PATCH
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|uid   |Yes      |string  |用户ID |

#### 返回示例

```json
{
  "status": 1,
  "action": "follow || un_follow"
}
```

### 获取用户喜欢列表

#### 请求Url

```bash
/user/:uid/likes
```

#### 请求方式

```bash
GET
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|uid   |Yes      |string  |用户ID |

#### 返回示例

```json
{
  "status": 1,
  "data": []
}
```

### 获取用户收藏列表

#### 请求Url

```bash
/user/:uid/collections
```

#### 请求方式

```bash
GET
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|uid   |Yes      |string  |用户ID |

#### 返回示例

```json
{
  "status": 1,
  "data": []
}
```

### 获取用户回复列表

#### 请求Url

```bash
/user/:uid/replies
```

#### 请求方式

```bash
GET
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|uid   |Yes      |string  |用户ID |

#### 返回示例

```json
{
  "status": 1,
  "data": []
}
```

### 获取用户粉丝列表

#### 请求Url

```bash
/user/:uid/follower
```

#### 请求方式

```bash
GET
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|uid   |Yes      |string  |用户ID |

#### 返回示例

```json
{
  "status": 1,
  "data": []
}
```

### 获取用户关注列表

#### 请求Url

```bash
/user/:uid/following
```

#### 请求方式

```bash
GET
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|uid   |Yes      |string  |用户ID |

#### 返回示例

```json
{
  "status": 1,
  "data": []
}
```

### 创建话题

#### 请求Url

```bash
/topic/create
```

#### 请求方式

```bash
POST
```

#### 前置条件

*需要登录状态*

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|tab     |Yes       |string  |所属标签 |
|title   |Yes       |string  |话题标题 |
|content |Yes       |string  |话题内容 |

#### 返回示例

```json
{
  "status": 1
}
```

### 删除话题

#### 请求Url

```bash
/topic/:tid/delete
```

#### 请求方式

```bash
DELETE
```

#### 前置条件

*需要登录状态*

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|tid   |Yes      |string  |话题ID |

#### 返回示例

```json
{
  "status": 1
}
```

### 编辑话题

#### 请求Url

```bash
/topic/:tid/edit
```

#### 请求方式

```bash
PUT
```

#### 前置条件

*需要登录状态*

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|tab     |NO      |string  |所属标签 |
|title   |NO      |string  |话题标题 |
|content |NO      |string  |话题内容 |

#### 返回示例

```json
{
  "status": 1
}
``` 

### 获取话题列表

#### 请求Url

```bash
/topic/list
```

#### 请求方式

```bash
GET
```

#### 参数类型：query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|tab   |No       |string  |所属标签 |
|page  |No       |string  |当前页数 |
|size  |No       |string  |每页个数 |

#### 返回示例

```json
{
  "status": 1,
  "data": []
}
```

### 搜索话题列表

#### 请求Url

```bash
/topic/search
```

#### 请求方式

```bash
GET
```

#### 参数类型：query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|title |Yes       |string  |话题标题模糊查询 |

#### 返回示例

```json
{
  "status": 1,
  "data": []
}
``` 

### 根据ID获取话题详情

#### 请求Url

```bash
/topics/:tid
```

#### 请求方式

```bash
GET
```

#### 参数类型：parmas

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|:-----|
|tid   |Yes      |string    |话题ID  |

#### 返回示例

```json
{
  "status": 1,
  "data": {}
}
``` 

### 喜欢或者取消喜欢话题

#### 请求Url

```bash
/topics/:tid/like_or_un
```

#### 请求方式

```bash
PATCHA
```

#### 前置条件

*需要登录状态*

#### 参数类型：parmas

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|:-----|
|tid   |Yes      |string    |话题ID  |

#### 返回示例

```json
{
  "status": 1,
  "action": "like || un_like"
}
``` 

### 收藏或者取消收藏话题

#### 请求Url

```bash
/topics/:tid/collect_or_un
```

#### 请求方式

```bash
PATCH
```

#### 前置条件

*需要登录状态*

#### 参数类型：parmas

|参数|是否必选|类型|说明|
|:-----|:----:|:-----|:-----|
|tid   |Yes   |string    |话题ID  |

#### 返回示例

```json
{
  "status": 1,
  "action": "collect || un_collcet"
}
```

### 创建回复

#### 请求Url

```bash
/topics/:tid/reply
```

#### 请求方式

```bash
POST
```

#### 前置条件

*需要登录状态*

#### 参数类型：parmas

|参数|是否必选|类型|说明|
|:--------|:----:|:-----|:-----|
|content  |Yes   |string    |回复内容   |
|reply_id |No    |string    |多重回复ID |

#### 返回示例

```json
{
  "status": 1
}
```

### 删除回复

#### 请求Url

```bash
/reply/:rid/delete
```

#### 请求方式

```bash
DELETE
```

#### 前置条件

*需要登录状态*

#### 参数类型：parmas

|参数|是否必选|类型|说明|
|:-----|:----:|:-----|:-----|
|rid   |Yes   |string    |话题ID |

#### 返回示例

```json
{
  "status": 1
}
```

### 编辑回复

#### 请求Url

```bash
/reply/:rid/edit
```

#### 请求方式

```bash
PUT
```

#### 前置条件

*需要登录状态*

#### 参数类型：parmas

|参数|是否必选|类型|说明|
|:--------|:----:|:-----|:-----|
|content  |No   |string    |话题内容 |

#### 返回示例

```json
{
  "status": 1
}
```

### 回复点赞

#### 请求Url

```bash
/reply/:rid/up
```

#### 请求方式

```bash
PATCH
```

#### 前置条件

*需要登录状态*

#### 参数类型：

无

#### 返回示例

```json
{
  "status": 1,
  "action": "down || up"
}
```

### 获取用户消息

#### 请求Url

```bash
/notice/user
```

#### 请求方式

```bash
GET
```

#### 前置条件

*需要登录状态*

#### 参数类型：

无

#### 返回示例

```json
{
  "status": 1,
  "data": []
}
```

### 获取系统消息

#### 请求Url

```bash
/notice/system
```

#### 请求方式

```bash
GET
```

#### 前置条件

*需要登录状态*

#### 参数类型：

无

#### 返回示例

```json
{
  "status": 1,
  "data": []
}
```