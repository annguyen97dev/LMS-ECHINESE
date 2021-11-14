import React, { useEffect, useState } from 'react';
import { courseExamApi } from '~/apiBase/package/course-exam';
import { packageResultApi } from '~/apiBase/package/package-result';
import NestedTable from '~/components/Elements/NestedTable';
import { useWrap } from '~/context/wrap';
import { Modal, Button, Tooltip } from 'antd';
import Link from 'next/link';

const PackageResultPoint = (props) => {
	const { infoID, point, detailID } = props;
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [detail, setDetail] = useState([]);
	const { showNoti } = useWrap();
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

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

	return (
		<>
			<Tooltip title="Xem điểm chi tiết">
				<button className="font-weight-black btn-nostyle" onClick={showModal}>
					<a
						href=""
						onClick={(e) => {
							e.preventDefault();
						}}
					>
						{point}
					</a>
				</button>
			</Tooltip>
			<Modal
				width={1000}
				title="Bảng điểm chi tiết"
				visible={isModalVisible}
				cancelButtonProps={null}
				okText="Đóng"
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<NestedTable loading={isLoading} addClass="basic-header" dataSource={detail} columns={columns} haveBorder={true} />
				<Link
					href={{
						pathname: '/package/course-exam/detail/[slug]',
						query: { slug: `${detailID}` }
					}}
				>
					<a href="#" className="font-weight-black style-link">
						Xem chi tiết bài làm
					</a>
				</Link>
			</Modal>
		</>
	);
};

export default PackageResultPoint;
