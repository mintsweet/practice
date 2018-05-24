# API说明

## 目录

  1. [获取图形验证码](#获取图形验证码)
  2. [获取手机验证码](#获取手机验证码)
  3. [注册](#注册)<br>
  4. [登录](#登录)<br>
  5. [登出](#登出)<br>
  6. [忘记密码](#忘记密码)<br>
  7. [修改密码](#修改密码)<br>
  8. [通过昵称获取用户信息](#通过昵称获取用户信息)<br>
  9. [更新个人信息](#更新个人信息)<br>
  10. [获取星标用户列表](#获取星标用户列表)<br>
  11. [获取积分榜前一百用户](#获取积分榜前一百用户)<br>
  12. [获取用户收藏列表](#获取用户收藏列表)<br>
  13. [获取用户回复列表](#获取用户回复列表)<br>
  14. [获取用户粉丝列表](#获取用户粉丝列表)<br>
  15. [获取用户关注列表](#获取用户关注列表)<br>

## 接口列表

### 获取图形验证码

#### 请求Url

```bash
/piccaptcha
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

### 获取手机验证码

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
|mobile      |Yes       |number  |标准手机号格式 |

#### 返回示例

```json
{
  "status": 1
}
```

### 注册

#### 请求Url

```bash
/user/signup
```

#### 请求方式

```bash
POST
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|mobile      |Yes       |number  |标准手机号格式 |
|password    |Yes       |string  |数字、字母和特殊字符其中两种组成并且在6-18位之间 |
|nickname    |Yes       |string  |4-8位字符 |

#### 返回示例

```json
{
  "status": 1
}
```

### 登录

#### 请求Url

```bash
/user/signin
```

#### 请求方式

```bash
POST
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|type        |Yes       |string  |acc 和 mct 两种，账号密码和短信验证码 |
|mobile      |Yes       |number  |标准手机号格式 |
|password    |No or msgcaptcha |number  |数字、字母和特殊字符其中两种组成并且在6-18位之间 |
|msgcaptcha  |No or password   |number  |6为标准验证码 |

#### 返回示例

```json
{
  "status": 1,
  "data": {
    "score": 0,
    "topic_count": 0,
    "reply_count": 0,
    "follower_count": 0,
    "following_count": 0,
    "create_at": "2018-05-19T06:04:15.979Z",
    "update_at": "2018-05-19T06:04:15.979Z",
    "id": 1,
    "nickname": "青湛",
    "password": "$2a$10$8SceZZN4feIc8c52FlMTxuhvQtmp795RgA4mXupctfOhSSgHhgEx6",
    "mobile": "18800000000"
  }
}
```

### 登出

#### 请求Url

```bash
/user/signout
```

#### 请求方式

```bash
GET
```

#### 参数类型：无

#### 返回示例

```json
{
  "status": 1
}
```

### 忘记密码

#### 请求Url

```bash
/user/forget_pass
```

#### 请求方式

```bash
POST
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|mobile      |Yes       |number  |标准手机号格式 |
|newPassword |Yes       |number  |数字、字母和特殊字符其中两种组成并且在6-18位之间 |
|msgcaptcha  |Yes       |number  |6为标准验证码 |

#### 返回示例

```json
{
  "status": 1
}
```

### 修改密码

#### 请求Url

```bash
/user/update_pass
```

#### 前置条件

*需要登录状态*

#### 请求方式

```bash
POST
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|oldPassword |Yes       |number  |数字、字母和特殊字符其中两种组成并且在6-18位之间 |
|newPassword |Yes       |number  |数字、字母和特殊字符其中两种组成并且在6-18位之间 |

#### 返回示例

```json
{
  "status": 1
}
```

### 通过昵称获取用户信息

#### 请求Url

```bash
/user/:nickname
```

#### 请求方式

```bash
GET
```

#### 参数类型：query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|nickname |Yes       |string  |用户昵称 |

#### 返回示例

```json
{
  "status": 1,
  "data": {
    "score": 0,
    "topic_count": 0,
    "reply_count": 0,
    "follower_count": 0,
    "following_count": 0,
    "nickname": "笑嘻嘻嘻"
  }
}
```

### 更新个人信息

#### 请求Url

```bash
/user/setting
```

#### 请求方式

```bash
POST
```

#### 参数类型：query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|nickname |No       |string  |用户昵称 |
|avatar   |No       |string  |用户头像 |
|location |No       |string  |所在地   |
|signature|No       |string  |签名    |

#### 返回示例

```json
{
  "status": 1
}
```

### 获取星标用户列表

#### 请求Url

```bash
/user/start
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
/user/top100
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

### 获取用户收藏列表

#### 请求Url

```bash
/user/:nickname/collections
```

#### 请求方式

```bash
GET
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|nickname |Yes       |string  |用户昵称 |

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
/user/:nickname/collections
```

#### 请求方式

```bash
GET
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|nickname |Yes       |string  |用户昵称 |

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
/user/:nickname/replies
```

#### 请求方式

```bash
GET
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|nickname |Yes       |string  |用户昵称 |

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
/user/:nickname/follower
```

#### 请求方式

```bash
GET
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|nickname |Yes       |string  |用户昵称 |

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
/user/:nickname/following
```

#### 请求方式

```bash
GET
```

#### 参数类型：params

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|nickname |Yes       |string  |用户昵称 |

#### 返回示例

```json
{
  "status": 1,
  "data": []
}
```