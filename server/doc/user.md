# 用户模块

模块公共路径为`/user`，以下请求路径省略`http://localhost:3000/api/user`。

## 目录

[获取当前用户信息](#获取当前用户信息)<br>
[用户注册](#用户注册)<br>
[用户登录](#用户登录)<br>
[用户忘记密码](#用户忘记密码)<br>
[获取用户信息](#获取用户信息)<br>

## 接口列表

### 获取当前用户信息

#### 请求Url

```bash
/info
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
        "post_list": [],
        "mood_list": [],
        "collect_list": [],
        "praise_list": [],
        "dynamic": [],
        "follow": [],
        "fans": [],
        "create_at": "2018-05-09 09:44",
        "id": 5,
        "nickname": "笑嘻嘻嘻嘻",
        "password": "$2a$10$MrpfrR9ckS7Kw6jN4sHj/Ox1fK/jsvJcdOEQL7VLxUHp5LDvo6Cza",
        "mobile": "18800001011"
    }
}
```

### 用户注册

#### 请求Url

```bash
/signup
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
    "status": 1
}
```

### 用户登录

#### 请求Url

```bash
/signin
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
        "create_at": "2018-05-09 09:44",
        "id": 5,
        "nickname": "笑嘻嘻嘻嘻",
        "password": "$2a$10$MrpfrR9ckS7Kw6jN4sHj/Ox1fK/jsvJcdOEQL7VLxUHp5LDvo6Cza",
        "mobile": "18800001011"
    }
}
```

### 用户忘记密码

#### 请求Url

```bash
/forget
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

### 获取用户信息

#### 请求Url

```bash
/:id
```

#### 请求方式

```bash
GET
```

#### 参数类型：parma

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|id      |Yes       |number  |用户ID |

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
        "id": 2,
        "nickname": "青湛啦啦啦"
    }
}
```