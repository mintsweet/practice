# API详细说明

基础路径`http://localhost:3000/api`。

## 目录

[公共模块](#公共模块)<br/>
[用户模块](#用户模块)<br/>
[文章模块](#文章模块)<br/>
[分类模块](#分类模块)<br/>
[心情模块](#心情模块)<br/>
[管理员模块](#管理员模块)<br/>

## 公共模块

模块公共路径为`/common`。

  - 获取手机验证码



## 用户模块

模块公共路径为`/user`。

  - 获取当前用户信息
  - 用户注册
  - 用户登录
  - 用户忘记密码
  - 获取用户信息
  
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
    "status": 0,
    "type": "ERROR_GET_ADMIN_INFO",
    "message": "尚未登录"
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
        "create_at": "2018-05-08 11:00",
        "id": 1,
        "mobile": "18788888888",
        "nickname": "青湛",
        "password": "$2a$10$d5ERtrHPWCs4tTyTjnup0etrPRpbjsvDmwByQLAycMxhVtd70UTfa",
        "motto": "清明深湛，清澈透亮"
    }
}
```

## 文章模块

文章模块公共路径`/post`。

  - 获取头条文章
  - 获取文章列表
  - 获取文章详情
  - 点赞文章
  - 评论文章

### 获取头条文章

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
    "status": 0,
    "type": "ERROR_GET_ADMIN_INFO",
    "message": "尚未登录"
}
```

### 用户注册

#### 请求Url

```bash
/top
```

#### 请求方式

```bash
GET
```

#### 参数类型：

#### 返回示例

```json
{
    "status": 1,
    "data": [
        {
            "praise_num": 0,
            "comment_list": [],
            "is_top": true,
            "create_at": "2018-05-04",
            "update_at": "2018-05-08 14:15",
            "id": 3,
            "title": "这是三篇文章",
            "content": "这是三点点内容",
            "author_id": 1,
            "cover": "http://image.yujunren.com/react-demo/avatar.jpg"
        }
    ]
}
```

## 分类模块

## 心情模块

## 管理员模块
