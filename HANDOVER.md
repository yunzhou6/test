# 网站项目交接文档 (HANDOVER)

> **[给 ChatGPT / 接手方]**
> 这份文档是本项目所有网站的完整交接说明。请先通读「第 1 节 现状盘点」了解真实状态，
> 再按「第 5 节 每日运营 SOP」执行日常更新。文档中标注 ⚠️ 的项目为待解决问题。

**交接日期**：2026-09-27
**项目负责人（原）**：boss
**仓库**：https://github.com/yunzhou6/test
**技术栈**：纯 HTML / CSS / JavaScript（零依赖、无构建步骤）

---

## 1. 现状盘点（最重要，请先核对）

### 1.1 代码仓库

| 项 | 值 |
|---|---|
| 远程仓库 | `https://github.com/yunzhou6/test`（Public） |
| 默认分支 | `main` |
| 本地路径 | `C:\Users\Administrator\Documents\ChatGPT\healthydogpick\static-sites` |
| 最近提交 | 以 `git log` 为准；2026-09-27 已完成表单、SEO、安全头与站点重建 |
| 提交历史 | `00a75c1` 初始化 → `ca50bb6` 更新文档 → `244e55a` 运营更新 → 后续持续迭代 |
| 跟踪文件数 | **16 个**（两个站点 + 三份文档 + `.gitignore`） |

**仓库目录结构**（重要：两个网站共用同一个仓库、不同子目录）：

```
test/                     ← Git 仓库根（共 16 个跟踪文件）
├── .gitignore            # 排除非网站内容
├── DEPLOY.md             # 部署操作指南（技术细节）
├── HANDOVER.md           # 本文件（交接说明）
├── landing/              # 【站点 A】企业落地页「云启 CloudStart」
│   ├── index.html        # 页面结构 + SEO + Netlify Forms
│   ├── styles.css        # 样式
│   ├── script.js         # 交互与表单提交
│   ├── netlify.toml      # 安全响应头 + 缓存规则
│   ├── robots.txt        # 搜索抓取规则
│   └── sitemap.xml       # 站点地图
└── affiliate/            # 【站点 B】联盟营销主页
    ├── index.html        # 页面结构 + SEO + 合规披露
    ├── styles.css        # 样式
    ├── script.js         # 交互与订阅提交
    ├── netlify.toml      # 安全响应头 + 缓存规则
    ├── robots.txt        # 搜索抓取规则
    └── sitemap.xml       # 站点地图
```

> **注意**：仓库已于 2026-09-27 做过清理，与网站无关的文件（本机 AI 配置、越南店素材转录等）
> 已从版本控制移除并加入 `.gitignore`。**接手方聚焦 `landing/` 和 `affiliate/` 两个目录即可。**

### 1.2 Netlify 站点状态（2026-09-27 实测）

| # | 站点域名 | HTTP 状态 | 发布目录 | 内容 | 判定 |
|---|---|---|---|---|---|
| 1 | `stirring-elf-614467.netlify.app` | **200 ✅** | `landing` | 企业落地页 | **正常在线，自动部署** |
| 2 | `yunzhou6-affiliate.netlify.app` | **200 ✅** | `affiliate` | 联盟营销主页 | **2026-09-27 已重建上线** |
| 3 | `neon-brioche-dfbf3f.netlify.app` | 404 | 已删除 | 历史失效域名 | 不再使用 |
| 4 | `heroic-halva-2007ba.netlify.app` | 404 | 已删除 | 历史失效域名 | 不再使用 |

> **404 根因（已确诊）**：站点 2、3 **已被从 Netlify 账号中删除**。
> 判定依据：域名 DNS 仍解析到 Netlify 服务器（52.74.6.109 等），但返回的是
> Netlify 的 **"site not found"** 默认页 —— 若站点存在只是未部署，应返回 200 + 空白页。
> 建站时这两个站的 Publish directory 也误填为 `landing`（本应 `affiliate`），现已无修复价值。
>
> **结论（已执行）**：旧站点无法修复，已于 2026-09-27 重建为
> **`https://yunzhou6-affiliate.netlify.app`**，Publish directory = `affiliate`，
> 当前 HTTP 200，Git 持续部署已关联。
>
> ✅ **验证结果**：HTML/CSS/JS/robots/sitemap 均 200；JS 语法通过；资源使用相对路径；
> 6 处联盟链接均带 `rel="sponsored nofollow noopener"`；披露声明存在；
> HSTS、`X-Frame-Options`、`X-Content-Type-Options` 等安全响应头已生效。
> 修复过程与排障记录见 [`FIX-affiliate-404.md`](./FIX-affiliate-404.md)。

