# BillApp
简单人亲账本APP

# 说明
本项目针对人亲账簿的电子化，使用uniapp(vue3+plus.sqlite)编辑生成安卓app，满足简单的增删改查。

# 数据库结构
## 总表结构(仅有一张表)
| 主键  |  账簿名  |  账簿描述   | 账簿封面   |账簿创建时间   |
| ----  | ----    |   ----     |   ----     |  ----        |
|  id   |  name    |  desc      | imgPath    | createdTime   |
## 分表结构(以'bill_' + 总表记录主键作为分表表名)
| 主键   |   姓名  |  金额   | 备注  |
| ----   | ----    |   ----  | ---- |
|  id    |   name  |  amount | desc |
