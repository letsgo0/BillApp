// const numZH = '零一二三四五六七八九';
// const unitZH = '十百千万'; //预计金额在一个亿以下
const numZH = '零壹貳叁肆伍陆柒捌玖';
const unitZH = ['元', '拾', '佰', '仟', '万']; //预计金额在一个亿以下

function num2ZH(num) {
	if (!num) {
		return {
			value: "",
			order: [],
		}
	}
	num = Math.trunc(+num);
	if (isNaN(num)) {
		return {
			value: "无法转换",
			order: [0],
		}
	}
	num = num + '';
	// 亿 千万 百万 十万 万 千 百 十 个 元
	// 9   8   7    6   5  4  3  2  1 元
	if (num.length > 8) {
		// 上了亿就裁剪保留亿下的数值
		num = num.slice(num.length - 8);
	}
	num = '' + (+num); // '0123' => '123'
	// 转为中文
	let numZHed = '';
	let order = [];
	// vois: ['error', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'yuan', 'shi', 'bai', 'qian', 'wan']
	const base = 10;
	let i;
	for (i = 0; i < num.length - 1; ++i) {
		const index = +num[i];
		numZHed += numZH[index];
		let x = num.length - i; // 第几位，从1开始
		order.push(index + 1);
		if (x >= 6) { // 万以上
			x = x - 4;
		}
		numZHed += unitZH[x - 1];
		order.push(x + base);
	}
	// 最后一位
	if (+num[i] === 0 && num.length > 1) {} else {
		numZHed += numZH[+num[i]];
		order.push(+num[i] + 1);
	}
	// 元
	numZHed += unitZH[0];
	order.push(11);
	// 判断是否以 ‘壹拾’开头
	if(numZHed.startsWith('壹拾')){
		numZHed = numZHed.slice(1);
		order = order.slice(1);
	}
	return {
		value: numZHed,
		order: order,
	}
}

export {
	num2ZH,
};
