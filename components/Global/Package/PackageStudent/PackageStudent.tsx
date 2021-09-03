import {Card, Image, List} from 'antd';
import Link from 'next/link';
import React, {useEffect, useRef, useState} from 'react';
import {packageApi, packageStudentApi} from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import TitlePage from '~/components/Elements/TitlePage';
import {useWrap} from '~/context/wrap';
import {numberWithCommas} from '~/utils/functions';
import PackageStudentFilterForm from './PackageStudentFilterForm';

const PackageStudent = () => {
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [packageOfStudentList, setPackageOfStudentList] = useState<IPackage[]>(
		[]
	);
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti, userInformation} = useWrap();
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 999,
		sort: -1,
		sortType: false,

		TeacherID: null,
		Type: null,
		Level: null,
		formDate: '',
		toDate: '',
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 999,
		sort: -1,
		sortType: false,
	});
	const [filters, setFilters] = useState(listFieldInit);
	const typeOptionList = [
		{
			value: 1,
			title: 'Miễn phí',
		},
		{
			value: 2,
			title: 'Cao cấp',
		},
	];
	const levelOptionList = [
		{
			value: 1,
			title: 'HSK 1',
		},
		{
			value: 2,
			title: 'HSK 2',
		},
		{
			value: 3,
			title: 'HSK 3',
		},
		{
			value: 4,
			title: 'HSK 4',
		},
		{
			value: 5,
			title: 'HSK 5',
		},
		{
			value: 6,
			title: 'HSK 6',
		},
	];
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
		{
			dataSort: {
				sort: 1,
				sortType: true,
			},
			value: 3,
			text: 'Giá tăng dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: false,
			},
			value: 4,
			text: 'Giá giảm dần',
		},
	];
	// FILTER
	const onFilter = (obj) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			...obj,
		});
	};
	// // PAGINATION
	// const getPagination = (pageIndex: number) => {
	// 	refValue.current = {
	// 		...refValue.current,
	// 		pageIndex,
	// 	};
	// 	setFilters({
	// 		...filters,
	// 		pageIndex,
	// 	});
	// };
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
	const fetchPackageOfStudent = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			if (!userInformation) return;
			const StudentID = userInformation.UserInformationID;

			const res = await Promise.all([
				packageApi.getAll(filters),
				packageStudentApi.getAll({StudentID}),
			]);

			const packageList: IPackage[] = res[0].data.data;
			const billList: IPackageStudent[] = res[1].data.data;

			if (res[0].status === 200 && res[1].status === 200) {
				// ONLY SHOW PACKAGE STUDENT BOUGHT
				const getOnlyPackageBought = packageList.filter(
					(p) => p.Enable && billList.some((b) => b.SetPackageID === p.ID)
				);
				const newPackageListWithApproval = getOnlyPackageBought.map((p) => {
					return {
						...p,
						Approval: billList.find((b) => b.SetPackageID === p.ID).Approval,
						ApprovalName: billList.find((b) => b.SetPackageID === p.ID)
							.ApprovalName,
					};
				});

				if (newPackageListWithApproval.length) {
					setPackageOfStudentList(newPackageListWithApproval);
					setTotalPage(newPackageListWithApproval.length);
				} else {
					showNoti('danger', 'Không tìm thấy');
				}
			} else {
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
		fetchPackageOfStudent();
	}, [filters, userInformation]);

	return (
		<>
			<div className="row package-set package-detail-list">
				<div className="col-12">
					<TitlePage title="Danh sách gói bài học viên" />
					<div className="wrap-table">
						<Card
							className="package-set-wrap"
							title={
								<div className="extra-table">
									<PackageStudentFilterForm
										handleFilter={onFilter}
										handleResetFilter={onResetSearch}
										optionListForFilter={{
											levelOptionList: levelOptionList,
											typeOptionList: typeOptionList,
										}}
									/>
									<SortBox dataOption={sortOptionList} handleSort={onSort} />
								</div>
							}
						>
							<List
								loading={isLoading?.type === 'GET_ALL' && isLoading?.status}
								pagination={{
									// onChange: getPagination,
									total: totalPage,
									size: 'small',
								}}
								itemLayout="horizontal"
								dataSource={packageOfStudentList}
								renderItem={(item: IPackage, idx) => {
									const {
										ID,
										Name,
										Avatar,
										Level,
										Type,
										TypeName,
										Price,
										Description,
										Approval,
										ApprovalName,
									} = item;
									return (
										<List.Item>
											<div className="wrap-set d-flex">
												{Type === 1 && (
													<div className="tag-free">{TypeName}</div>
												)}
												<div className="wrap-set-avatar">
													{(Approval === 1 || Approval === 2) && (
														<Image
															width="100%"
															height="100%"
															preview={false}
															src={Avatar}
															title="Ảnh bìa gói bài tập"
															alt="Ảnh bìa gói bài tập"
														/>
													)}
													{Approval === 3 && (
														<Link
															href={{
																pathname:
																	'/package/package-student/package-student-detail/[slug]',
																query: {slug: ID},
															}}
														>
															<a>
																<Image
																	width="100%"
																	height="100%"
																	preview={false}
																	src={Avatar}
																	title="Ảnh bìa gói bài tập"
																	alt="Ảnh bìa gói bài tập"
																/>
															</a>
														</Link>
													)}
												</div>
												<div className="wrap-set-content">
													<h6 className="set-title">
														{(Approval === 1 || Approval === 2) && Name}
														{Approval === 3 && (
															<Link
																href={{
																	pathname:
																		'/package/package-student/package-student-detail/[slug]',
																	query: {slug: ID},
																}}
															>
																<a>{Name}</a>
															</Link>
														)}
													</h6>
													<ul className="set-list">
														<li>
															Level:<span>HSK {Level}</span>
														</li>
														<li className="price">
															Giá:<span>{numberWithCommas(Price)} VNĐ</span>
														</li>
														<li className="desc">
															Mô tả:<span>{Description}</span>
														</li>
													</ul>
													<div className="set-btn">
														{(Approval === 1 || Approval === 2) && (
															<button
																type="button"
																className="btn btn-secondary"
																disabled={true}
															>
																{ApprovalName}
															</button>
														)}
														{Approval === 3 && (
															<Link
																href={{
																	pathname:
																		'/package/package-student/package-student-detail/[slug]',
																	query: {slug: ID},
																}}
															>
																<a className="btn btn-warning">
																	Chi tiết gói bài
																</a>
															</Link>
														)}
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

export default PackageStudent;
