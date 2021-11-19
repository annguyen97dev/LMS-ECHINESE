import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { consultationStatusApi } from '~/apiBase/options/consultation-status';
import ConsultationStatusDel from '~/components/Global/Option/ConsultationStatus/ConsultationStatusDel';
import ConsultationStatusForm from '~/components/Global/Option/ConsultationStatus/ConsultationStatusForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';

const ConsultationStatus = () => {
	const columns = [
		{
			title: 'Tình trạng tư vấn',
			dataIndex: 'Name',
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{ title: 'Modified By', dataIndex: 'ModifiedBy' },
		{
			title: 'Modified Date',
			dataIndex: 'ModifiedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},

		{
			render: (data) => (
				<>
					<ConsultationStatusForm
						infoDetail={data}
						infoId={data.ID}
						reloadData={(firstPage) => {
							getDataConsultationStatus(firstPage);
						}}
						currentPage={currentPage}
					/>

					<ConsultationStatusDel
						infoId={data.ID}
						reloadData={(firstPage) => {
							getDataConsultationStatus(firstPage);
						}}
						currentPage={currentPage}
					/>
				</>
			)
		}
	];
	const [currentPage, setCurrentPage] = useState(1);

	const { showNoti, pageSize } = useWrap();
	const listParamsDefault = {
		pageSize: pageSize,
		pageIndex: currentPage
	};
	const [totalPage, setTotalPage] = useState(null);
	const [consultationStatus, setConsultationStatus] = useState<IConsultationStatus[]>([]);
	const [params, setParams] = useState(listParamsDefault);
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: currentPage
		});
	};

	const getDataConsultationStatus = (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await consultationStatusApi.getPaged({
					...params,
					pageIndex: page
				});
				res.status == 200 && setConsultationStatus(res.data.data);
				if (res.status == 204) {
					showNoti('danger', 'Không tìm thấy dữ liệu!');
					setCurrentPage(1);
					setConsultationStatus([]);
					setParams(listParamsDefault);
				} else setTotalPage(res.data.totalRow);
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		})();
	};

	useEffect(() => {
		getDataConsultationStatus(currentPage);
	}, [params]);

	return (
		<PowerTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="Tình trạng tư vấn khách hàng"
			TitleCard={
				<ConsultationStatusForm
					reloadData={(firstPage) => {
						setCurrentPage(1);
						getDataConsultationStatus(firstPage);
					}}
				/>
			}
			dataSource={consultationStatus}
			columns={columns}
		/>
	);
};
ConsultationStatus.layout = LayoutBase;
export default ConsultationStatus;
