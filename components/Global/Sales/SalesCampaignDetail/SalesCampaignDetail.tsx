import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { branchApi, saleCampaignDetailApi, staffApi } from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import { fmSelectArr, numberWithCommas } from '~/utils/functions';
import SalesCampaignDetailFilter from './SalesCampaignDetailFilter';

const SalesCampaignDetail = (props) => {
	const route = useRouter();
	const { slug: saleCampaignID } = route.query;
	const [saleCampaignDetailList, setSaleCampaignDetailList] = useState<ISaleCampaignDetail[]>([]);
	const [optionBrachList, setOptionBranchList] = useState<IOptionCommon[]>([]);
	const [counselors, setCounselors] = useState<IStaff[]>([]);
	const { showNoti, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	const [totalPage, setTotalPage] = useState(null);
	const sortOptionList = [
		{
			dataSort: {
				sort: 0,
				sortType: true
			},
			value: 1,
			text: 'Tiền tăng dần'
		},
		{
			dataSort: {
				sort: 0,
				sortType: false
			},
			value: 2,
			text: 'Tiền giảm dần'
		}
	];
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: pageSize,
		sort: -1,
		sortType: false,

		SaleCampaignID: saleCampaignID,
		fromDate: '',
		toDate: '',
		CounselorsName: '',
		BranchID: null,
		StudentName: '',
		CounselorsID: null
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false
	});
	const [filters, setFilters] = useState(listFieldInit);

	// FILTER
	const onFilter = (obj) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			fromDate: moment(obj.fromDate).format('YYYY/MM/DD'),
			toDate: moment(obj.toDate).format('YYYY/MM/DD'),
			CounselorsID: obj.CounselorID
		});
	};
	// PAGINATION
	const getPagination = (pageIndex: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		refValue.current = {
			...refValue.current,
			pageSize,
			pageIndex
		};
		setFilters({
			...filters,
			...refValue.current
		});
	};
	// SORT
	const onSort = (option) => {
		refValue.current = {
			...refValue.current,
			sort: option.title.sort,
			sortType: option.title.sortType
		};
		setFilters({
			...listFieldInit,
			...refValue.current
		});
	};
	// RESET SEARCH
	const onResetSearch = () => {
		setActiveColumnSearch('');
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize
		});
	};
	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setActiveColumnSearch(dataIndex);
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			[dataIndex]: valueSearch
		});
	};

	const fetchBrach = async () => {
		try {
			setIsLoading({
				type: 'FETCH_BRANCH',
				status: true
			});
			const res = await branchApi.getAll({ selectAll: true });
			if (res.status === 200) {
				const fmOpTionBranch = fmSelectArr(res.data.data, 'BranchName', 'ID');
				setOptionBranchList(fmOpTionBranch);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_BRANCH',
				status: false
			});
		}
	};
	useEffect(() => {
		fetchBrach();
	}, []);

	// GET DATA TABLE
	const fetchSaleCampaignList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			const res = await saleCampaignDetailApi.getAll(filters);
			if (res.status === 200) {
				setSaleCampaignDetailList(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status === 204) {
				setSaleCampaignDetailList([]);
				setTotalPage(0);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const getCounselorList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			const res = await staffApi.getAll({ pageIndex: 1, pageSize: pageSize, RoleID: 6 });
			if (res.status === 200) {
				let temp = [];
				res.data.data.forEach((item) => temp.push({ title: item.FullNameUnicode, value: item.UserInformationID }));
				setCounselors(temp);
			}
			if (res.status === 204) {
				setCounselors([]);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	useEffect(() => {
		fetchSaleCampaignList();
		getCounselorList();
	}, [filters]);

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'StudentName',
			render: (text) => <p className="font-weight-black">{text}</p>,
			...FilterColumn('StudentName', onSearch, onResetSearch, 'text'),
			className: activeColumnSearch === 'StudentName' ? 'active-column-search' : ''
		},
		{
			title: 'Số tiền',
			dataIndex: 'Price',
			render: (price) => numberWithCommas(price)
		},
		{
			title: 'Tư vấn viên',
			dataIndex: 'CounselorsName',
			...FilterColumn('CounselorsName', onSearch, onResetSearch, 'text'),
			className: activeColumnSearch === 'CounselorsName' ? 'active-column-search' : ''
		},
		{
			title: 'Trung tâm',
			dataIndex: 'BranchName',
			...FilterColumn('BranchID', onSearch, onResetSearch, 'select', optionBrachList),
			className: activeColumnSearch === 'BranchID' ? 'active-column-search' : ''
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		}
	];

	const expandedRowRender = (item: ISaleCampaignDetail) => {
		return (
			<table className="tb-expand">
				<thead>
					<tr>
						<th>Các khóa học</th>
					</tr>
				</thead>
				<tbody>
					{item.Course.map((s) => (
						<tr>
							<td>
								<div className="list-coursename">
									<Link
										key={s.CourseID}
										href={{
											pathname: '/course/course-list/course-list-detail/[slug]',
											query: { slug: s.CourseID, type: s.TypeCourse }
										}}
									>
										<a title={s.CourseName} className="font-weight-black d-block">
											{s.CourseName}
										</a>
									</Link>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	};

	return (
		<ExpandTable
			loading={isLoading}
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			addClass="basic-header"
			TitlePage="Chi tiết chiến dịch kinh doanh"
			dataSource={saleCampaignDetailList}
			columns={columns}
			Extra={
				<div className="extra-table">
					<SalesCampaignDetailFilter handleFilter={onFilter} handleResetFilter={onResetSearch} counselors={counselors} />
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
			expandable={{ expandedRowRender }}
		/>
	);
};

export default SalesCampaignDetail;
