# API文档

## 目录

### 辅助模块

  - [入口测试](#入口测试)
  - [错误测试](#错误测试)
  - [图形验证码](#图形验证码)
  - [短信验证码](#短信验证码)

### 静态模块

  - [快速开始文档](#快速开始文档)
  - [api说明文档](#api说明文档)
  - [关于文档](#关于文档)

### 用户模块

  - [注册](#注册)
  - [登录](#登录)
  - [登出](#登出)
  - [忘记密码](#忘记密码)
  - [当前登录用户信息](#当前登录用户信息)
  - [更新个人信息](#更新个人信息)
  - [修改密码](#修改密码)
  - [星标用户列表](#星标用户列表)
  - [积分榜前一百用户列表](#积分榜前一百用户列表)
  - [根据ID获取用户信息](#根据ID获取用户信息)
  - [用户动态](#用户动态)
  - [用户专栏列表](#用户专栏列表)
  - [用户喜欢列表](#用户喜欢列表)
  - [用户收藏列表](#用户收藏列表)
  - [用户粉丝列表](#用户粉丝列表)
  - [用户关注列表](#用户关注列表)
  - [关注或者取消关注某个用户](#关注或者取消关注某个用户)

### 话题模块

  - [创建话题](#创建话题)
  - [删除话题](#删除话题)
  - [编辑话题](#编辑话题)
  - [获取话题列表](#获取话题列表)
  - [搜索话题列表](#搜索话题列表)
  - [获取无人回复的话题](#获取无人回复的话题)
  - [根据ID获取话题详情](#根据ID获取话题详情)
  - [喜欢或者取消喜欢话题](#喜欢或者取消喜欢话题)
  - [收藏或者取消收藏话题](#收藏或者取消收藏话题)

### 回复模块

  - [创建回复](#创建回复)
  - [编辑回复](#编辑回复)
  - [删除回复](#删除回复)
  - [回复点赞](#回复点赞)

### 消息模块

  - [获取用户消息](#获取用户消息)
  - [获取系统消息](#获取系统消息)

## 接口列表

### 入口测试

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
  "data": "欢迎使用 Mints API！"
}
```



### 错误测试

#### 请求Url

```bash
/error_test
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
    "status": 0,
    "message": "随便出了错"
}
```


### 图形验证码

#### 请求Url

```bash
/aider/captcha
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

### 短信验证码

#### 请求Url

```bash
/aider/sms_code
```

#### 请求方式

```bash
GET
```

#### 补充说明

`process.env.NODE_ENV === 'production`时，不返回`code`。

#### 参数类型：query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|mobile      |Yes       |string  |标准手机号格式 |

#### 返回示例

```json
{
  "status": 1,
  "code": "123456"
}
```

### 快速开始文档

#### 请求Url

```bash
/static/quick_start
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

### api说明文档

#### 请求Url

```bash
/static/api_doc
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

### 关于文档

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
|mobile      |Yes  |string  |标准手机号格式 |
|password    |No   |string  |数字、字母和特殊字符其中两种组成并且在6-18位之间 |
|msgcaptcha  |No   |string  |6位字符 |
|issms       |No   |boolean |是否是短信方式登录 |

#### 返回示例

```json
{
  "status": 1,
  "data": { ... }
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

### 当前登录用户信息

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
  "data": {...}
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
|oldPass |Yes       |string  |不为空 |
|newPass |Yes       |string  |新数字、字母和特殊字符其中两种组成并且在6-18位之间 |

#### 返回示例

```json
{
  "status": 1
}
```

### 星标用户列表

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

### 积分榜前一百用户列表

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
  "data": {...}
}
```

### 用户动态

#### 请求Url

```bash
/user/:uid/action
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

### 用户专栏列表

#### 请求Url

```bash
/user/:uid/create
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

### 用户喜欢列表

#### 请求Url

```bash
/user/:uid/like
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

### 用户收藏列表

#### 请求Url

```bash
/user/:uid/collect
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

### 用户粉丝列表

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

### 用户关注列表

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


### 创建话题

#### 请求Url

```bash
/create
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

*需要登录状态，并且为当前用户所创建话题*

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

*需要登录状态，并且为当前用户所创建话题*

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
/topics/list
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
/topics/search
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

### 获取无人回复的话题

#### 请求Url

```bash
/topics/no_reply
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
 
### 根据ID获取话题详情

#### 请求Url

```bash
/topic/:tid
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
/topic/:tid/like_or_un
```

#### 请求方式

```bash
PATCHA
```

#### 前置条件

*需要登录状态，并且不能为自己创建的话题*

#### 参数类型：parmas

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|:-----|
|tid   |Yes      |string    |话题ID  |

#### 返回示例

```json
{
  "status": 1,
  "action": "like or un_like"
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

*需要登录状态，并且不能为自己创建的话题*

#### 参数类型：parmas

|参数|是否必选|类型|说明|
|:-----|:----:|:-----|:-----|
|tid   |Yes   |string    |话题ID  |

#### 返回示例

```json
{
  "status": 1,
  "action": "collect or un_collcet"
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

*需要登录状态，并且为自己创建的回复*

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

*需要登录状态，并且为自己创建的回复*

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

*需要登录状态，并且不能为自己创建的回复*

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