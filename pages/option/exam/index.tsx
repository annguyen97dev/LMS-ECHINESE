import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { examServiceApi } from '~/apiBase/options/examServices';
import SortBox from '~/components/Elements/SortBox';
import ExamServicesDelete from '~/components/Global/Option/ExamServices/ExamServicesDelete';
import ExamServicesForm from '~/components/Global/Option/ExamServices/ExamServicesForm';
import FilterRegisterCourseTable from '~/components/Global/Option/FilterTable/FilterRegisterCourseTable';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';

const ExamServices = () => {
	const onSearch = (data) => {
		setCurrentPage(1);
		setParams({
			...listParamsDefault,
			ServicesName: data
		});
	};

	const handleReset = () => {
		setCurrentPage(1);
		setParams(listParamsDefault);
	};
	const columns = [
		{
			width: 180,
			title: 'Nhà cung cấp',
			dataIndex: 'SupplierServicesName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'ServicesName',
			...FilterColumn('ServicesName', onSearch, handleReset, 'text'),
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Hình thức',
			dataIndex: 'ExamOfServiceStyle',
			render: (type) => (
				<Fragment>
					{type == 1 && <span className="tag blue">Thi Thật</span>}
					{type == 2 && <span className="tag green">Thi Thử</span>}
				</Fragment>
			)
		},

		{
			title: 'Ngày thi',
			dataIndex: 'DayOfExam',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			width: 120,
			title: 'Thời gian thi',
			dataIndex: 'TimeExam'
		},
		{ title: 'Số thí sinh', dataIndex: 'Amount', width: 120 },
		{
			title: 'Giá bài thi',
			dataIndex: 'Price',
			render: (price) => <span>{numberWithCommas(price)}</span>
		},
		{
			title: 'Trả trước',
			dataIndex: 'InitialPrice',
			render: (price) => <span>{numberWithCommas(price)}</span>
		},
		{
			render: (data) => (
				<>
					<ExamServicesForm
						examServicesDetail={data}
						examServicesId={data.ID}
						reloadData={(firstPage) => {
							getDataExamServices(firstPage);
						}}
						currentPage={currentPage}
					/>

					<ExamServicesDelete
						examServicesId={data.ID}
						reloadData={(firstPage) => {
							getDataExamServices(firstPage);
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
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		ExamOfServiceStyle: null,
		SupplierServicesID: null,
		ServicesName: null
	};

	const sortOption = [
		{
			dataSort: {
				sortType: null
			},
			value: 1,
			text: 'Mới cập nhật'
		},
		{
			dataSort: {
				sortType: true
			},
			value: 2,
			text: 'Từ dưới lên'
		}
	];

	const handleSort = async (option) => {
		setParams({
			...listParamsDefault,
			sortType: option.title.sortType
		});
	};

	const [params, setParams] = useState(listParamsDefault);
	const [totalPage, setTotalPage] = useState(null);
	const [examServices, setExamServices] = useState<IExamServices[]>([]);
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

	const getDataExamServices = (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await examServiceApi.getPaged({ ...params, pageIndex: page });
				res.status == 200 && setExamServices(res.data.data);
				if (res.status == 204) {
					setCurrentPage(1);

					setExamServices([]);
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
		getDataExamServices(currentPage);
	}, [params]);

	const _onFilterTable = (data) => {
		setCurrentPage(1);
		setParams({
			...listParamsDefault,
			SupplierServicesID: data.SupplierServicesID,
			fromDate: data.fromDate,
			toDate: data.toDate,
			ExamOfServiceStyle: data.ExamOfServiceStyle
		});
	};

	return (
		<PowerTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="Đợt thi"
			TitleCard={
				<ExamServicesForm
					reloadData={(firstPage) => {
						setCurrentPage(1);
						getDataExamServices(firstPage);
					}}
				/>
			}
			dataSource={examServices}
			columns={columns}
			Extra={
				<div className="extra-table">
					<FilterRegisterCourseTable _onFilter={(value: any) => _onFilterTable(value)} reloadData={() => handleReset()} />

					<SortBox dataOption={sortOption} handleSort={(value) => handleSort(value)} />
				</div>
			}
		/>
	);
};
ExamServices.layout = LayoutBase;
export default ExamServices;
