import { day } from 'date-arithmetic';
import moment from 'moment';
import { useEffect, useRef } from 'react';
//  ---------EXPORT TO ARRAY FOR SELECT FIELD---------
export const fmSelectArr = (arr: Array<{ [key: string]: any }>, title: string, value: string, options = []) => {
	if (Array.isArray(arr) && arr.length > 0) {
		return arr
			.filter((x) => (x.Enable === false ? false : x))
			.map((x) => ({
				title: x[title],
				value: x[value],
				options: options.reduce((obj, o) => ({ ...obj, [o]: x[o] }), {})
			}));
	}
	return [];
};
export function removeRepeatElementSorted(arr, n) {
	if (n == 0 || n == 1) return n;

	let temp = [arr[0]];
	// Start traversing elements
	let j = 0;
	for (let i = 0; i < n - 1; i++) if (arr[i] != arr[i + 1]) temp.push(arr[i + 1]);
	return temp;
}

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

// GET VISIBLE STATUS
export function usePageVisibility(cb) {
	const timeoutId = useRef(null);

	let delay = 0;

	const browserCompatApi = () => {
		let hidden, visibilityChange;
		if ('hidden' in document) {
			hidden = 'hidden';
			visibilityChange = 'visibilitychange';
		} else if ('mozHidden' in document) {
			// Firefox up to v17
			hidden = 'mozHidden';
			visibilityChange = 'mozvisibilitychange';
		} else if ('webkitHidden' in document) {
			// Chrome up to v32, Android up to v4.4, Blackberry up to v10
			hidden = 'webkitHidden';
			visibilityChange = 'webkitvisibilitychange';
		}
		return {
			hidden,
			visibilityChange
		};
	};

	const cleanupTimeout = () => clearTimeout(timeoutId.current);

	useEffect(() => {
		const { hidden, visibilityChange } = browserCompatApi();

		if (typeof cb !== 'function') throw new Error('callback must be a function');

		const handleVisibilityChange = () => {
			if (delay) {
				if (typeof delay !== 'number' || delay < 0) {
					throw new Error('delay must be a positive integer');
				}

				if (timeoutId.current) cleanupTimeout();
				timeoutId.current = setTimeout(() => cb(!document[hidden]), delay);
			} else {
				cb(!document[hidden]);
			}
		};

		document.addEventListener(visibilityChange, handleVisibilityChange);

		return () => {
			document.removeEventListener(visibilityChange, handleVisibilityChange);
		};
	}, [cb]);
}

export const parseToMoney = (value) => {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const createDateObject = (dateState, locale) => {
	const year = dateState.getFullYear();
	const month = dateState.toLocaleDateString(locale, { month: 'long' });
	const date = dateState.getDate();
	const hour = ('0' + dateState.getHours()).slice(-2);
	const minute = ('0' + dateState.getMinutes()).slice(-2);
	const second = ('0' + dateState.getSeconds()).slice(-2);
    return { year, month, date, hour, minute, second }
}