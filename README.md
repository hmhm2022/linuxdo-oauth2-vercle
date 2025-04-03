# LinuxDo OAuth2 登录示例

这是一个使用LinuxDo OAuth2进行登录认证的Next.js项目示例。

## 功能

- 使用LinuxDo账号进行OAuth2登录
- 获取用户信息并展示

## 本地开发

1. 安装依赖:

```bash
npm install
# 或
yarn install
```

2. 配置环境变量:

复制`.env.local`文件并填入你的LinuxDo OAuth应用信息:

```
LINUXDO_CLIENT_ID=你的客户端ID
LINUXDO_CLIENT_SECRET=你的客户端密钥
LINUXDO_REDIRECT_URI=http://localhost:3000/callback

NEXT_PUBLIC_LINUXDO_CLIENT_ID=你的客户端ID
NEXT_PUBLIC_LINUXDO_REDIRECT_URI=http://localhost:3000/callback
```

3. 启动开发服务器:

```bash
npm run dev
# 或
yarn dev
```

4. 在浏览器打开 [http://localhost:3000](http://localhost:3000)

## 项目结构

- `pages/index.js` - 首页，包含登录按钮
- `pages/callback.js` - OAuth回调页面，处理授权码并获取用户信息
- `pages/api/token.js` - 服务端API，用于获取访问令牌
- `pages/api/user.js` - 服务端API，用于获取用户信息

## 注意事项

在LinuxDo开发者平台创建应用时，需要将回调URL设置为`http://localhost:3000/callback`(本地开发)。 