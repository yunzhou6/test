# 部署上线指南 · Netlify

本指南帮助你把本仓库里的静态站点（`landing/` 企业落地页、`affiliate/` 联盟营销主页，均为纯 HTML/CSS/JS）部署到 Netlify 并正式上线。
全程免费方案即可完成，预计耗时 5–10 分钟。

---

## 方式一：拖拽部署（最简单，零安装）

适合只想快速上线、不打算用 Git 管理的场景。

1. 把你要上线的那个文件夹（如 `landing/` 或 `affiliate/`）整体拖入，内含 `index.html`、`styles.css`、`script.js`，企业版还含 `netlify.toml`
2. 打开 https://app.netlify.com/drop
3. 将整个文件夹拖入页面虚线框
4. 等待几秒，Netlify 自动分配一个 `xxx.netlify.app` 域名，即已上线 ✅
5. 在站点后台 **Site configuration → Build & deploy → Environment** 无需配置（纯静态）

> 优点：最省事。缺点：每次更新都要重新拖拽。

---

## 方式二：Git 持续部署（推荐，自动更新）

适合长期维护，后续每次 `git push` 自动重新发布。仓库已在本地初始化并提交，结构如下：

```
DEPLOY.md
landing/          # 企业落地页（原「云启 CloudStart」）
  index.html  styles.css  script.js  netlify.toml
affiliate/        # 联盟营销主页
  index.html  styles.css  script.js
```

### 1. 以后改完文件，只需提交
```bash
git add -A
git commit -m "描述你的改动"
```

### 2. 推送到 GitHub / GitLab / Gitee
```bash
git remote add origin <你的仓库地址>
git branch -M main
git push -u origin main
```
> 还没有远程仓库？去 github.com 新建一个**空仓库**（不要勾选 README/许可证），复制它的 HTTPS 或 SSH 地址填到 `<你的仓库地址>`。

### 3. 在 Netlify 关联仓库（开启持续部署）
1. 登录 https://app.netlify.com
2. 点击 **Add new site → Import an existing project**
3. 选择你的代码平台并授权，选中刚推送的仓库
4. 配置（关键两步）：
   - **Build command**：`（留空，纯静态无需构建）`
   - **Publish directory**：选你要上线的那个站点目录
     - 上线企业落地页 → 填 `landing`
     - 上线联盟营销主页 → 填 `affiliate`
5. 点击 **Deploy**

✅ 完成！之后每次 `git push`，Netlify 会自动重新部署，生产环境实时更新。

### 4. 想两套站点都上线？
在 Netlify 再 **Add new site → Import an existing project** 一次，选同一个仓库，
Publish directory 填另一个文件夹即可。两个站点共享一个 Git 仓库，各自独立部署、互不影响。

---

## 方式三：Netlify CLI（命令行）

适合习惯终端、或需要预览生产的场景。

```bash
# 安装 CLI（需要 Node.js）
npm install -g netlify-cli

# 登录
netlify login

# 部署（交互式，按提示选择站点；下方 --dir 改为你要发布的文件夹）
netlify deploy --prod --dir landing     # 企业落地页
# netlify deploy --prod --dir affiliate  # 联盟营销主页
```

本地预览生产构建：
```bash
netlify dev        # 本地启动，默认 http://localhost:8888
```

---

## 自定义域名 + HTTPS

1. 进入站点后台 **Domain management → Domains**
2. 点击 **Add custom domain**，输入你的域名（如 `www.cloudstart.com`）
3. 按页面提示，到你的域名服务商处添加 **CNAME** 记录指向 `xxx.netlify.app`
4. Netlify 会自动签发并续期 **免费 HTTPS 证书**（无需手动操作）
5. 验证：浏览器访问自定义域名，地址栏出现锁标即成功

> 影响评估：修改 DNS 解析会影响该域名现有流量，建议在低峰期操作；若域名曾指向其他服务，请先确认无重要业务在跑。

---

## 部署检查清单

- [ ] 本地打开 `index.html` 确认页面正常、无控制台报错
- [ ] 移动端（窄屏）导航汉堡菜单可正常展开/收起
- [ ] 表单校验生效（空字段、错误邮箱会提示）
- [ ] 滚动揭示与数字动画正常
- [ ] 所有资源使用相对路径（`./styles.css`、`./script.js`）
- [ ] `netlify.toml`（企业版在 `landing/`）已随站点一起上传
- [ ] 上线后访问分配的 `*.netlify.app` 域名确认可打开
- [ ] （可选）自定义域名 + HTTPS 已配置

---

## 回滚与验证

- **查看部署历史**：站点后台 **Deploys** 列表，每一次发布都有唯一 ID
- **一键回滚**：在某次历史部署上点击 **Publish deploy** 即可回退到该版本
- **生产验证**：上线后用浏览器无痕模式访问，确认 CSS/JS 已正确加载（Ctrl+Shift+R 强制刷新清缓存）

---

## 常见失败与排查

| 现象 | 可能原因 | 解决 |
|------|----------|------|
| 页面空白 / 样式丢失 | 资源路径用了绝对路径 `/styles.css` | 改为相对路径 `./styles.css` |
|  deploying 卡在 build | 误填了 build 命令 | 纯静态站点 Build command 留空，Publish directory 设为 `/` |
| 自定义域名无法访问 | DNS CNAME 未生效或填错 | 用 `dig www.你的域名` 检查是否指向 netlify |
| HTTPS 证书一直待签发 | 域名未正确解析到 Netlify | 先确认 CNAME 生效，证书通常 1 小时内自动签发 |
