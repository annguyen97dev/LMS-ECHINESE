import { Switch } from 'antd';
import React from 'react';
import { courseApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';

function UpdataShowCourse(props) {
	const { Enable, ID, setFilters, filters } = props;
	const { showNoti } = useWrap();

	const onChangeEnable = async (data) => {
		console.log(data);
		try {
			let res = await courseApi.update({ ID: ID, Enable: data });
			if (res.status === 200) {
				showNoti('success', 'Thành công!');
				setFilters({ ...filters });
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	return <Switch checked={Enable} checkedChildren="Hiện" unCheckedChildren="Ẩn" onChange={onChangeEnable} />;
}

export default UpdataShowCourse;
