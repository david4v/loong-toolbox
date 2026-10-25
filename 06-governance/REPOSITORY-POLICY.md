# 仓库治理、许可证与 Actions 政策

## Public 边界
本库公开，只放第三方公共信息、链接与原创研究。严禁 secrets、cookies、个人仓位、内部研发配置、受限的商业数据或第三方网站完整前端镜像。

## GitHub Actions
公开仓库使用标准 GitHub-hosted runners 通常免执行分钟费，但不等于无限资源：larger runner、存储、并发、运行时长及服务政策仍约束。工具库默认不部署 workflow；LOONG 生产采集仍用 Cloudflare，不为节省额度迁回 GitHub。

## License
AIHOT 为 MIT；World Monitor 为 AGPL-3.0-only，代码拷贝/改造时必须独立审查其义务。第三方 API 购买、抓取与数据再利用受各自服务条款约束。

## 研究准入问题
增量价值、免费替代、真实月成本、失败可观察性、是否会侵入 LOONG 既有生产架构。未经验证不得标记 INTEGRATED。

## 来源
- https://docs.github.com/en/billing/concepts/product-billing/github-actions — Actions Billing
- https://github.com/koala73/worldmonitor — License
- https://github.com/KKKKhazix/AIHOT — License