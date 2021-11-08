import moment from 'moment';
//  ---------EXPORT TO ARRAY FOR SELECT FIELD---------
export const fmSelectArr = (arr: Array<{ [key: string]: any }>, title: string, value: string, options = []) =>
	arr
		.filter((x) => (x.Enable === false ? false : x))
		.map((x) => ({
			title: x[title],
			value: x[value],
			options: options.reduce((obj, o) => ({ ...obj, [o]: x[o] }), {})
		}));

export const clearOptionsDuplicate = (arr: IOptionCommon[]) => {
	return arr.reduce((newArr, o) => {
		if (!newArr.some((o2) => o2.value === o.value)) {
			newArr.push(o);
		}
		return newArr;
	}, []);
};
export const fmArrayToObjectWithSpecialKey = (arr, key) => {
	return arr.reduce((newObj, s) => {
		newObj[s[key]] ? newObj[s[key]].push(s) : (newObj[s[key]] = [s]);
		return newObj;
	}, {});
};
export const numberWithCommas = (number, commas = ',') => {
	if (!number) return number;
	return number
		.toString()
		.replace(/\D/g, '')
		.replace(/(?<=\..*)\./g, '')
		.replace(/\B(?=(\d{3})+(?!\d))/g, commas);
};
export const mathRound = (number) => {
	return Math.round(number * 100) / 100;
};
export const fmDateFromNow = (date) => {
	const local = moment(date).local();
	let formattedDate = '';
	const days = moment().diff(local, 'days');
	if (days >= 2) {
		formattedDate = local.locale('vi').format('DD/MM/YYYY HH:mm');
	} else {
		formattedDate = local.locale('vi').fromNow();
	}
	return formattedDate;
};
export const parsePriceStrToNumber = (str: number | string) => parseInt(str.toString().replace(/\D/g, '')) || 0;
