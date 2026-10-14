# chengfeng-video-styles

**把你自己的内容交给 Agent，16 种风格各出一个 3 秒样片，挑一个，再用纯代码做成 10 秒知识讲解短片。** 16 种现成风格，Claude Code / Codex 通用。

![License](https://img.shields.io/badge/license-Apache--2.0-blue) ![Version](https://img.shields.io/badge/version-0.3.0-green)

![同一个主题“茶”，15 种风格各做一条](assets/preview-tea.jpg)

<sub>上图：只给 Agent 这份 Skill 和一个主题“茶”，15 种风格各自冷启动做出的画面（每条 5 秒，截的是结论帧）。</sub>

## 解决什么

想做一条知识短视频，难的往往不是代码，而是“画面该长什么样”。这个 Skill 把 16 种已经验证过的风格写成了固定的画面写法和样片结构。你把自己的文案、口播稿或文章段落交给 Agent，它先把 16 种风格各做一个约 3 秒的样片，放进一个筛选页（你投喂了参考，参考也算一种风格，一起做一个放进来），你挑中一个，它再照着做出可直接播放的 HTML。

- **不用素材**：Canvas 2D / SVG / WebGL / three.js 纯代码，不生图、不找图。
- **一个文件**：16:9 单 HTML，打开就播，循环 10 秒。
- **逐帧可控**：画面只由时间 `t` 决定，同一个 `t` 永远是同一帧，方便截图和导出。
- **先挑后做**：3 秒样片放在同一页循环播放，点选、放大、复制“我选 03”发回给 Agent，选定再做全片。样片这步不省，免得全片跑完、额度用完，效果却不满意。
- **参考一起出**：风格不用自己选，16 种都出样片；手上有合适的视频或截图就一起投喂，参考也算一种风格，同样出一个样片，和现成风格放在同一页挑。
- **讲得清楚**：10 秒一个知识点，一句标题 + 一句点破的结论。

## 快速开始

需要 Node.js 18+。

```bash
npx -y github:Agentchengfeng/chengfeng-video-styles install
```

然后新开一个 Claude Code 或 Codex 会话，直接说：

```text
把下面这段话做成视频：……（贴上你自己的文案）
用皮影戏风格讲曹冲称象
有哪些视频风格？
```

检查与卸载：

```bash
npx -y github:Agentchengfeng/chengfeng-video-styles doctor
npx -y github:Agentchengfeng/chengfeng-video-styles uninstall
```

## 16 种风格

| # | 风格 | # | 风格 | # | 风格 | # | 风格 |
|---|---|---|---|---|---|---|---|
| 01 | 皮影戏 | 05 | 汉字演变 | 09 | 数学可视化 | 13 | 卡点金句 |
| 02 | 等距流程 | 06 | 3D 拆解 | 10 | 地图动画 | 14 | 漫画分格 |
| 03 | 比例尺对比 | 07 | 像素典故 | 11 | 数据信息图 | 15 | 时间线 |
| 04 | 白板手绘 | 08 | 绘本科普 | 12 | 扁平 MG | 16 | 小黑手绘 |

16 小黑手绘关联 [chengfeng-videocut-xiaohei](https://github.com/Agentchengfeng/chengfeng-videocut-xiaohei)，画法以那边为准，需要另外安装。

每种风格的画面写法和样片内容见 [`skills/chengfeng-video-styles/SKILL.md`](skills/chengfeng-video-styles/SKILL.md)。

## 安装器写了什么

- 复制 Skill 到 `~/.claude/skills/chengfeng-video-styles/`（含 LICENSE、NOTICE）。
- 软链 `~/.codex/skills/chengfeng-video-styles` → 上面的目录。
- 已有同名 Skill 时先备份到 `~/.claude/skills/.backups/`，不直接覆盖。
- 不联网、不读写其他文件。

## 仓库结构

```text
chengfeng-video-styles/
├── skills/chengfeng-video-styles/
│   ├── SKILL.md                             # Skill 本体
│   └── 样片筛选.html                         # 样片筛选页模板
├── bin/install.js                           # 安装 / doctor / 卸载
├── assets/preview-tea.jpg                   # README 预览图
├── LICENSE  NOTICE.md  CITATION.cff
└── package.json
```

## 官方来源

本项目由 **成峰 / AI产品自由** 创建并维护，原始仓库：<https://github.com/Agentchengfeng/chengfeng-video-styles>

- X：[@chengfeng240928](https://x.com/chengfeng240928)
- 公众号 / 小红书 / B站 / 抖音 / 视频号：AI产品自由

问题和建议请提 [Issues](https://github.com/Agentchengfeng/chengfeng-video-styles/issues)。觉得有用可以点个 Star。

## License

[Apache-2.0](LICENSE)。转载、改编请保留 [NOTICE.md](NOTICE.md) 中的署名。
