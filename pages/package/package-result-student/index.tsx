import { Switch, Tooltip } from 'antd';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { Eye } from 'react-feather';
import { studentApi, priceFixExamApi } from '~/apiBase';
import { packageDetailApi } from '~/apiBase/package/package-detail';
import { packageResultApi } from '~/apiBase/package/package-result';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';
import PackagePickTeacher from '~/components/Global/Package/PackageResult/PackagePickTeacher';
import PackageResultExpand from '~/components/Global/Package/PackageResult/PackageResultExpand';
import PackageResultUpdateTeacher from '~/components/Global/Package/PackageResult/PackageResultUpdateTeacher';
import LayoutBase from '~/components/LayoutBase';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import { teacherApi } from '~/apiBase';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import PayFixExamForm from '~/components/Global/Package/PayFixExam/PayFixExamForm';

const PackageResultStudent = () => {
	const [dataTeacher, setDataTeacher] = useState([]);
	const [dataStudent, setDataStudent] = useState([]);
	const [userID, setUserID] = useState(null);
	const [dataLevel, setDataLevel] = useState([]);

	const onSearch = (data) => {
		setCurrentPage(1);
		setParams({
			...listParamsDefault,
			StudentName: data
		});
	};

	const handleReset = () => {
		setCurrentPage(1);
		setParams(listParamsDefault);
	};

	const returnTypeExam = (data) => {
		let text = '';
		// if(data.ListeningNumber > 0 && data.SpeakingNumber > 0 && data.WritingNumber > 0 && data.ReadingNumber){
		//     text = "Tổng hợp"
		// }
		if (data.ListeningNumber > 0 || data.ReadingNumber > 0) {
			if (data.SpeakingNumber > 0 || data.WritingNumber > 0) {
				text = 'Tổng hợp';
			} else {
				text = 'Trắc nghiệm';
			}
		} else {
			if (data.SpeakingNumber > 0 || data.WritingNumber > 0) {
				text = 'Tự luận';
			}
		}

		return text;
	};

	const columns = [
		// {
		// 	title: 'Học viên',
		// 	dataIndex: 'StudentName',
		// 	...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text'),
		// 	render: (text) => <p className="font-weight-blue">{text}</p>
		// },

		{
			title: 'Đề thi',
			dataIndex: 'ExamTopicName',
			render: (text, data) => (
				<Link
					href={{
						pathname: '/package/package-set-result/package-set-result-detail/[slug]',
						query: { slug: `${data.ID}` }
					}}
				>
					<a href="#" className="font-weight-black">
						{text}
					</a>
				</Link>
			)
		},
		{
			title: 'Level',
			dataIndex: 'SetPackageLevel',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		// {
		// 	title: 'Hình thức',
		// 	dataIndex: 'ExamTopicTypeName',
		// 	render: (text) => <p className="font-weight-black">{text}</p>
		// },

		{
			title: 'Trạng thái',
			dataIndex: 'StatusID',
			render: (status) => (
				<Fragment>
					{status == 1 && <span className="tag gray">Đã nộp bài</span>}
					{status == 2 && <span className="tag yellow">Đang chấm bài</span>}
					{status == 3 && <span className="tag green">Đã chấm bài</span>}
					{status == 4 && <span className="tag yellow">Đang chấm bài lại</span>}
					{status == 5 && <span className="tag yellow">Đã chấm bài lại</span>}
				</Fragment>
			)
		},
		{
			title: 'Dạng đề',

			align: 'center',
			render: (data) => <>{returnTypeExam(data)}</>
		},
		// {
		// 	title: 'Yêu cầu chấm bài',
		// 	render: (data) => (
		// 		<Fragment>
		// 			<Switch
		// 				checkedChildren="Có"
		// 				unCheckedChildren="Không"
		// 				checked={data.isFixPaid}
		// 				size="default"
		// 				onChange={async (check: boolean) => {
		// 					setIsLoading({
		// 						type: 'GET_ALL',
		// 						status: true
		// 					});
		// 					try {
		// 						let res = await packageResultApi.update({
		// 							...data,
		// 							isFixPaid: check
		// 						});
		// 						res.status == 200 && setParams({ ...params, pageIndex: currentPage }),
		// 							showNoti('success', res.data.message);
		// 					} catch (error) {
		// 						showNoti('danger', error.message);
		// 					} finally {
		// 						setIsLoading({
		// 							type: 'GET_ALL',
		// 							status: false
		// 						});
		// 					}
		// 				}}
		// 			/>
		// 		</Fragment>
		// 	)
		// },
		{
			render: (data) => (
				<>
					{data.isFixPaid && <PackagePickTeacher dataRow={data} dataTeacher={dataTeacher} onFetchData={onFetchData} />}

					<Link
						href={{
							pathname: '/package/package-set-result/package-set-result-detail/[slug]',
							query: { slug: `${data.ID}` }
						}}
					>
						<Tooltip title="Kết quả bộ đề chi tiết">
							<button className="btn btn-icon">
								<Eye />
							</button>
						</Tooltip>
					</Link>
				</>
			)
		}
	];
	const [currentPage, setCurrentPage] = useState(1);
	const [itemDetail, setItemDetail] = useState();

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
			name: 'StudentID',
			title: 'Học viên',
			col: 'col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'SetPackageDetailID',
			title: 'Bộ đề',
			col: 'col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'isDone',
			title: 'Trạng thái',
			col: 'col-12',
			type: 'select',
			optionList: [
				{
					value: true,
					title: 'Đã hoàn thành'
				},
				{
					value: false,
					title: 'Chưa hoàn thành'
				}
			],
			value: null
		},
		{
			name: 'ExamTopicType',
			title: 'Hình thức',
			col: 'col-12',
			type: 'select',
			optionList: [
				{
					value: 1,
					title: 'Trắc nghiệm'
				},
				{
					value: 2,
					title: 'Tự luận'
				}
			],
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
			StudentID: null,
			SetPackageDetailID: null,
			isDone: null,
			StudentName: null,
			ExamTopicType: null
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

	const { showNoti, pageSize, userInformation } = useWrap();
	const listParamsDefault = {
		pageSize: pageSize,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		StudentID: null,
		SetPackageDetailID: null,
		isDone: null,
		StudentName: null,
		ExamTopicType: null
	};
	const [params, setParams] = useState(listParamsDefault);
	const [totalPage, setTotalPage] = useState(null);
	const [packageSetResult, setPackageSetResult] = useState<ISetPackageResult[]>([]);
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
	// GET DATA LEVEL
	const getDataLevel = async () => {
		try {
			let res = await priceFixExamApi.getAll({ pageSize: 9999, pageIndex: 1 });
			if (res.status == 200) {
				let newData = res.data.data.map((item) => ({
					title: item.SetPackageLevel,
					value: item.ID,
					price: item.Price
				}));
				setDataLevel(newData);
				setDataFunc('SetPackageLevel', newData);
			}
		} catch (error) {
			console.log('Error Level Package: ', error.message);
		}
	};

	const getDataStudent = async () => {
		try {
			let res = await studentApi.getAll({ pageSize: pageSize, pageIndex: 1 });
			if (res.status == 200) {
				const newData = res.data.data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				setDataFunc('StudentID', newData);
				setDataStudent(newData);
			}

			res.status == 204 && showNoti('danger', 'Không có dữ liệu học sinh này!');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	const getDataPackageDetail = async () => {
		try {
			let res = await packageDetailApi.getAll({
				pageSize: 99999,
				pageIndex: 1
			});
			if (res.status == 200) {
				const newData = res.data.data.map((item) => ({
					title: item.SetPackageName,
					value: item.ID
				}));
				setDataFunc('SetPackageDetailID', newData);
			}

			res.status == 204 && showNoti('danger', 'Không có dữ liệu bộ đề này!');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	useEffect(() => {
		getDataStudent();
		getDataPackageDetail();
		getDataLevel();
	}, []);

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: currentPage
		});
	};

	const onFetchData = () => {
		setParams({
			...params
		});
	};

	const getDataSetPackageResult = (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await packageResultApi.getAll({ ...params, pageIndex: page });
				//@ts-ignore
				res.status == 200 && setPackageSetResult(res.data.data);
				if (res.status == 204) {
					showNoti('danger', 'Không tìm thấy dữ liệu!');
					setCurrentPage(1);
					setParams(listParamsDefault);
					setPackageSetResult([]);
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
		getDataSetPackageResult(currentPage);
	}, [params]);

	useEffect(() => {
		if (userInformation) {
			setUserID(userInformation.UserInformationID);
		}
	}, [userInformation]);

	const expandedRowRender = (data, index) => {
		return (
			<Fragment>
				<PackageResultExpand infoID={data.ID} />
			</Fragment>
		);
	};

	return (
		<ExpandTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="kết quả thi"
			dataSource={packageSetResult}
			columns={columns}
			TitleCard={
				<>
					<PayFixExamForm isBuy={true} userID={userID} dataStudent={dataStudent} dataLevel={dataLevel} />
				</>
			}
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
			handleExpand={(data) => setItemDetail(data)}
			expandable={{ expandedRowRender }}
		/>
	);
};
PackageResultStudent.layout = LayoutBase;
export default PackageResultStudent;
