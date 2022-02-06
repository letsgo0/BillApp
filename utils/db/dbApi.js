import * as db from './dbUtil.js'

Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
};

const dbName = "bill";
const path = "_doc/bill.db";
db.config(dbName, path);

// 两类表
// 一类总表记录账簿名字
// 一类表记录每个账簿的具体信息，根据总表记录动态添加
const rootTable = 'bills';

function createBillsTable() {
	const sqlStr =
		`create table if not exists ${rootTable}("id" INTEGER PRIMARY KEY AUTOINCREMENT,"name" TEXT,"desc" TEXT,"imgPath" TEXT,"createdTime" TEXT)`;
	// console.log('sqlStr');
	// console.log(sqlStr);
	const res = db.createTable(sqlStr)
		.then(res => {
			// console.log('res');
			// console.log(res);
			return {
				isSuccess: true,
			}
		})
		.catch(error => {
			// console.log(error);
			return {
				isSuccess: false
			}
		});
	return res;
}

function createBillTable(billName) {
	const sqlStr =
		`create table if not exists ${billName}("id" INTEGER PRIMARY KEY AUTOINCREMENT,"name" TEXT,"amount" INTEGER, "desc" TEXT, "page" INTEGER);`;
	const res = db.createTable(sqlStr)
		.then(res => {
			return {
				isSuccess: true,
			}
		})
		.catch(error => {
			return {
				isSuccess: false
			}
		});
	return res;
}

function addBill(obj) {
	//判断有没有传参
	//判断传的参是否有值
	const b = (JSON.stringify(obj) == "{}");
	if (!obj || b) {
		return new Promise((res, rej) => rej({
			isSuccess: false
		}));
	}

	//obj传来的参数对象
	const name = obj.name; //账簿名称
	const desc = obj.desc; //账簿描述
	const imgPath = obj.imgPath; //账簿封面图片路径
	const createdTime = new Date().format("yyyy年MM月dd日 hh时mm分ss秒"); //创建时间
	const sqlStr = [
		`insert into ${rootTable}(name,desc,imgPath,createdTime) values("${name}", "${desc}", "${imgPath}","${createdTime}");`,
		`select last_insert_rowid();`
	]
	const res = db.addRecord(sqlStr[0])
		.then(res => {
			return db.selectRecord(sqlStr[1]);
		})
		.then(res => {
			// console.log(res);
			return {
				rowId: res[0]["last_insert_rowid()"],
				isSuccess: true,
			}
		})
		.catch(error => {
			// console.log(error);
			return {
				isSuccess: false
			}
		});
	return res;
}

function addBillRecord(obj) {
	//判断有没有传参
	//判断传的参是否有值
	const b = (JSON.stringify(obj) == "{}");
	if (!obj || b) return new Promise((res, rej) => rej({
		isSuccess: false
	}));

	//obj传来的参数对象
	const tableName = obj.tableName; //账簿表名
	const name = obj.name; //人名
	const amount = obj.amount; //金额
	const desc = obj.desc; // 备注
	const page = obj.page; // 页数
	const sqlStr = [`insert into ${tableName}(name,amount,desc,page) values("${name}", "${amount}", "${desc}", "${page}");`,
		`select last_insert_rowid();`
	];
	console.log(sqlStr);
	const res = db.addRecord(sqlStr[0])
		.then(res => {
			return db.selectRecord(sqlStr[1]);
		})
		.then(res => {
			return {
				rowId: res[0]["last_insert_rowid()"],
				isSuccess: true,
			}
		})
		.catch(error => {
			return {
				isSuccess: false
			}
		});
	return res;
}

// 返回所有账簿
function selectAllBill() {
	const sqlStr = `select * from ${rootTable}`;
	return db.selectRecord(sqlStr);
}
// 按账簿名字查找
function selectBillByName(name) {
	// 空
	if (!name) return new Promise((res, rej) => rej({}));
	// 精确搜索
	// const sqlStr = `select * from ${rootTable} where name = ${name}`;
	// 模糊搜索
	const sqlStr = `select * from ${rootTable} where name like "${name}"`;
	return db.selectRecord(sqlStr);
}

// 按账簿中的名字查找
function selectBillRecordByName(tableName, name) {
	if (!name) return new Promise((res, rej) => rej({}));
	// 精确搜索
	// const sqlStr = `select * from ${rootTable} where name = "${name}"`;
	// 模糊搜索
	const sqlStr = `select * from ${tableName} where name like "${name}"`;
	return db.selectRecord(sqlStr);
}
// 分页查询
function selectBillAllRecords(billTableName) {
	const sqlStr = `select * from ${billTableName};`;
	return db.selectRecord(sqlStr);
}

function updateBill(bill) {
	const id = bill.id;
	delete bill.id;
	const strArr = [];
	for (const key in bill) {
		if (bill.hasOwnProperty(key)) {
			strArr.push(`${key} = "${bill[key]}"`);
		}
	}
	const sqlStr =
		`update ${rootTable} set ${strArr.join(', ')} where id = "${id}"`;
	console.log(sqlStr);
	const res = db.updateRecord(sqlStr)
		.then(res => {
			return {
				isSuccess: true,
			}
		})
		.catch(error => {
			return {
				isSuccess: false
			}
		});
	return res;
}

function updateBillRecord(obj) {
	const {
		tableName,
		id,
		name,
		amount,
		desc,
		page,
	} = obj;
	const sqlStr = `update ${tableName} set name = "${name}", amount= "${amount}", desc = "${desc}", page="${page}" where id = "${id}"`;
	console.log(sqlStr);
	const res = db.updateRecord(sqlStr)
		.then(res => {
			console.log(res);
			return {
				isSuccess: true,
			}
		})
		.catch(error => {
			console.log(error);
			return {
				isSuccess: false
			}
		});
	return res;
}

function deleteBill(id) {
	const sqlStr = `delete from ${rootTable} where id = "${id}"`;
	const res = db.deleteBill(sqlStr)
		.then(res => {
			return {
				isSuccess: true,
			}
		})
		.catch(error => {
			return {
				isSuccess: false
			}
		});
	return res;
}

function deleteBillRecord(tableName, id) {
	const sqlStr = `delete from ${tableName} where id = "${id}"`;
	console.log(sqlStr);
	const res = db.deleteBill(sqlStr)
		.then(res => {
			return {
				isSuccess: true,
			}
		})
		.catch(error => {
			console.log(error);
			return {
				isSuccess: false
			}
		});
	return res;
}

const openSqlite = db.openSqlite;

const closeSQL = db.closeSQL;

const isOpen = db.isOpen;
export {
	// db.openSqlite as openSqlite,
	// 	db.closeSQL as closeSQL,
	// 	db.isOpen as isOpen,
	openSqlite,
	closeSQL,
	isOpen,
	createBillsTable,
	createBillTable,
	addBill,
	addBillRecord,
	selectAllBill,
	selectBillByName,
	selectBillRecordByName,
	selectBillAllRecords,
	updateBill,
	updateBillRecord,
	deleteBill,
	deleteBillRecord
}
