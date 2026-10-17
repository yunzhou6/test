# 云启 CloudStart & 优选清单 · 静态站点仓库

一个 Git 仓库托管两个纯静态网站，使用 Netlify 自动部署。
零依赖、无构建步骤，改完文件 `git push` 即可上线。

| 站点 | 目录 | 线上地址 |
|---|---|---|
| 企业落地页「云启 CloudStart」 | `landing/` | https://stirring-elf-614467.netlify.app |
| 联盟营销主页「优选清单 PickList」 | `affiliate/` | https://yunzhou6-affiliate.netlify.app |

## 目录结构

```
.
├── landing/            # 企业落地页
│   ├── index.html      # 页面结构 + SEO + Netlify Forms
│   ├── styles.css
│   ├── script.js
│   ├── netlify.toml    # 安全响应头 + 缓存规则
│   ├── robots.txt
│   └── sitemap.xml
├── affiliate/          # 联盟营销主页
│   ├── index.html      # 页面结构 + SEO + 合规披露 + Netlify Forms
│   ├── styles.css
│   ├── script.js
│   ├── netlify.toml
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   └── check-sites.ps1 # 线上健康巡检脚本
├── DEPLOY.md           # 部署操作指南
├── HANDOVER.md         # 完整交接文档（先读这份）
└── FIX-affiliate-404.md# 联盟站 404 修复记录
```

## 日常更新

```powershell
cd "C:\Users\Administrator\Documents\ChatGPT\healthydogpick\static-sites"
# 编辑 landing/ 或 affiliate/ 下的文件
git add -A
git commit -m "更新：说明"
git push
```

推送后 Netlify 会在 1–2 分钟内自动部署两个站点。

## 线上健康巡检

```powershell
pwsh -NoProfile -File .\scripts\check-sites.ps1
```

脚本会检查两个站点的首页 HTTP 状态、标题、canonical、HSTS 响应头，
以及 `robots.txt`、`sitemap.xml` 是否可访问；全部通过时退出码为 0。

同一脚本也已接入 GitHub Actions（`.github/workflows/site-health.yml`）：
每天北京时间 09:00 自动巡检一次，`main` 分支每次推送后也会验证，
也可以在仓库 **Actions** 页面手动触发。

## 部署配置

| 站点 | Branch | Build command | Publish directory |
|---|---|---|---|
| 企业落地页 | `main` | 留空 | `landing` |
| 联盟营销主页 | `main` | 留空 | `affiliate` |

## 安全与合规红线

1. PAT / token / 密码绝不写进仓库任何文件或提交历史
2. 前端代码对所有人可见，绝不在客户端写入服务端密钥
3. 联盟链接必须保留 `rel="sponsored nofollow"`，披露声明不可删除
4. 涉及 DNS、删除站点等生产操作，先做影响评估

## 当前待办

- [ ] 联盟站替换真实品类、产品名、价格与联盟平台链接（当前为 `example.com` 占位）
- [ ] 企业站可选重命名为 `yunzhou6-landing`（需同步更新 canonical / robots / sitemap）
- [ ] 可选：接入访问统计、自定义域名

更完整的现状说明、SOP 与排障记录见 [`HANDOVER.md`](./HANDOVER.md)。
