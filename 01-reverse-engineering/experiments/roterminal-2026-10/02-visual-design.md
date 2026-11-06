# RoTerminal 视觉与前端技术报告

观察：2026-11-06（UTC+8）；目标首页 `/?r=all`，另点击公开 /rising。DIRECT 指本轮截图、DOM 或前端脚本直接支持；不代表后端实现已知。

## 视觉证据与独立设计规格

| 观察 | 等级与证据 | 可独立实现的规格 |
| --- | --- | --- |
| 桌面左侧窄图标栏、上方横向分类；总览图与 Pulse 左右排列 | DIRECT，[桌面](evidence/roterminal-desktop.png) | 主数据占约 2/3，事件占约 1/3；导航与内容分层，主区域保留留白 |
| 移动端主图→事件流纵向排列；底部悬浮图标导航，顶部分类横向延伸 | DIRECT，[移动](evidence/roterminal-mobile.png) | 单列主内容；常用入口贴近拇指，溢出分类独立横向滚动；避免整页横向滚动 |
| Rising 横排卡片内同时有名称、当前量、增幅与小趋势线 | DIRECT，桌面截图 | 卡片固定信息顺序，数值与变化同组；趋势线只补充走势，不替代单位和窗口 |
| 1D→1W 更新曲线、选中 pill、比较值及峰值标注 | DIRECT，[一周状态](evidence/roterminal-week.png) | 时间选择作用于整张主图；用可见选中态和明确比较区间保持可解释性 |
| Rising 页呈排名、图标、年龄、增幅和当前 Playing，顶部解释筛选对象 | DIRECT，[Rising](evidence/roterminal-rising.png) | 排名右对齐数值；变化和基期/当前规模共同展示；标题附近声明筛选范围 |

计算后样式：[DOM 摘要](evidence/dom-design-summary-2026-11-06.json)。白底 #fff，正文 #0a0a0b，次要文字 #8e8e8f，主强调 #007AFF，涨 #1f8f45、跌 #d92d20。正文系统字体栈，声明 SF Pro Text / Inter 等并不证明下载或实际选用 Inter；一级区域标题实测 20px。桌面 gutter 为 clamp(32px,4vw,72px)，390px 时为 max(20px,0px,0px)。这是少量观察 token，不是供复制的原站样式表。

原创建议：采用 20–24px 区块间距、浅中性容器、明显数字层级，卡片使用圆角；无需复制原站像素、素材或全部变量。具体响应式断点 UNKNOWN：只验证两个尺寸，不能把 390/1440 当 CSS 断点。

## 前端与交互边界

DIRECT：资源按 `/assets/<模块>-<hash>.js` 分块；页面有一个 canvas 和大量 SVG，主图脚本直接执行 Canvas 绘图与自有数据模型。可见模块用 DOM 构造和事件绑定。没有直接证据证明 React/Vue，也没有识别到可确认的第三方图表库名称；打包器、原始源码框架 UNKNOWN，不能凭哈希文件名断言 Vite。

补证操作实际触发公开 Rising 导航，标题变为 Rising this week；/api/robot/page/r:rising 返回 200。移动截图中的 1W 控件文字不完整，底栏覆盖底部内容的一部分；如实保留现场状态，不据此宣称移动体验完美。尚未覆盖深色主题、键盘可访问性、错误重试、登录态与全部 hover。

截图限首屏及公开游戏内容，没有输出个人账户页面。完整第三方脚本仅本地检查，公开只存 [脚本指纹](evidence/frontend-artifact-index-2026-11-06.json)。
