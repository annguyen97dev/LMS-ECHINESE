import moment from 'moment';
import router from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { branchApi, studentApi } from '~/apiBase';
import { examServiceApi } from '~/apiBase/options/examServices';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import SortBox from '~/components/Elements/SortBox';
import ParentsAddStudent from '~/components/Global/Customer/ParentsList/ParentsAddStudent';
import ExamServicesDelete from '~/components/Global/Option/ExamServices/ExamServicesDelete';
import ExamServicesForm from '~/components/Global/Option/ExamServices/ExamServicesForm';
import FilterRegisterCourseTable from '~/components/Global/Option/FilterTable/FilterRegisterCourseTable';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';

const ParentsStudent = () => {
	const onSearch = (data) => {
		setCurrentPage(1);
		setParams({
			...listParamsDefault,
			FullNameUnicode: data
		});
	};

	const handleReset = () => {
		setCurrentPage(1);
		setParams(listParamsDefault);
	};
	const columns = [
		{
			title: 'Họ và tên',
			dataIndex: 'FullNameUnicode',
			...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text'),
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Trung tâm',
			dataIndex: 'Branch',
			render: (Branch) => (
				<Fragment>
					{Branch.map((item) => (
						<a href="/" className="font-weight-black d-block">
							{item.BranchName}
						</a>
					))}
				</Fragment>
			)
		},
		{
			title: 'Email',
			dataIndex: 'Email'
		},

		{
			title: 'Số điện thoại',
			dataIndex: 'Mobile'
		}

		// {
		//   render: (data) => (
		//     <>
		//       <ExamServicesForm
		//         examServicesDetail={data}
		//         examServicesId={data.ID}
		//         reloadData={(firstPage) => {
		//           getDataExamServices(firstPage);
		//         }}
		//         currentPage={currentPage}
		//       />

		//       <ExamServicesDelete
		//         examServicesId={data.ID}
		//         reloadData={(firstPage) => {
		//           getDataExamServices(firstPage);
		//         }}
		//         currentPage={currentPage}
		//       />
		//     </>
		//   ),
		// },
	];
	const [currentPage, setCurrentPage] = useState(1);

	const listParamsDefault = {
		pageSize: 10,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		ParentsOf: parseInt(router.query.slug as string),
		FullNameUnicode: null
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
	const { showNoti } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [students, setStudents] = useState<IStudent[]>([]);
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

	const getDataStudents = (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await studentApi.getAll({ ...params, pageIndex: page });
				//@ts-ignore
				res.status == 200 && setStudents(res.data.data);
				if (res.status == 204) {
					showNoti('danger', 'Không tìm thấy dữ liệu!');
					setCurrentPage(1);
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
		getDataStudents(currentPage);
	}, [params]);

	const [dataFilter, setDataFilter] = useState([
		{
			name: 'BranchID',
			title: 'Trung tâm',
			col: 'col-12',
			type: 'select',
			optionList: null,
			value: null
		}
	]);

	const handleFilter = (listFilter) => {
		let newListFilter = {
			pageIndex: 1,
			fromDate: null,
			toDate: null,
			BranchID: null
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

	useEffect(() => {
		getDataCenter();
	}, []);

	return (
		<PowerTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="Danh sách học viên liên kết"
			dataSource={students}
			columns={columns}
			// TitleCard={
			//   <ParentsAddStudent parentsID={parseInt(router.query.slug as string)} />
			// }
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
ParentsStudent.layout = LayoutBase;
export default ParentsStudent;