### 1.3 已验证的线上表现（站点 1）

- 首页返回 **HTTP 200**，页面标题 `云启 CloudStart · 企业级云协作平台`
- 页面内容正常渲染：Hero、导航、联系表单（`contactForm`）等
- `netlify.toml` 的安全响应头已生效：
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Cache-Control: public,max-age=0,must-revalidate`

---

## 2. 两个网站分别是什么

### 站点 A：`landing/` — 企业落地页「云启 CloudStart」

**定位**：To B 产品/企业宣传单页（虚构品牌示例，可替换为真实品牌）。

**页面模块**（自上而下）：
导航栏 → Hero（主标题 + CTA 按钮）→ 信任背书栏 → 功能特性（6 项）→ 数据统计（滚动数字动画）
→ 工作流程（3 步）→ 价格方案（3 档）→ 客户评价 → CTA 区块 → 联系表单 → 页脚

**文件职责**：
- `index.html`：页面结构，含 `<!DOCTYPE html>` + viewport meta，语义化标签
- `styles.css`：移动优先、CSS 变量主题、Grid/Flex 布局，断点 980 / 720 / 380px
- `script.js`：移动端汉堡菜单、表单校验（`preventDefault`）、IntersectionObserver 滚动揭示 + 数字滚动动画
- `netlify.toml`：安全响应头 + 资源缓存 + SPA 回退

### 站点 B：`affiliate/` — 联盟营销主页

**定位**：联盟营销（Affiliate Marketing）落地页，核心逻辑是
**「内容建立信任 → 引导点击联盟链接转化」**，与普通企业站的差异在于合规披露与联盟链接管理。

**页面模块**：
合规披露条（可关闭）→ Hero → 精选好物（3 款）→ 横评对比表 → 品类入口（6 个）
→ 最新评测（3 篇）→ 邮件订阅 → 关于 → 含免责声明的页脚

**关键技术约定**（接手后必须遵守）：
1. **联盟链接必须带 `rel="sponsored nofollow"`** —— SEO 合规要求，当前有 6 处已标注
2. **链接格式**：`https://example.com/affiliate?...&subid=xxx`，`subid` 用于区分流量来源，便于统计转化
   > ⚠️ 当前是占位链接（`example.com`），**需要替换为真实联盟平台链接**
3. **顶部披露条不可删除** —— 平台合规要求（Amazon Associates / FTC / 国内电商联盟均要求明示"含推广链接"）
4. **页脚免责声明不可删除**

**待替换的占位内容**（接手后需与 boss 确认）：
- `[你的细分品类]` → 真实品类
- `[示例产品 A/B/C]` → 真实产品名与价格
- `example.com/affiliate?...` → 真实联盟链接
- 订阅表单已接入 Netlify Forms；如需邮件自动化，后续再连接 Mailchimp 等外部服务

---

## 3. Git 工作流（每日更新的基础）

### 3.1 环境要求

- Git（本机已装）
- 项目目录：`C:\Users\Administrator\Documents\ChatGPT\healthydogpick\static-sites`
- **⚠️ 本机代理环境变量坑**：`HTTPS_PROXY` 若带尾部斜杠（`http://127.0.0.1:10808/`）会导致
  git push 报 `URL rejected: Port number was not a decimal number between 0 and 65535`。
  **修复**（PowerShell）：
  ```powershell
  $env:HTTPS_PROXY = "http://127.0.0.1:10808"    # 去掉尾部斜杠
  $env:HTTP_PROXY  = "http://127.0.0.1:10808"
  ```
  实测 github.com 直连可达（约 0.45s），**必要时可完全不走代理**。

### 3.2 标准更新流程（每次改动都走这三步）

```powershell
# 1. 进入项目目录（⚠️ 必须先 cd，否则报 "not a git repository"）
cd "C:\Users\Administrator\Documents\ChatGPT\healthydogpick\static-sites"

# 2. 查看改了什么（可选，建议做）
git status

# 3. 提交并推送（一条链完成）
git add -A
git commit -m "改动说明（中文可）"
git push
```

**推送成功后**：Netlify 会**自动**在 1–2 分钟内重新部署所有关联站点，无需手动操作。

