# 公共模块

模块公共路径为`/common`，以下请求路径省略`http://localhost:3000/api/common`。

## 目录

[获取图形验证码](#获取图形验证码)<br>
[获取手机验证码](#获取手机验证码)<br>

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
        "token": "G22VY",
        "url": ""
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
|mobile      |Yes       |number  |标准手机号格式 |

#### 返回示例

```json
{
    "status": 1
}
```