# 牛来博物馆

名作戏仿线上展厅，共十三件牛来版名画。第二辑新增抱银鼠的牛来、倒牛奶的牛来、牛来荡秋千、牛来翻越阿尔卑斯山、雾海上的牛来、拾穗的牛来们、缠绷带的牛来自画像、沉睡的牛来、牛来之吻、美式牛来。

代码仓库：[GitHub](https://github.com/cp3126675-arch/niulai-museum)

在线参观：[牛来博物馆](https://niulai-museum.pages.dev/)

## 本地浏览

- 直接打开 `dist/index.html` 即可离线浏览；也可在 dist 目录启动静态服务器。
- 支持艺术时期筛选、作品详情、左右键切换、Esc 退出，以及记住明暗模式偏好。
- 所有展品图片均保存在 `dist/assets`，使用内置 ImageGen 生成。完整提示词见 `notes/image-prompts.json`。
- 馆藏文字、年份和原作资料链接维护在 `content/works.json`，运行 `npm run build` 同步网页卡片及详情数据。
- 界面和实现为本项目重新编写，参考奶蛙博物馆的正式展馆语气与名作戏仿理念。

## 发布到 Cloudflare Pages

网站无需构建，发布目录为 `dist`。本项目使用 Wrangler 直接上传到 Cloudflare Pages，GitHub 用于保存源代码；推送 GitHub 不会自动部署。

首次在新设备上发布前，用 `npx wrangler@4.146.0 login` 登录有本项目访问权的 Cloudflare 账号。

```sh
npm run build
npm run check
git push github main
npm run deploy
```

从 GitHub 克隆项目时，将上述 `github` 改为 `origin`。无需 API 密钥写入代码。

`wrangler.jsonc` 为 Cloudflare Pages 配置；`.openai/hosting.json` 保留原 Sites 站点记录，不参与 Cloudflare 发布。

参考网页：https://works.cohub.live/w/157e937b-95da-4c17-add4-f916e37c3574/milk-frog-museum/1980bbadcb26/content/index.html?darkmode=0

角色外形参考来源：https://news.ifeng.com/c/8vcLKbjIKad

本项目为非官方同人项目，与电影制作方无关联；角色权益归原权利人所有。作品年代说明指灵感原作，非本馆二创作品。
