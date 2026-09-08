# 数学推理动画 · math-visual-reasoning

把一道数学题或一个知识点制作成可追踪的推理动画，让学生看见“为什么成立”。适用于面积推导、几何关系、数与运算、代数、函数等数学讲解。

这是供 Codex 使用的 **v0.1 试用版 skill**，包含制作规范与可复用数学组件；动画制作、预览和导出使用 HyperFrames。它不是独立的视频生成软件。

## 快速开始

### 1. 安装 skill

在准备制作动画的项目目录中执行：

```sh
mkdir -p .agents/skills
git clone https://github.com/kedaya55/math-visual-reasoning.git .agents/skills/math-visual-reasoning
```

当前仓库为私有仓库，需要具有访问权限并已配置 GitHub 登录。目标文件夹若已存在，请先确认是否为已有安装，避免覆盖。

在 Codex 中打开该项目，确认技能列表中出现“数学推理动画”。未出现时重启 Codex。请保留整个文件夹，不能只复制 `SKILL.md`。[Codex 技能安装与发现机制](https://learn.chatgpt.com/docs/build-skills)。

### 2. 准备制作环境

- Node.js 22 或以上、npm、可用的 Chrome/Chromium。
- HyperFrames，以及 `hyperframes`、`hyperframes-core`、`hyperframes-animation`、`hyperframes-cli` 和所需制作流程技能。
- 初次下载依赖需要网络；制作需要工作目录写入和本地预览服务权限。

本机验收组合为 **Node 24.18.0 / HyperFrames 0.8.30**。可让 Codex 检查环境，并根据已安装版本的说明补齐依赖。已验收版本的解释类流程安装命令为：

```sh
npx --yes hyperframes@0.8.30 skills update faceless-explainer
```

安装后核对相关技能是否可用，必要时重启 Codex。HyperFrames 及其技能未捆绑在本仓库中。其他版本与操作系统需重新确认兼容性。

默认字体为 PingFang SC 和 Helvetica Neue；缺少时应明确选择可用替代字体并检查布局。默认无声；配音、音乐按需求另行准备。

### 3. 直接输入题目

不需要自己编写分镜或代码。首次使用建议显式指定 skill，并说明要制作动画，而不只是“解题”：

```text
使用 $math-visual-reasoning，把“−2 + 5 − 4 为什么等于 −1”
制作成适合初中生的数轴推理动画。使用随包组件，中文、无声、横屏。
只做可播放预览，不导出视频；完成必要检查后给我预览入口。
```

也可以从界面的技能选择器选中本技能。输入可以是明确知识点、完整题目或题目截图；截图应先核对识别结果。年级、时长、画幅和声音可选，不完整的数学条件需要澄清。

## 工作流程

**题目 → 核对条件与推理 → 选择表征和组件 → 制作动画 → 检查 → 按请求交付。**

- 图形、标注和数值同步变化，关键依据可追踪。
- 动画解释关系如何形成，不只把文字和图表依次显示。
- 说明按当前步骤出现，已被承接的说明退出，必要条件与标注保留。
- 数学关系、关键画面和框架运行分别检查；组件通过不等于整题已验证。

首次建议先看预览，可直接反馈具体时间点、看不清的对象或重复的说明。满意后继续输入：

```text
按当前预览导出 MP4，1920×1080、60 fps、无声，
保留可编辑工程并检查导出文件。不发布。
```

也可以一开始明确要求完整视频。只请求方案时不制作，只请求预览时不导出。默认中文、1920×1080、60 fps、深色、无声；时长按理解需要安排。

预览由本地服务提供，使用 Codex 实际返回的地址；别人的 localhost 地址不可复用。制作工程的 `index.html` 通常不能靠双击正常播放；随包组件的离线预览页则可以直接打开。

## 仓库内容

| 位置 | 用途 |
| --- | --- |
| [SKILL.md](SKILL.md) | 技能入口与核心原则 |
| [references/components.md](references/components.md) | 组件接入入口 |
| [组件覆盖表](references/component-coverage.md) | 支持的表征与能力边界 |
| [组件接口](references/component-api.md) | 模块参数与用法 |
| [assets/math/](assets/math/) | 16 个数学模块、样式、组件预览与模型测试 |
| [统一离线预览](assets/math/library-preview.html) | 下载后在浏览器中查看新增组件 |
| [验收方法](references/verification.md) | 数学、动态画面与成片检查 |

仓库仅包含 skill 及其资源，不含开发项目文档、视频工程或成片。

## 验证与边界

已完成本机 21 项组件模型测试，以及隔离工作目录内的数轴动画接入、运行和关键画面检查。该验证仍使用本机现有运行环境，不等于全新机器、无上下文制作或学生学习效果已验证。

在仓库根目录可运行：

```sh
node --test assets/math/tests/*.test.mjs assets/tests/*.test.mjs
```

目前不提供通用自动公式排版、碰撞避让、剪拼求解或立体展开。支持一种数学表征，不等于覆盖所有题目；新题仍需逐题设计与验收。

干净环境测试建议先用一道新题，不引用已有项目。反馈时附系统与运行版本、完整提示词、预览或错误信息、具体时间点及期望效果。
