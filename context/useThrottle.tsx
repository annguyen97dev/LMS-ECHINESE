import {DependencyList, useCallback, useEffect, useRef} from 'react';

const throttleImpl = (cb, delay) => {
	let isThrottled = false;
	return (...args) => {
		if (isThrottled) return;
		isThrottled = true;
		cb(...args);
		setTimeout(() => {
			isThrottled = false;
		}, delay);
	};
};

export const useThrottle = (cb, delay: number, deps?: DependencyList) => {
	const cbRef = useRef(cb);
	useEffect(() => {
		cbRef.current = cb;
	});
	return useCallback(
		throttleImpl((...args) => cbRef.current(...args), delay),
		deps
	);
};
