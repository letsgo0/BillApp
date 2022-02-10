# BillApp
简易人亲账本APP

# 说明
1. 本项目针对人亲账簿的电子化，使用uniapp(vue3+plus.sqlite)编辑生成安卓app，满足简单的增删改查；
2. app的重点功能是按姓名查找，结合账簿实物使用，**减少人工查找时间**(开发初衷)。

# 数据库结构
## 总表结构(仅有一张表)
| 主键  |  账簿名  |  账簿描述   | 账簿封面   |账簿创建时间   |
| ----  | ----    |   ----     |   ----     |  ----        |
|  id   |  name    |  desc      | imgPath    | createdTime   |
## 分表结构(以'bill_' + 总表记录主键作为分表表名)
| 主键   |   姓名  |  金额    |  页数 | 备注  |
| ----   | ----    |   ----  | ----  | ---- |
|  id    |   name  |  amount | page   |desc |

# BillApp运行效果
1. 首页(账簿展示)

![首页效果图](https://github.com/letsgo0/BillApp/blob/master/docs/readmeImage/init.jpg)

2. 添加账簿

![添加账簿效果图](https://github.com/letsgo0/BillApp/blob/master/docs/readmeImage/createBill.jpg)

3. 修改账簿

![修改账簿效果图](https://github.com/letsgo0/BillApp/blob/master/docs/readmeImage/updateBill.jpg)

4. 账簿记录展示

![账簿记录展示效果图](https://github.com/letsgo0/BillApp/blob/master/docs/readmeImage/ShowBillRecord.jpg)

5. 添加账簿记录

![添加账簿记录效果图](https://github.com/letsgo0/BillApp/blob/master/docs/readmeImage/createBillRecord.jpg)

6. 修改账簿记录

![修改账簿记录效果图](https://github.com/letsgo0/BillApp/blob/master/docs/readmeImage/updateBillRecord.jpg)

7. 按名字查找账簿记录

![查找效果图](https://github.com/letsgo0/BillApp/blob/master/docs/readmeImage/ShowBillRecordAfterFilter.jpg)

