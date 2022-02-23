import React, { useState, useEffect } from 'react';
import { Modal, Tooltip, Card } from 'antd';
import { rankResultApi } from '~/apiBase/package/rank-result';
import { useWrap } from '~/context/wrap';
import PropTypes from 'prop-types';
import PowerTable from '~/components/PowerTable';

RankStudentModal.propTypes = {
	ExamTopicID: PropTypes.number
};

function RankStudentModal(props) {
	const { ExamTopicID } = props;
	const { pageSize, showNoti } = useWrap();
	const [isVisible, setIsVisible] = useState(false);
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [dataRank, setDataRank] = useState<IRankResult[]>([]);
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: 1,
		ExamTopicID: ExamTopicID && ExamTopicID
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: pageNumber
		});
	};

	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await rankResultApi.getAll(todoApi);
			if (res.status === 200) {
				setDataRank(res.data.data);
				setTotalPage(res.data.totalRow);
				console.log('data rank', res.data.data);
			}

			res.status == 204 && setDataRank([]);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const columns = [
		{
			title: 'Hạng',
			dataIndex: 'Rank',
			width: 100,
			align: 'center',
			render: (text, data) => (
				<p className="font-weight-black text-center">
					{data.Rank == 1 ? <img width="15px" className="logo-img mr-1" src="/images/king.png"></img> : text}{' '}
				</p>
			)
		},
		{
			title: 'Học viên',
			width: 150,
			dataIndex: 'StudentName',
			render: (text, data) => <p className="font-weight-primary d-flex align-items-center">{text}</p>
		},
		{
			title: 'Đề thi',
			width: 150,
			dataIndex: 'ExamTopicName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Điểm',
			width: 100,
			dataIndex: 'Point',
			render: (text) => <p className="font-weight-black">{text}</p>
		}
	];

	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	return (
		<>
			<button
				className="btn btn-icon"
				onClick={() => {
					setIsVisible(true);
				}}
			>
				<Tooltip title="Xem xếp hạng">
					<img width="25px" className="logo-img mr-2" src="/images/king.png"></img>
				</Tooltip>
			</button>
			<Modal
				width={700}
				footer={false}
				visible={isVisible}
				title="Bảng xếp hạng"
				onCancel={() => {
					setIsVisible(false);
				}}
			>
				<PowerTable
					currentPage={currentPage}
					totalPage={totalPage && totalPage}
					getPagination={(pageNumber: number) => getPagination(pageNumber)}
					loading={isLoading}
					dataSource={dataRank}
					columns={columns}
				/>
				<Card className="rank-user mt-3">
					<div className="rank-user-detail">
						<div className="rank-user__rank">
							<h6 className="text-center title-rank">Thứ hạng của bạn</h6>
							{dataRank.length == 0 ? (
								<p className="mt-3 mb-0 font-weight-bold text-center">Không có dữ liệu</p>
							) : (
								<>
									<div className="box-rank">{dataRank[0].Rank}</div>
									<p className="text-point">Điểm: {dataRank[0].Point}</p>
								</>
							)}
						</div>
					</div>
				</Card>
			</Modal>
		</>
	);
}

export default RankStudentModal;
