# API说明

## 目录

[获取图形验证码](#获取图形验证码)<br>
[获取手机验证码](#获取手机验证码)<br>
[注册](#注册)<br>
[登录](#登录)<br>

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

## 注册

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

## 登录

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