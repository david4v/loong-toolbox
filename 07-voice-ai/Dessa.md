# Dessa — Block 原生全双工语音模型

**状态：CANDIDATE / ACCESS_PENDING** · **优先级：P2** · **核验：2026-10-25**

- 官方：https://block.xyz/dessa
- 发布方：Block
- 类别：端到端 Speech-to-Speech、全双工实时语音对话

## 已核实能力
Block 于 2026-10-23 宣布研究预览，强调语音输入到语音输出、同时听和说、停顿和情绪表达；其公开展示称能在 MacBook Pro M4 Max 或更高配置本地推理。训练使用一套 NVIDIA GB200 NVL72。均为发布方声明，尚非独立性能基准。

## 公开发布现状
截至 2026-10-25，未找到官方公开 API、权重、部署包、许可证、计费、模型参数规模及 Linux/Hetzner 配置基准。不可据此宣称开源或可用。

## LOONG 潜在用途
1. 如果推出**价格合理的语音 API**，可用于把投研日报、公司研究摘要做成可对话语音界面；也可用于多语言口头问答。
2. 如仅推出本地权重，应先核实显存、实时系数、CPU 负载和许可证，再决定 Hetzner 或新推理主机的可行性。
3. Cloudflare Workers 适合作鉴权、WebSocket/HTTP 路由、限流、日志、调用外部语音模型；不能将 Workers Paid $5 视为自带可自由部署 Dessa 的 GPU。
4. 不自动给 LOONG 生产增加语音任务；等核心价值和预算明确后才开发。

## API 发布后的准入清单
- 官方 endpoint、区域可用性、实时 streaming/WebSocket、并发与上下文限制；
- 计价单位：输入/输出语音分钟、文本 token、连接分钟、最低消费及预付；
- 质量：中英文、端到端延迟、打断能力、稳定性和幻觉；
- 安全：音频留存、训练数据使用、权限与服务条款；
- 月成本：10/100/1000 小时的场景预算，并比较 Cloudflare Workers AI、Deepgram、其他主流实时语音服务。

## 相关候选
- Kyutai Moshi：https://github.com/kyutai-labs/moshi
- NVIDIA PersonaPlex：https://github.com/NVIDIA/personaplex

## 证据与出处
- https://block.xyz/dessa — Research preview / demos / access
- https://developers.cloudflare.com/workers-ai/platform/pricing/ — Pricing
- https://developers.cloudflare.com/ai-gateway/features/unified-billing/ — Unified Billing
