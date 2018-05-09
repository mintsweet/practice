# 文章模块

模块公共路径为`/post`，以下请求路径省略`http://localhost:3000/api/post`。

## 目录

[获取头条文章列表](#获取头条文章列表)<br>
[获取文章列表](#获取文章列表)<br>
[获取文章详情](#获取文章详情)<br>

## 接口列表

### 获取头条文章列表

#### 请求Url

```bash
/top
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
    "data": [
        {
            "praise_num": 0,
            "comment_list": [],
            "is_top": true,
            "create_at": "2018-05-04",
            "update_at": "2018-05-09 09:56",
            "id": 3,
            "title": "这是三篇文章",
            "content": "这是三点点内容",
            "author_id": 1,
            "cover": "http://image.yujunren.com/react-demo/avatar.jpg"
        }
    ]
}
```

### 获取文章列表

#### 请求Url

```bash
/list
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
    "data": [
        {
            "praise_num": 0,
            "comment_list": [],
            "is_top": true,
            "create_at": "2018-05-04",
            "update_at": "2018-05-09 09:58",
            "id": 3,
            "title": "这是三篇文章",
            "content": "这是三点点内容",
            "author_id": 1,
            "cover": "http://image.yujunren.com/react-demo/avatar.jpg"
        },
        {
            "praise_num": 0,
            "comment_list": [],
            "is_top": false,
            "create_at": "2018-05-04",
            "update_at": "2018-05-09 09:58",
            "id": 1,
            "title": "这是一篇文章",
            "content": "这是一点点的内容",
            "author_id": 1,
            "cover": ""
        },
        {
            "praise_num": 0,
            "comment_list": [],
            "is_top": false,
            "create_at": "2018-05-04",
            "update_at": "2018-05-09 09:58",
            "id": 2,
            "title": "这是二篇文章",
            "content": "这是二点点内容",
            "author_id": 1,
            "cover": ""
        }
    ]
}
```

### 获取文章详情

#### 请求地址

```bash
/:id
```

#### 请求方式

```bash
GET
```

#### 参数类型：query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|id      |Yes       |number  |文章ID |

#### 返回示例

```json
{
    "status": 1,
    "data": {
        "praise_num": 0,
        "comment_list": [],
        "is_top": false,
        "create_at": "2018-05-04",
        "update_at": "2018-05-09 10:03",
        "id": 1,
        "title": "这是一篇文章",
        "content": "这是一点点的内容",
        "author_id": 1,
        "cover": ""
    }
}
```