### 3.3 认证说明

- 首次推送需要 GitHub 凭据。本机已全局配置 `credential.helper = manager`（Git Credential Manager）
- 推送时**弹出浏览器登录** → 授权即可；凭据会被记住，后续免密
- **若浏览器授权失败**：改用 Personal Access Token（PAT）
  - 生成：https://github.com/settings/tokens → Tokens (classic) → 勾选 `repo`
  - 临时使用（用完立即还原干净地址）：
    ```powershell
    git remote set-url origin https://yunzhou6:<你的PAT>@github.com/yunzhou6/test.git
    git push
    git remote set-url origin https://github.com/yunzhou6/test.git
    ```
  - ⚠️ **安全提醒**：PAT 等同于密码，绝不可写进任何仓库文件或提交历史

---

## 4. Netlify 配置参考

### 4.1 站点与发布目录的对应关系（核心概念）

**一个 Git 仓库 → 可建多个 Netlify 站点 → 每个站点通过 `Publish directory` 决定发布哪个子目录。**

| Netlify 站点 | Branch | Build command | Publish directory |
|---|---|---|---|
| 企业落地页 | `main` | **留空** | `landing` |
| 联盟营销主页 | `main` | **留空** | `affiliate` |

> **最容易出错的地方**：`Publish directory` 必须填**子目录名**（`landing` 或 `affiliate`），
> 不能填 `/` 或留空 —— 因为仓库根目录下没有 `index.html`。
> 本次两个站点 404 就是因为这里填错了 `landing`。

### 4.2 新建站点步骤

1. 登录 https://app.netlify.com
2. **Add new site → Import an existing project → GitHub**
3. 授权后选择仓库 `yunzhou6/test`
   - 若列表里看不到仓库：点 **"Configure the Netlify app on GitHub"** → 把权限改为
     **All repositories**（或 Only select repositories 勾选 `test`）→ Save → 回 Netlify 刷新
4. 配置（关键）：
   - **Branch to deploy**：`main`
   - **Build command**：留空
   - **Publish directory**：`landing` 或 `affiliate`
5. 点 **Deploy site** → 等 30–60 秒 → 状态变为 **Published** 即成功

### 4.3 修改已有站点的发布目录

进入站点 → **Site configuration → Build & deploy** →
**页面顶部的表单区**（不是下方折叠卡片列表）→ 修改 **Publish directory** → **Save**
→ 回 **Deploys** 标签 → **Trigger deploy → Deploy site** 手动触发一次。

> 注意：Build settings 在页面**顶部**，下方只有 4 个折叠卡片
> （Continuous deployment / Post processing / Split testing / Build plugins）——
> 很多人找不到就是因为只看到了折叠列表。

---

## 5. 每日运营 SOP（接手后照此执行）

### 5.1 日常内容更新（最高频）

```powershell
cd "C:\Users\Administrator\Documents\ChatGPT\healthydogpick\static-sites"
# 编辑 landing/index.html 或 affiliate/index.html
git add -A && git commit -m "更新：xxx" && git push
```
→ Netlify 自动部署，1–2 分钟后线上生效。

### 5.2 每次更新后的必查项

1. 访问线上地址确认页面正常（浏览器无痕模式 + `Ctrl+Shift+R` 强刷清缓存）
2. 检查控制台（F12）无报错
3. 检查移动端窄屏显示（汉堡菜单可展开）
4. 联盟站额外检查：联盟链接是否可点击、`rel="sponsored nofollow"` 是否保留

### 5.3 更新前自检清单

- [ ] HTML 有 `<!DOCTYPE html>` 与 viewport meta
- [ ] 资源路径使用**相对路径**（`./styles.css`），不要用绝对路径 `/styles.css`
- [ ] 图片带 `width` / `height` 属性（避免 CLS 抖动）
- [ ] 表单仍处理 `preventDefault`
- [ ] 联盟链接均带 `rel="sponsored nofollow"`
- [ ] 披露条 / 页脚免责声明未被误删
- [ ] 未在客户端代码中写入任何密钥 / token

---

## 6. 排障手册（真实踩过的坑）

