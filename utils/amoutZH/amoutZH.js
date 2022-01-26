// const numZH = '零一二三四五六七八九';
// const unitZH = '十百千万'; //预计金额在一个亿以下
const numZH = '零壹貳叁肆伍陆柒捌玖';
const unitZH = ['仟万', '佰万', '拾万', '万', '仟', '佰', '拾', '元']; //预计金额在一个亿以下

function num2ZH(num) {
	num = Math.trunc(+num);
	if (isNaN(num)) {
		return {
			isSuccess: false,
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
	// '零一二三四五六七八九十百千万元'  X
	// '零一二三四五六七八九万千百十元' ✔
	const base = 10;
	for (let i = 0; i < num.length; ++i) {
		const index = +num[i];
		// unitZH.length - x == num.length - i
		// ==> x = unitZH.length - num.length + i;
		const x = unitZH.length - num.length + i;
		numZHed += numZH[index] + unitZH[x];
		order.push(index);
		if(x < 3){
			order.push(x + 1 + base);
			order.push(0 + base);
		}else{
			order.push(x - 3 + base);
		}
	}
	// order.push(base + 4 + 1); // 元的下标
	return {
		isSuccess: true,
		value: numZHed,
		order: order,
	}
}

export {
	num2ZH,
};
