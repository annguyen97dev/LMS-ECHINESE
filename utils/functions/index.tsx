//  ---------EXPORT TO ARRAY FOR SELECT FIELD---------
export const fmSelectArr = (
	arr: Array<object>,
	title: string,
	value: string,
	options = []
) =>
	arr.map((x) => ({
		title: x[title],
		value: x[value],
		options: options.reduce((obj, o) => ({...obj, [o]: x[o]}), {}),
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
export const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
export const mathRound = (number) => {
	return Math.round(number * 100) / 100;
};
