import { Tooltip } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { areaApi, branchApi, parentsApi, programApi, courseStudentApi, refundsApi } from '~/apiBase';
import { courseReserveApi } from '~/apiBase/customer/student/course-reserve';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import SortBox from '~/components/Elements/SortBox';
import CourseReserveIntoCourse from '~/components/Global/Customer/Student/CourseReserve/CourseReserveIntoCourse';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';
import RequestRefundForm from '~/components/Global/Customer/Finance/Refunds/RequestRefundsForm';
import UpdateStudentReserveDate from '~/components/Global/Customer/Student/CourseReserve/UpdateStudentReserveDate';

const StudentCourseReserve = () => {
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});
	const handleReset = () => {
		setCurrentPage(1);
		setParams(listParamsDefault);
	};

	const paymentMethodOptionList = [
		{
			label: 'Tiền mặt',
			value: 1
		},
		{
			label: 'Chuyển khoản',
			value: 2
		}
	];

	const columns = [
		{
			title: 'Học viên',
			width: 150,
			dataIndex: 'FullNameUnicode',
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Trung tâm',
			width: 150,
			dataIndex: 'BranchName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Khóa học',
			width: 450,
			dataIndex: 'CourseName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Chương trình học',
			width: 150,
			dataIndex: 'ProgramName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Số tiền',
			width: 100,
			dataIndex: 'ProgramPrice',
			render: (price) => <span>{Intl.NumberFormat('en-US').format(price)}</span>
		},
		{
			title: 'Ngày bảo lưu',
			width: 130,
			dataIndex: 'ReserveDate',
			render: (DOB) => moment(DOB).format('DD/MM/YYYY')
		},
		{
			title: 'Ngày hết hạn',
			width: 130,
			dataIndex: 'ExpirationDate',
			render: (DOB) => moment(DOB).format('DD/MM/YYYY')
		},
		{
			title: 'Trạng thái',
			width: 130,
			dataIndex: 'StatusID',
			render: (status) => (
				<>
					{status == 1 && <span className="tag yellow">Đang bảo lưu</span>}
					{status == 2 && <span className="tag blue">Đã hoàn tiền</span>}
					{status == 3 && <span className="tag green">Đã chuyễn vào khóa mới</span>}
					{status == 4 && <span className="tag red">Hết hạn bảo lưu</span>}
				</>
			)
		},
		{
			width: 130,
			render: (data) => (
				<Fragment>
					{data.StatusID == 3 ? (
						<></>
					) : (
						<>
							{/* chỉ có học sinh bảo lưu mới được chuyển qua khoá mới và hoàn tiền */}
							{data.StatusID == 1 && (
								<>
									<CourseReserveIntoCourse
										infoDetail={data}
										infoId={data.ID}
										reloadData={(firstPage) => {
											getDataCourseReserve(firstPage);
										}}
										currentPage={currentPage}
									/>
									<RequestRefundForm
										isLoading={isLoading}
										studentObj={data}
										getInfoCourse={getInfoCourse}
										paymentMethodOptionList={paymentMethodOptionList}
										courseStudentID={data.CourseOfStudentID}
										courseListOfStudent={courseListOfStudent}
										// StatusID={data.StatusID}
										onSubmit={onCreateRequestRefund}
									/>
								</>
							)}
							{/* chỉ có admin mới được update hạn bảo lưu */}
							{userInformation.RoleID == 1 && (data.StatusID == 1 || data.StatusID == 4) && (
								<UpdateStudentReserveDate
									infoDetail={data}
									onUpdateStudentReserveDate={onUpdateStudentReserveDate}
									reloadData={(firstPage) => {
										getDataCourseReserve(firstPage);
									}}
								/>
							)}
						</>
					)}
				</Fragment>
			)
		}
	];
	const [currentPage, setCurrentPage] = useState(1);
	const { showNoti, pageSize, userInformation } = useWrap();
	const listParamsDefault = {
		pageSize: pageSize,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		BranchID: null,
		ProgramID: null
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

	const [dataFilter, setDataFilter] = useState([
		{
			name: 'BranchID',
			title: 'Trung tâm',
			col: 'col-12',
			type: 'select',
			optionList: null,
			value: null
		},

		{
			name: 'ProgramID',
			title: 'Chương trình học',
			col: 'col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'date-range',
			title: 'Ngày tạo',
			col: 'col-12',
			type: 'date-range',
			value: null
		}
	]);

	const handleFilter = (listFilter) => {
		let newListFilter = {
			pageIndex: 1,
			fromDate: null,
			toDate: null,
			BranchID: null,
			StatusID: null,
			AreaID: null
		};
		listFilter.forEach((item, index) => {
			let key = item.name;
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value;
				}
			});
		});
		setParams({ ...listParamsDefault, ...newListFilter, pageIndex: 1 });
	};

	const handleSort = async (option) => {
		setParams({
			...listParamsDefault,
			sortType: option.title.sortType
		});
	};

	const [params, setParams] = useState(listParamsDefault);
	const [totalPage, setTotalPage] = useState(null);
	const [studentCourseReserve, setStudentCourseReserve] = useState<ICourseReserve[]>([]);
	const [courseListOfStudent, setCourseListOfStudent] = useState<ICourseOfStudent[]>([]);

	const setDataFunc = (name, data) => {
		dataFilter.every((item, index) => {
			if (item.name == name) {
				item.optionList = data;
				return false;
			}
			return true;
		});
		setDataFilter([...dataFilter]);
	};

	const getDataCenter = async () => {
		try {
			let res = await branchApi.getAll({ pageSize: 99999, pageIndex: 1 });
			if (res.status == 200) {
				const newData = res.data.data.map((item) => ({
					title: item.BranchName,
					value: item.ID
				}));
				setDataFunc('BranchID', newData);
			}

			res.status == 204 && showNoti('danger', 'Trung tâm Không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	const getDataProgram = async () => {
		try {
			let res = await programApi.getAll({ pageSize: 99999, pageIndex: 1 });
			if (res.status == 200) {
				const newData = res.data.data.map((item) => ({
					title: item.ProgramName,
					value: item.ID
				}));
				setDataFunc('ProgramID', newData);
			}
			res.status == 204 && showNoti('danger', 'Chương trình học Không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	useEffect(() => {
		getDataCenter();
		getDataProgram();
	}, []);

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: currentPage
		});
	};

	const getDataCourseReserve = (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await courseReserveApi.getAll({ ...params, pageIndex: page });
				//@ts-ignore
				res.status == 200 && setStudentCourseReserve(res.data.data);
				if (res.status == 204) {
					showNoti('danger', 'Không tìm thấy dữ liệu!');
					setCurrentPage(1);
					setParams(listParamsDefault);
					setStudentCourseReserve([]);
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

	// REQUEST REFUND
	const getInfoCourse = async (CourseOfStudentPriceID: number) => {
		setIsLoading({
			type: 'FETCH_INFO_COURSE',
			status: true
		});
		try {
			const res = await courseStudentApi.getAll({ CourseOfStudentPriceID });
			if (res.status === 200) {
				setCourseListOfStudent(res.data.data);
			}
			if (res.status === 204) {
				setCourseListOfStudent([]);
			}
		} catch (error) {
			console.log('getInfoCourse', error);
		} finally {
			setIsLoading({
				type: 'FETCH_INFO_COURSE',
				status: false
			});
		}
	};

	//  kích hoạt hoàn tiền
	const onCreateRequestRefund = async (data: {
		ListCourseOfStudentID: number[];
		Price: string;
		PaymentMethodsID: number;
		Reason: string;
		isExpulsion: boolean;
	}) => {
		console.log(data);
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			const { Price } = data;
			const newData = {
				...data,
				Price: parseInt(Price.replace(/\D/g, ''))
			};
			const res = await refundsApi.add(newData);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				return res;
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};

	// gia hạn thời gian bảo lưu
	const onUpdateStudentReserveDate = async (data: { ID: string; ExpirationDate: string }) => {
		console.log(data);
		// setIsLoading({
		// 	type: 'UPDATE_DATA',
		// 	status: true
		// });
		try {
			const { ID, ExpirationDate } = data;
			const res = await courseReserveApi.update({ ID, ExpirationDate });
			if (res.status === 200) {
				showNoti('success', res.data.message);
				return res;
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			// setIsLoading({
			// 	type: 'UPDATE_DATA',
			// 	status: false
			// });
		}
	};

	useEffect(() => {
		getDataCourseReserve(currentPage);
	}, [params]);

	return (
		<PowerTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="Học viên bảo lưu"
			// TitleCard={
			//   <ParentsForm
			//     reloadData={(firstPage) => {
			//       setCurrentPage(1);
			//       getDataParents(firstPage);
			//     }}
			//   />
			// }
			dataSource={studentCourseReserve}
			columns={columns}
			Extra={
				<div className="extra-table">
					<FilterBase
						dataFilter={dataFilter}
						handleFilter={(listFilter: any) => handleFilter(listFilter)}
						handleReset={handleReset}
					/>

					<SortBox dataOption={sortOption} handleSort={(value) => handleSort(value)} />
				</div>
			}
		/>
	);
};
StudentCourseReserve.layout = LayoutBase;
export default StudentCourseReserve;
