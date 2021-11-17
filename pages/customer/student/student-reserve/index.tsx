import { Tooltip } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { areaApi, branchApi, parentsApi, programApi } from '~/apiBase';
import { courseReserveApi } from '~/apiBase/customer/student/course-reserve';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import SortBox from '~/components/Elements/SortBox';
import CourseReserveIntoCourse from '~/components/Global/Customer/Student/CourseReserve/CourseReserveIntoCourse';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';

const StudentCourseReserve = () => {
	const handleReset = () => {
		setCurrentPage(1);
		setParams(listParamsDefault);
	};

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'FullNameUnicode',
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Trung tâm',
			dataIndex: 'BranchName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Chương trình học',
			dataIndex: 'ProgramName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Số tiền',
			dataIndex: 'ProgramPrice',
			render: (price) => <span>{Intl.NumberFormat('en-US').format(price)}</span>
		},
		{
			title: 'Ngày bảo lưu',
			dataIndex: 'ProgramName',
			render: (DOB) => moment(DOB).format('DD/MM/YYYY')
		},
		{
			title: 'Ngày hết hạn',
			dataIndex: 'ExpirationDate',
			render: (DOB) => moment(DOB).format('DD/MM/YYYY')
		},
		{
			title: 'Trạng thái',
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
			render: (data) => (
				<Fragment>
					{data.StatusID == 3 ? (
						<></>
					) : (
						<CourseReserveIntoCourse
							infoDetail={data}
							infoId={data.ID}
							reloadData={(firstPage) => {
								getDataCourseReserve(firstPage);
							}}
							currentPage={currentPage}
						/>
					)}
				</Fragment>
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
		console.log('List Filter when submit: ', listFilter);

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

	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});

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
