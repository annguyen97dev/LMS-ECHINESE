import React, { useEffect } from 'react';
import { lessonApi } from '~/apiBase';
import LayoutBase from '~/components/LayoutBase';

const Nothing = () => {
	useEffect(() => {
		(async function pushAuto() {
			try {
				let res = await lessonApi.callAuto(null);
			} catch (error) {
				console.log(error.message);
			}
		})();

		(async function pushAutoMinute() {
			try {
				let res = await lessonApi.callAutoMinute(null);
			} catch (error) {
				console.log(error.message);
			}
		})();
	}, []);

	return <div>running</div>;
};
Nothing.layout = LayoutBase;
export default Nothing;
