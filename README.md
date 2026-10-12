# AI Self-Media Video Packaging Skill · 公开精简版

以学员版的工作方法为基础，保留可用的语义包装与交付检查，简化视觉表现。当前新作业默认使用 `public-lite`，目标是基础、清楚、稳定，不复制学员版的完整表现能力。

## 能力边界

|能力|公开精简版|学员版保留|
|---|---|---|
|配色|dark、paper 两套基础配色|完整科技艺术配色系统|
|排版|title 标题、card 侧卡、flow 简单流程|丰富分屏、错位双窗、多窗口组合|
|真人镜头|可选1.06倍轻推近与回落|更丰富的收窗、缩放和画面接力|
|动效|淡入、轻位移、基础错峰|复杂编排、空间变化、细节动效|
|质量|准确字幕、人物安全、连续原声、完整解码与哈希检查|同样保证基础质量|

“70%左右”是产品定位，不能精确量化，也不是已经测出的效果评分。差异通过能力数量和表现复杂度体现，不通过错字、遮脸、卡顿或压低清晰度体现。私有学员模板、安装包、真实源视频和SRT不随本仓库发布。

GitHub旧版本已经公开的代码仍在历史中。历史V2项目保留读取兼容；新CLI作业固定使用公开精简版，历史截图不能作为本版效果证据。

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

需要Node.js 20+、FFmpeg和ffprobe。当前公开精简版只支持16:9横屏输入，透明输出也使用16:9画布。

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

所有阶段可用 `--style paper`。需要基础真人缩放时，在合成MP4的每条命令中添加 `--presenter-motion subtle`，默认 `off`。透明输出不包含真人原片，所以不支持这个参数。新公开版只支持Remotion；HyperFrames仅保留历史适配器兼容。

## 检查与限制

```bash
npm test
npm run typecheck
npm run build
npm run verify:public
```

检查源文件哈希、文字与脸部安全区、字幕、首尾和转场、完整解码、黑帧与输出哈希。抽帧、构建成功和解码通过都不能替代完整播放或用户验收。

居中人物使用左右安全区，底部18%预留字幕；全屏标题与流程使用完全不透明底色。三种版式不需要凑八种结构，长片也应按语义使用基础版式。两套风格逐片统一，标题取原稿词语，超长句保持完整字幕并缩短强调词。

详细规则：[公开版边界](references/public-lite.md)、[审核阶段](references/gates.md)、[画面检查](references/visual-quality-gates.md)。

## 历史V2效果记录

<details><summary>展开历史截图（非当前精简版）</summary>

历史案例为49.273秒、21条SRT，使用V2的8种结构与6套配色。以下已有截图对应旧版成片，原验收数据保持不变；不是本次精简版的验证。

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
