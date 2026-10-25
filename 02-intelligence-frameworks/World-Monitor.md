# World Monitor — 全球实时情报平台

**状态：VERIFIED_DOCS；P1 研究；AGPL-3.0-only**  
源码：https://github.com/koala73/worldmonitor  
文档：https://worldmonitor.app/docs

## 能力和架构
全球新闻、地缘、航班船舶、能源、市场、灾害与预测市场的多源综合；地图图层、专题面板、缓存、来源新鲜度与跨流信号关联。可查阅 ARCHITECTURE.md、src/workers/analysis.worker.ts、src/workers/ml.worker.ts、src/config/map-layer-definitions.ts 和 src/config/variant.ts。

## LOONG 应用
- 全球宏观事件、战争/能源/市场风险多信号交叉印证。
- 了解新闻聚簇、地理关联、来源 freshness、数据源架构。
- 研究航天、预测市场与能源专题的数据源整合。
- 不以开发大型地图为短期目标。

## 最小实验
选择跨数据流关联和来源新鲜度两项，与 LOONG 现有 24h 新闻窗口对比成本、时效、准确性。

## 许可
AGPL-3.0-only：不得直接把源码复制进私有 LOONG 并假定可闭源分发。架构学习和复制代码需严格区分。第三方数据另有服务条款。

## 来源
- https://github.com/koala73/worldmonitor — README / License
- https://github.com/koala73/worldmonitor/blob/main/ARCHITECTURE.md — Architecture