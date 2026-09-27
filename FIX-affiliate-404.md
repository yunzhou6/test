# 修复操作单：联盟营销主页 404 问题

> **✅ 执行状态（2026-09-27）**：已完成重建并验证。
> 新站点：`https://yunzhou6-affiliate.netlify.app`（HTTP 200）
> GitHub：`main` 分支；Publish directory：`affiliate`；Build command：留空。
> 本文保留为操作记录与后续排障参考。

> **背景**：`neon-brioche-dfbf3f` 和 `heroic-halva-2007ba` 两个站点返回 404。
> **诊断结论**：这两个站点**已被从 Netlify 删除**（DNS 仍残留指向 Netlify，但站点已不存在）。
> 因此**无法"修"现有站点，只能重建**。好消息是代码完全没问题，5 分钟可完成。
>
> **执行人**：需要 Netlify 账号权限 + 本机终端（推送代码）。
> **预计耗时**：5 分钟。

---

## 前置检查：代码已验证通过 ✅

| 检查项 | 结果 |
|---|---|
| `affiliate/index.html` 可访问 | HTTP 200（14,349 字节） |
| `affiliate/styles.css` 可访问 | HTTP 200（13,970 字节） |
| `affiliate/script.js` 可访问 | HTTP 200（3,359 字节） |
| JS 语法 | 2 个文件均通过 `node --check` |
| HTML 结构 | DOCTYPE / viewport / 标签闭合 全部完整 |
| 资源路径 | 全部相对路径 `./styles.css`（绝对路径 0 处） |
| 联盟链接合规 | 7 处均带 `rel="sponsored nofollow"` |
| 披露声明 | 存在 |
| `netlify.toml` | 已补齐（安全响应头 + 缓存） |

**结论：代码侧无需改动，问题 100% 在 Netlify 配置。**

---

## 第 1 步：把代码推送到 GitHub

在 **PowerShell** 里执行（⚠️ 必须先 cd，否则报 `not a git repository`）：

```powershell
cd "C:\Users\Administrator\WorkBuddy\2026-08-22-13-03-17"
git push
```

**预期输出**：
```
   cfc680a..xxxxx  main -> main
```

**⚠️ 若报 `URL rejected: Port number was not a decimal number...`**：
代理环境变量带了尾部斜杠，先执行这两行再 push：
```powershell
$env:HTTPS_PROXY = "http://127.0.0.1:10808"
$env:HTTP_PROXY  = "http://127.0.0.1:10808"
```

**验证**：打开 https://github.com/yunzhou6/test 确认能看到 `affiliate/netlify.toml` 和 `HANDOVER.md`。

---

## 第 2 步：清理失效站点（可选但推荐）

那两个 404 站点已无内容，留着只会在列表里造成混淆。

对每个站点（`neon-brioche-dfbf3f`、`heroic-halva-2007ba`）：

1. 打开 https://app.netlify.com → 进入该站点
2. 若站点已不在列表中（因为已被删），**跳过即可，无需操作**
3. 若仍在列表中：**Site configuration → 左侧最底部 Danger zone → Delete site** → 输入站点名确认

> **不删也没关系**，不影响第 3 步新建站点。域名不同，不会冲突。

---

## 第 3 步：重建联盟营销主页站点（核心步骤）

1. 打开 https://app.netlify.com
2. 点 **Add new site** → **Import an existing project**
3. 选择 **GitHub**，授权后选中仓库 **`yunzhou6/test`**
   - **看不到仓库？** 点页面上的 **"Configure the Netlify app on GitHub"** →
     把权限改为 **All repositories**（或 Only select repositories 勾选 `test`）→ Save → 回 Netlify 刷新
