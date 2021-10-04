import {Tooltip} from 'antd';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useEffect, useRef, useState} from 'react';
import {Info} from 'react-feather';
import {examTopicApi, packageApi} from '~/apiBase';
import {packageDetailApi} from '~/apiBase/package/package-detail';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';
import PowerTable from '~/components/PowerTable';
import {useWrap} from '~/context/wrap';
import {fmSelectArr} from '~/utils/functions';
import PackageDetailForm from './PackageDetailForm/PackageDetailForm';

const PackageDetail = () => {
	const router = useRouter();
	const {slug: ID} = router.query;
	const [packageDetailList, setPackageDetailList] = useState<
		ISetPackageDetail[]
	>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti} = useWrap();
	const [packageInfo, setPackageInfo] = useState<IPackage>(null);
	const [optionExamTopicList, setOptionExamTopicList] = useState<
		IOptionCommon[]
	>([]);
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,

		SetPackageID: ID,
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
	});
	const [filters, setFilters] = useState(listFieldInit);
	// PAGINATION
	const getPagination = (pageIndex: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		refValue.current = {
			...refValue.current,
			pageSize,
			pageIndex,
		};
		setFilters({
			...filters,
			...refValue.current,
		});
	};
	// RESET SEARCH
	const onResetSearch = () => {
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize,
		});
	};
	// GET DATA IN FIRST TIME
	const fetchPackageDetailList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await packageDetailApi.getAll(filters);
			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					setPackageDetailList(res.data.data);
					setTotalPage(res.data.totalRow);
				}
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	const fetchPackage = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await packageApi.getByID(ID);
			if (res.status === 200) {
				setPackageInfo(res.data.data);
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	const fetchExam = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await examTopicApi.getAll({selectAll: true});
			if (res.status === 200) {
				const fmOptionExamTopicList = fmSelectArr(res.data.data, 'Name', 'ID');
				setOptionExamTopicList(fmOptionExamTopicList);
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};

	useEffect(() => {
		fetchPackage();
		fetchExam();
	}, []);

	useEffect(() => {
		fetchPackageDetailList();
	}, [filters]);

	const onCreatePackageDetail = async (data: {
		Name: string;
		ExamTopicID: number;
	}) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		try {
			const newPackageDetail = {
				SetPackageID: packageInfo.ID,
				ExamTopicID: data.ExamTopicID,
			};
			const res = await packageDetailApi.add(newPackageDetail);
			if (res.status === 200) {
				onResetSearch();
				showNoti('success', res.data.message);
				return res;
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
		}
	};
	const onDeletePackageDetail = (idx: number) => {
		return async () => {
			setIsLoading({
				type: 'ADD_DATA',
				status: true,
			});
			try {
				const delObj = packageDetailList[idx];
				const newDelObj = {
					...delObj,
					Enable: false,
				};
				const res = await packageDetailApi.update(newDelObj);
				res.status === 200 && showNoti('success', res.data.message);
				if (packageDetailList.length === 1) {
					filters.pageIndex === 1
						? (setFilters({
								...listFieldInit,
								...refValue.current,
								pageIndex: 1,
						  }),
						  setPackageDetailList([]))
						: setFilters({
								...filters,
								...refValue.current,
								pageIndex: filters.pageIndex - 1,
						  });
					return;
				}
				fetchPackageDetailList();
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false,
				});
			}
		};
	};
	const columns = [
		{
			title: 'Tên đề thi',
			dataIndex: 'ExamTopicName',
		},
		{
			title: 'Môn',
			dataIndex: 'SubjectName',
		},
		{
			title: 'Level',
			dataIndex: 'SetPackageLevel',
			render: (SetPackageLevel) => `HSK ${SetPackageLevel}`,
		},
		{
			title: 'Thời gian',
			dataIndex: 'Time',
			render: (time) => `${time} phút`,
		},
		{
			title: 'Hình thức',
			dataIndex: 'TypeName',
		},
		{
			align: 'center',
			render: (packageItem: ISetPackageDetail, record, idx) => (
				<>
					<Link
						href={{
							pathname: '/exam/exam-review/[slug]',
							query: {slug: packageItem.ExamTopicID},
						}}
					>
						<Tooltip title="Chi tiết đề thi">
							<a className="btn btn-icon">
								<Info />
							</a>
						</Tooltip>
					</Link>
					<DeleteTableRow handleDelete={onDeletePackageDetail(idx)} />
				</>
			),
		},
	];
	return (
		<>
			<PowerTable
				currentPage={filters.pageIndex}
				totalPage={totalPage}
				getPagination={getPagination}
				loading={isLoading}
				Size="package-list-table"
				addClass="basic-header"
				dataSource={packageDetailList}
				columns={columns}
				TitlePage="Danh sách bộ đề"
				TitleCard={
					<PackageDetailForm
						isLoading={isLoading}
						packageInfo={packageInfo}
						optionExamTopicList={optionExamTopicList}
						handleSubmit={onCreatePackageDetail}
					/>
				}
			/>
		</>
	);
};

export default PackageDetail;