| 现象 | 根因 | 解决 |
|---|---|---|
| `fatal: not a git repository` | 终端没在项目目录 | 先 `cd "C:\Users\Administrator\Documents\ChatGPT\healthydogpick\static-sites"` |
| `URL rejected: Port number was not a decimal number between 0 and 65535` | 代理环境变量 `HTTPS_PROXY` 尾部带 `/` | 改为 `http://127.0.0.1:10808`（去斜杠） |
| `could not read Username for 'https://github.com'` | 无凭据 / 无法弹出浏览器授权 | 用 PAT 临时嵌入 URL 推送（见 3.3） |
| `Project has not yet been deployed` | Import 后未自动触发部署 | 改好 Publish directory → Deploys → Trigger deploy → Deploy site |
| 站点返回 **404 / "site not found"** | Publish directory 填错（如填了 `landing` 但应是 `affiliate`），或站点被删 | 改对 Publish directory 后重新触发部署 |
| 页面空白 / 样式丢失 | 资源路径用了绝对路径 | 改为相对路径 `./styles.css` |
| 看不到 `yunzhou6/test` 仓库可选 | Netlify 的 GitHub App 权限范围不足 | GitHub 里把 Netlify 仓库权限改为 All repositories |
| 线上还是旧内容 | 浏览器缓存 | `Ctrl+Shift+R` 强制刷新 / 无痕模式 |

---

## 7. 待办事项（⚠️ 需要接手方与 boss 确认后执行）

### P0 — 必须处理

- [x] **修复联盟主页线上缺失** — 已完成（2026-09-27）
  - 新站点：`https://yunzhou6-affiliate.netlify.app`
  - Publish directory：`affiliate`；Branch：`main`；Build command：留空
  - 已验证 HTTP 200、资源、SEO、安全头与 Git 自动部署
- [ ] **联盟站内容替换**：把 `[示例产品 A/B/C]`、价格与 `example.com` 占位链接
      换成真实产品与联盟平台链接（**需 boss 提供**）

### P1 — 建议处理

- [x] **联盟站命名** — 已完成：`yunzhou6-affiliate.netlify.app`
- [ ] **企业站重命名**：可将 `stirring-elf-614467` 改为 `yunzhou6-landing`；
      改名后必须同步更新 canonical、robots 与 sitemap
- [x] **补 `affiliate/netlify.toml`** — 已完成（2026-09-27）：含安全响应头与缓存规则
- [x] **订阅表单接真实后端** — 已接入 Netlify Forms（含蜜罐防垃圾）
- [x] **联系表单接真实后端** — 已接入 Netlify Forms（含蜜罐防垃圾）
- [x] **SEO 完善** — 已补 canonical、Open Graph、Twitter Card、`sitemap.xml`、`robots.txt`

### P2 — 可选优化

- [ ] 自定义域名 + HTTPS（Netlify 自动签发免费证书）
- [ ] 图片资源优化（WebP 格式、懒加载）
- [ ] 接入访问统计（Netlify Analytics / Google Analytics / Umami）

---

## 8. 权限与安全须知

### 需要接手的账号权限

| 平台 | 用途 | 说明 |
|---|---|---|
| GitHub | 代码仓库 `yunzhou6/test` | 需要 push 权限（PAT 或 SSH key） |
| Netlify | 站点部署与配置 | 需要站点管理权限 |

> ⚠️ **交接时应通过平台官方邀请功能添加协作者**，不要直接共享账号密码。
> - GitHub：仓库 Settings → Collaborators → Add people
> - Netlify：Team → Members → Invite

### 安全红线（不可违反）

1. **PAT / token / 密码绝不可写进仓库任何文件**，也不可提交进 Git 历史
2. 前端代码（HTML/CSS/JS）对所有人可见，**绝不可在客户端写入服务端密钥**
3. 联盟链接的 `rel="sponsored nofollow"` 与合规披露**不可删除**（平台合规要求，可能导致封号）
4. 涉及 DNS 修改、删除站点等生产环境操作，**先做影响评估再执行**

---

## 9. 快速参考卡片

```
仓库：      https://github.com/yunzhou6/test
企业落地页：https://stirring-elf-614467.netlify.app
联盟主页：  https://yunzhou6-affiliate.netlify.app
本地路径：  C:\Users\Administrator\Documents\ChatGPT\healthydogpick\static-sites

更新三步：
  cd "C:\Users\Administrator\Documents\ChatGPT\healthydogpick\static-sites"
  git add -A && git commit -m "说明" && git push
  → 等 1–2 分钟，Netlify 自动部署

站点 ↔ 目录：
  landing/    → Publish directory = landing
  affiliate/  → Publish directory = affiliate
```
