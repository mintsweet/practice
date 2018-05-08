# API详细说明

基础路径`http://localhost:3000/api`。

## 目录

[公共模块](#公共模块)<br/>
[用户模块](#用户模块)<br />

## 公共模块

### 获取手机验证码

#### 请求Url

```bash
/common/msgcaptcha
```

#### 请求方式

```bash
GET
```

#### 参数类型：query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|mobile      |Yes       |number  |标准手机号格式 |

#### 返回示例

```json
{
    "status": 1
}
```

## 用户模块

### 获取当前用户信息

#### 请求Url

```bash
/user/info
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
    "type": "ERROR_GET_ADMIN_INFO",
    "message": "尚未登录"
}
```

### 用户注册

#### 请求Url

```bash
/user/signup
```

#### 请求方式

```bash
POST
```

#### 参数类型：param

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|nickname    |Yes       |string  |4-8位|
|mobile      |Yes       |number  |标准手机号格式 |
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

### 用户登录

#### 请求Url

```bash
/user/signin
```

#### 请求方式

```bash
POST
```

#### 参数类型：param

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|mobile      |Yes       |number  |标准手机号格式 |
|password    |Yes       |string  |6-18位数字字母特殊字符至少其中两种组合|

#### 返回示例

```json
{
    "status": 1,
    "data": {
        "post_list": [],
        "mood_list": [],
        "collect_list": [],
        "praise_list": [],
        "dynamic": [],
        "follow": [],
        "fans": [],
        "create_at": "2018-05-08 10:07",
        "id": 3,
        "nickname": "青湛啦啦啦",
        "password": "$2a$10$LwQYlJs99U85SKVLJP.gg.nrDa8apWwkrn7yioxa.roWuMrAJ8KXK",
        "mobile": "18711111111"
    }
}
```

### 用户忘记密码

#### 请求Url

```bash
/user/forget
```

#### 请求方式

```bash
POST
```

#### 参数类型：param

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|mobile      |Yes       |number  |标准手机号格式 |
|password    |Yes       |string  |新密码 6-18位数字字母特殊字符至少其中两种组合|
|msgcaptcha  |Yes       |number  |由获取手机短信验证码获得而来 |

#### 返回示例

```json
{
    "status": 1
}
```
