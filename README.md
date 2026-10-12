# AI Self-Media Video Packaging Skill

这是我创建的 AI 口播视频包装项目：把视频与对应 SRT 转成可审阅的分镜方案，再用 Remotion 生成带标题、侧卡和流程信息的成片。适合 AI 自媒体讲解、知识分享和操作说明，保留原声与字幕，并检查输出是否可以完整解码。

## 可以做什么

|功能|说明|
|---|---|
|配色|dark 深色、paper 浅色；每条视频保持统一风格|
|排版|title 开场标题、card 侧边信息卡、flow 两至三个原稿条目的展示|
|真人镜头|可选1.06倍轻推近与回落，默认不缩放|
|动效|淡入、轻位移、基础错峰|
|交付检查|字幕、安全区、连续原声、完整解码、黑帧和文件哈希|

输入采用已经剪好的视频与准确、同步的 SRT。项目不会自动修正口误，也不会根据零散词语编造数字、操作步骤或结论。

当前 CLI 使用三版式工作流，内部标识为 `public-lite`。已有 V2 工程保留读取兼容；下面的当前示例与 V2 案例分别标明来源。

## 前期素材准备

先剪好原片与对应字幕。本Skill不处理重读、漏读和气口，不重排讲解，不追加原稿没有的数字、操作步骤或结论。

- **视频 + SRT**：默认推荐，直接合成 MP4，检查真人位置与字幕。
- **只提供 SRT**：按明确的画布尺寸生成透明 MOV，不能据此判断真实人物是否被挡。

字幕模式：

- 原视频已经带有字幕（字幕已固定在画面中）：`--captions burned-in`。
- 原视频没有字幕，希望 Skill 自动生成字幕：`--captions generated`。
- 原视频没有字幕，并且只需要动效、不需要字幕：`--captions none`。

启用真人轻推近时，原视频底部字幕会由当前SRT重绘，保证内容完整，不叠两层字幕。若SRT与原声不同步，先修复输入。

## 安装与使用

需要Node.js 20+、FFmpeg和ffprobe。当前支持16:9横屏输入，透明输出也使用16:9画布。

```bash
git clone https://github.com/zhouyuechuan2025-ui/ai-self-media-video-packaging-skill.git
cd ai-self-media-video-packaging-skill
npm ci
```

四步逐级审核；下列命令的输入与风格必须保持一致：

```bash
# Gate A：只写方案
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out RUN --output-mode composite --captions burned-in --style dark
# Gate B：制作工程输入
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out RUN --output-mode composite --captions burned-in --style dark --approve-gate-a --approve-gate-b
# Gate C：8个时间轴抽帧，人工检查，不导出最终视频
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out RUN --output-mode composite --captions burned-in --style dark --approve-gate-a --approve-gate-b --approve-gate-c
# Gate D：完整MP4与验收记录
npm run package-video -- --video INPUT.mp4 --srt INPUT.srt --out RUN --output-mode composite --captions burned-in --style dark --approve-gate-a --approve-gate-b --approve-gate-c --approve-gate-d --render
# 透明MOV，画布需与目标工程一致
npm run package-video -- --srt INPUT.srt --out RUN --output-mode overlay --width 1920 --height 1080 --fps 30
```

所有阶段可用 `--style paper`。需要真人缩放时，在合成MP4的每条命令中添加 `--presenter-motion subtle`，默认 `off`。透明输出不包含真人原片，所以不支持这个参数。当前工作流使用Remotion；HyperFrames适配器用于维护已有V2工程。

## 检查与限制

```bash
npm test
npm run typecheck
npm run build
npm run verify:public
```

检查源文件哈希、文字与脸部安全区、字幕、首尾和转场、完整解码、黑帧与输出哈希。抽帧、构建成功和解码通过都不能替代完整播放或用户验收。

居中人物使用左右安全区，底部18%预留字幕；全屏标题与流程使用完全不透明底色。三种版式不需要凑八种结构，长片也应按语义使用基础版式。两套风格逐片统一，标题取原稿词语，超长句保持完整字幕并缩短强调词。

详细规则：[功能与限制](references/public-lite.md)、[审核阶段](references/gates.md)、[画面检查](references/visual-quality-gates.md)。

## 当前示例：三版式与两种配色

以下截图由本项目当前渲染器生成，使用可复现的合成测试画面与示例文案，不是真人口播案例，也不作为外部事实的证据。

![开场标题](docs/assets/current-demo/title.png)

![侧边信息卡](docs/assets/current-demo/card.png)

![原稿条目展示](docs/assets/current-demo/flow.png)

![paper浅色风格](docs/assets/current-demo/paper.png)

示例字幕与生成方法见 [示例目录](examples/current-demo/README.md)。

## 历史V2效果记录

<details><summary>展开V2案例截图</summary>

这个已有V2案例为49.273秒、21条SRT，使用8种结构与6套配色。以下截图来自该次成片，展示V2工程的输出；当前CLI使用上面的三种版式。

![真实调用八帧总览](docs/assets/previews/auto-editing-0-contact-sheet.jpg)

![论点与证据](docs/assets/previews/auto-editing-0-01-thesis-and-proof-1.920s.png)

![双侧编辑轨](docs/assets/previews/auto-editing-0-02-editorial-dual-rail-4.269s.png)

![保留口语数值的指标结构](docs/assets/previews/auto-editing-0-03-metric-odometer-6.403s.png)

![命令面板](docs/assets/previews/auto-editing-0-04-command-palette-10.546s.png)

![人物推石上坡的语义简笔画](docs/assets/previews/auto-editing-0-05-semantic-doodle-15.606s.png)

![前后对比](docs/assets/previews/auto-editing-0-06-before-after-scrub-19.564s.png)

![四阶段流程](docs/assets/previews/auto-editing-0-07-four-stage-pipeline-21.501s.png)

![全屏信号路径](docs/assets/previews/auto-editing-0-08-signal-route-26.980s.png)

完整历史证据：[分镜](examples/auto-editing-0/storyboard.json)、[截图manifest](examples/auto-editing-0/preview-manifest.json)。历史进阶语义结构可在 [V2参考](references/visual-structures.md) 查询。

</details>

感兴趣的朋友欢迎咨询业务微信：nanaya093

<img src="docs/assets/contact/nana-wechat-qr.jpg" alt="Nana 业务微信二维码" width="320">