4. 填写配置 —— **这一步是之前失败的原因，务必逐字核对**：

   | 配置项 | 必须填的值 | 说明 |
   |---|---|---|
   | **Branch to deploy** | `main` | 默认即是 |
   | **Base directory** | *（留空）* | 不要填 |
   | **Build command** | *（留空）* | 纯静态无需构建 |
   | **Publish directory** | **`affiliate`** | ⚠️ **必须是 `affiliate`**，不能是 `landing`、不能是 `/`、不能留空 |

   > **为什么关键**：仓库根目录下没有 `index.html`。
   > 若填 `landing` → 发布的是企业落地页（错站）；
   > 若填 `/` 或留空 → 找不到首页 → **404**。

5. 点 **Deploy site**
6. 等 30–60 秒，状态变化：**Queued → Building → Published**

---

## 第 4 步：验证上线成功

**方式一（页面）**：部署完成后 Netlify 会显示一个网址，形如
```
https://yunzhou6-affiliate.netlify.app
```
点开应看到**联盟营销主页**（顶部有可关闭的合规披露条、精选好物卡片、对比表）。

**方式二（命令行）**：把下面命令里的域名替换为你的新域名后执行：
```powershell
curl.exe -s -o NUL -w "HTTP %{http_code}\n" https://你的新域名.netlify.app/
```
返回 **HTTP 200** 即成功。

**详细核对清单**：
- [ ] 首页返回 HTTP 200，显示联盟主页内容（**不是**「云启 CloudStart」企业页）
- [ ] 顶部合规披露条正常显示，点 × 可关闭
- [ ] 页面样式正常（不是无样式的裸 HTML → 说明 CSS 加载成功）
- [ ] 按 F12 打开控制台，**无红色报错**
- [ ] 缩小浏览器窗口到手机宽度，布局自适应正常
- [ ] 7 个联盟链接可点击跳转（当前是 `example.com` 占位，属正常）

---

## 第 5 步：给站点改个好记的名字（推荐）

默认随机名（如 `sparkly-cat-123456`）不好记也不好交接。

1. 站点页 → **Site configuration** → **Site details** → **Change site name**
2. 建议改为：**`yunzhou6-affiliate`**
3. 改完网址变为 `https://yunzhou6-affiliate.netlify.app`

> 企业落地页站（`stirring-elf-614467`）建议同法改为 `yunzhou6-landing`。

---

## 完成后：两个站点的最终形态

| 站点 | 发布目录 | 建议域名 | 内容 |
|---|---|---|---|
| 企业落地页 | `landing` | `stirring-elf-614467.netlify.app`（暂未改名） | 云启 CloudStart |
| 联盟营销主页 | `affiliate` | `yunzhou6-affiliate.netlify.app` | 优选清单 |

两个站点共享同一个 Git 仓库。**以后改完文件只需：**
```powershell
cd "C:\Users\Administrator\WorkBuddy\2026-08-22-13-03-17"
git add -A && git commit -m "改动说明" && git push
```
→ Netlify 自动重新部署两个站点，无需任何手动操作。

---

## 排障速查

| 现象 | 原因 | 解决 |
|---|---|---|
| 部署成功但页面 404 | Publish directory 填错 | 改为 `affiliate` → Save → Trigger deploy |
| 显示的是企业落地页 | Publish directory 填成了 `landing` | 同上 |
| 页面无样式（裸 HTML） | CSS 路径失效 | 检查 `affiliate/index.html` 第 22 行附近是否 `href="./styles.css"` |
| `Project has not yet been deployed` | 未自动触发部署 | Deploys → **Trigger deploy → Deploy site** |
| 找不到仓库可选 | GitHub App 权限不足 | GitHub 里把 Netlify 权限改为 All repositories |
| `git push` 报代理端口错误 | 代理环境变量尾部斜杠 | 见第 1 步的修复命令 |
| `fatal: not a git repository` | 终端未在项目目录 | 先 `cd "C:\Users\Administrator\WorkBuddy\2026-08-22-13-03-17"` |
| 线上仍是旧内容 | 浏览器缓存 | `Ctrl+Shift+R` 强刷或无痕模式 |
