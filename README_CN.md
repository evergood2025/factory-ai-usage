# Factory AI Usage Dashboard

[English](./README.md)

一个 Factory AI API 用量查看工具，输入 API Key 即可查看当前 Token 消耗和剩余额度。

## 工作原理

通过 Factory AI 的 `/api/organization/members/chat-usage` 接口获取用量数据，前端展示。

## 特性

- **Key 存储在本地浏览器** - API Key 保存在 localStorage，不会上传到服务器
- **多 Key 管理** - 支持保存多个 Key，方便切换查看
- **中英文切换** - 支持中文和英文界面

## 使用

```bash
# 安装依赖
npm install

# 启动
npm run dev

# 构建
npm run build
```

## 部署

生产环境需要配置代理转发 `/api` 请求到 `https://app.factory.ai`。

## 许可证

仅供个人学习和非商业用途，禁止商用。
