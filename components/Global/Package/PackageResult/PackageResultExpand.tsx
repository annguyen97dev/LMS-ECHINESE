//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { packageResultApi } from '~/apiBase/package/package-result';
import NestedTable from '~/components/Elements/NestedTable';
import { useWrap } from '~/context/wrap';

const PackageResultExpand = (props) => {
	const { infoID } = props;
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [detail, setDetail] = useState<ISetPackageResult>([]);
	const { showNoti } = useWrap();

	const fetchDetailInfo = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await packageResultApi.getDetail(infoID);
			if (res.status == 200) {
				let arr = [];
				arr.push(res.data.data);
				setDetail(arr);
			}
		} catch (err) {
			showNoti('danger', err.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	useEffect(() => {
		fetchDetailInfo();
	}, []);

	const columns = [
		{
			title: 'Tổng câu hỏi',
			dataIndex: 'NumberExercise',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Điểm từng môn',
			align: 'center',
			children: [
				{
					title: 'Nghe',
					align: 'center',
					dataIndex: 'ListeningPoint'
				},
				{
					title: 'Nói',
					align: 'center',
					dataIndex: 'SpeakingPoint'
				},
				{
					title: 'Đọc',
					align: 'center',
					dataIndex: 'ReadingPoint'
				},
				{
					title: 'Viết',
					align: 'center',
					dataIndex: 'WritingPoint'
				}
			]
		},
		{
			title: 'Tổng điểm',
			align: 'center',
			dataIndex: 'PointTotal',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note'
		}
	];

	return <NestedTable loading={isLoading} addClass="basic-header" dataSource={detail} columns={columns} haveBorder={true} />;
};

export default PackageResultExpand;
