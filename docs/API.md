# API文档

## 获取社区规范文档

### 请求Url

```bash
/v1/static/norms
```

### 请求方式

```bash
GET
```

### 返回示例

```text
# 关于薄荷糖社区...
```

## 获取图形验证码

### 请求Url

```bash
/v1/aider/captcha
```

### 请求方式

```bash
GET
```

### 返回示例

```json
{
  "token": "D4AW1",
  "url": "data:image/bmp;base64...."
}
```
