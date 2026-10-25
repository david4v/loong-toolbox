# Jina Reader / Search — 网页正文提取

**状态：VERIFIED_DOCS；未在 LOONG 实测；P2**  
https://docs.jina.ai/ | https://jina.ai/reader/ | https://jina.ai/api-dashboard/pricing/

## 能力
通过 r.jina.ai/{url} 将网页等转为 Markdown 供 LLM 处理；Search 可通过 s.jina.ai 使用。匿名与带 Key 的限额、token 计费及搜索权限不同，以官方价格页为准。

## LOONG 用途
测试从搜索结果/官网链接到保留时间、出处和正文的提取质量。目标包括 Reuters、Bloomberg、SCMP、Nikkei 和长博客。收费墙/反爬可能返回失败，不应承诺可读取。

## 实验
选 20 个公开 URL，比较正文保真、发布日期、速度、调用费用与故障。失败要明确记录，不设置静默兜底以掩盖错误。

## 来源
- https://docs.jina.ai/ — Reader / Search API
- https://jina.ai/api-dashboard/pricing/ — Pricing