//  ---------EXPORT TO ARRAY FOR SELECT FIELD---------
export const fmSelectArr = (arr, title, value, options = []) =>
	arr.map((x) => ({
		title: x[title],
		value: x[value],
		options: options.reduce((obj, o) => ({...obj, [o]: x[o]}), {}),
	}));
