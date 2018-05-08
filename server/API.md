# API详细说明

## 目录

[1、获取手机验证码](#1获取手机验证码)<br/>
[2、用户注册](#2用户注册)<br>

## 接口列表

### 1、获取手机验证码

#### 请求Url

```bash
http://localhost:3000/api/common/msgcaptcha
```

#### 请求方式

```bash
GET
```

#### 参数类型：query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|mobile      |Yes       |string  |标准手机号格式 |

#### 返回示例

```json
{
    "status": 1
}
```

### 2、用户注册

#### 请求Url

```bash
http://localhost:3000/api/user/signup
```

#### 请求方式

```bash
POST
```

#### 参数类型：param

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|nickname    |Yes       |string  |4-8位|
|mobile      |Yes       |string  |标准手机号格式 |
|password    |Yes       |string  |6-18位数字字母特殊字符至少其中两种组合|

#### 返回示例

```json
{
    "status": 1,
    "data": {
        "id": 3,
        "nickname": "青湛啦啦啦",
        "password": "$2a$10$LwQYlJs99U85SKVLJP.gg.nrDa8apWwkrn7yioxa.roWuMrAJ8KXK",
        "mobile": "18711111111"
    }
}
```