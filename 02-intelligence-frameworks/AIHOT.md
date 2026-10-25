# AIHOT — AI 新闻聚合与事件编审

**状态：VERIFIED_DOCS；P1；MIT**  
源码：https://github.com/KKKKhazix/AIHOT

## 公开机制
RSS/网页/API/X/微信等多源输入；去重与预筛；候选双重评分；事件级聚簇；跨来源事件热度按来源去重并随时间衰减；日报及周期报告。使用 Node/TypeScript、PostgreSQL、pg-boss 与 Docker 等基础设施。

## LOONG 应用
- 全球新闻：文章与事件分离，一件事合并多来源证据，减少重复。
- 公司情报：官方 SEC/IR 公告仍全量保留，聚簇只作辅助，不导致误删。
- 社交观察池：输入统一为 source_id / original_url / published_at / raw_text / fetch_time。
- 评分：先用小样本验证，再决定是否启用双评审及其成本。

## 最小验证
人工标注 30 条同事件稿、10 条独立稿、10 条官方公告，检验误合并、漏合并、信息损失和模型费用。

## 边界
研究算法机制，不为了候选工具将 Cloudflare Workers/D1 重构为 PostgreSQL/Docker。

## 来源
- https://github.com/KKKKhazix/AIHOT — README / Workflow / Clustering / License