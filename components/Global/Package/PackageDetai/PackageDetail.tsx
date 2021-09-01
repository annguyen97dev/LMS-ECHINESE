import {Card, List} from 'antd';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useEffect, useRef, useState} from 'react';
import {examTopicApi, packageApi} from '~/apiBase';
import {packageDetailApi} from '~/apiBase/package/package-detail';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';
import SortBox from '~/components/Elements/SortBox';
import TitlePage from '~/components/Elements/TitlePage';
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
		sort: -1,
		sortType: false,

		SetPackageID: ID,
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,
	});
	const [filters, setFilters] = useState(listFieldInit);
	// SORT OPTION
	const sortOptionList = [
		{
			dataSort: {
				sort: 0,
				sortType: true,
			},
			value: 1,
			text: 'Level tăng dần',
		},
		{
			dataSort: {
				sort: 0,
				sortType: false,
			},
			value: 2,
			text: 'Level giảm dần',
		},
	];
	// PAGINATION
	const getPagination = (pageIndex: number) => {
		refValue.current = {
			...refValue.current,
			pageIndex,
		};
		setFilters({
			...filters,
			pageIndex,
		});
	};
	// SORT
	const onSort = (option) => {
		refValue.current = {
			...refValue.current,
			sort: option.title.sort,
			sortType: option.title.sortType,
		};
		setFilters({
			...listFieldInit,
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

	return (
		<>
			<div className="row package-set package-detail-list">
				<div className="col-12">
					<TitlePage title="Chi tiết gói bài" />
					<div className="wrap-table">
						<Card
							className="package-set-wrap"
							title={
								<div className="extra-table">
									<SortBox dataOption={sortOptionList} handleSort={onSort} />
								</div>
							}
							extra={
								<PackageDetailForm
									isLoading={isLoading}
									packageInfo={packageInfo}
									optionExamTopicList={optionExamTopicList}
									handleSubmit={onCreatePackageDetail}
								/>
							}
						>
							<List
								loading={isLoading?.type === 'GET_ALL' && isLoading?.status}
								pagination={{
									onChange: getPagination,
									total: totalPage,
									size: 'small',
								}}
								itemLayout="horizontal"
								dataSource={packageDetailList}
								renderItem={(item: ISetPackageDetail, idx) => {
									const {
										ID,
										SetPackageID,
										SetPackageLevel,
										SetPackageName,
										ExamTopicID,
										ExamTopicName,
										Type,
										TypeName,
										SubjectID,
										SubjectName,
										Time,
									} = item;
									return (
										<List.Item>
											<div className="wrap-set">
												<div className="tag-free">
													{
														<DeleteTableRow
															handleDelete={onDeletePackageDetail(idx)}
														/>
													}
												</div>
												<div className="wrap-set-content">
													<h6 className="set-title">
														<Link
															href={{
																// pathname:
																// 	'/package/package-list/package-list-detail/[slug]',
																pathname: '/package/package-list',
																// query: {slug: ID},
															}}
														>
															<a>{ExamTopicName}</a>
														</Link>
													</h6>
													<ul className="set-list mb-3">
														<li>
															Môn: <span>{SubjectName}</span>
														</li>
														<li>
															Thời gian: <span>{Time} phút</span>
														</li>
														<li>
															Hình thức: <span>{TypeName}</span>
														</li>
													</ul>

													<div className="set-btn">
														<Link
															href={{
																pathname: '/package/package-set/type/[slug]',
																query: {slug: 2},
															}}
														>
															<a className="btn btn-warning">Chi tiết đề thi</a>
														</Link>
													</div>
												</div>
											</div>
										</List.Item>
									);
								}}
							/>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};

export default PackageDetail;
