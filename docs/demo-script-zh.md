# Split Intent Demo Script

## 0:00-0:30 Opening

Split Intent 展示的是一个很简单的 Intents 场景：参与者可以从不同链付款，但收款人只定义最终想收到什么。

这个项目不是在展示一条复杂路线，而是在展示一个结果：多人付款，最终汇总成 Base 上的 USDC。

## 0:30-1:15 Scenario

这里用羽毛球场地和球费 AA 作为背景。

组织者创建一次收款，总额是 126 USDC，6 个人参与，每个人 21 USDC。

重点不是羽毛球本身，而是这个付款模式：每个参与者可能在不同链上有资金，但组织者希望最后只在一个目标链上收到一种资产。

## 1:15-2:15 Product Flow

第一屏是创建 split。组织者看到场地费、球费、人数、总额和每人应付金额。

第二屏是参与者付款视角。这里参与者从 Arbitrum 付款，但 receiver outcome 固定为 Base USDC。

第三屏是结算视角。不同参与者来自不同链，状态分别是 signed、delivered、settled，但最终目标都是同一个 receiver outcome。

## 2:15-3:20 LI.FI Intents

LI.FI Intents 的核心是表达结果，而不是指定路径。

在这个项目里，用户不需要先理解桥、DEX、路径和 solver。用户只需要看到：我从这条链付款，收款人最终在 Base 收到 USDC。

App 使用 LI.FI Intents 的 supported chains 和 routes 数据来证明这个 flow 对接的是实时网络能力。数据层会在 live data 可用时显示 ready；如果 API 不可用，则显示 fallback，保证 demo 稳定。

## 3:20-4:00 Demo Boundary

当前版本为了演示稳定性，quote 和 settlement 使用 preview lifecycle。

下一步可以接入真实 quote request、钱包签名、order submission 和 status tracking。

这个原型想表达的是：Intents 可以让跨链支付更像一个简单的结果声明，而不是一张复杂的路线图。

