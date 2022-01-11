import { Card, Image, List } from 'antd';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { packageStudentApi } from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import TitlePage from '~/components/Elements/TitlePage';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';
import PackageStudentFilterForm from './PackageStudentFilterForm';

const PackageStudent = () => {
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [packageOfStudentList, setPackageOfStudentList] = useState<IPackageStudent[]>([]);
	const [totalPage, setTotalPage] = useState(null);
	const { showNoti, userInformation } = useWrap();
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,

		Type: null,
		StudentID: null,
		fromDate: '',
		toDate: ''
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false
	});
	const [filters, setFilters] = useState(listFieldInit);
	const typeOptionList = [
		{
			value: 1,
			title: 'Miễn phí'
		},
		{
			value: 2,
			title: 'Cao cấp'
		}
	];
	// SORT OPTION
	const sortOptionList = [
		{
			dataSort: {
				sort: 0,
				sortType: true
			},
			value: 1,
			text: 'Level tăng dần'
		},
		{
			dataSort: {
				sort: 0,
				sortType: false
			},
			value: 2,
			text: 'Level giảm dần'
		},
		{
			dataSort: {
				sort: 1,
				sortType: true
			},
			value: 3,
			text: 'Giá tăng dần'
		},
		{
			dataSort: {
				sort: 1,
				sortType: false
			},
			value: 4,
			text: 'Giá giảm dần'
		}
	];
	// FILTER
	const onFilter = (obj) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			...obj
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
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize
		});
	};
	// GET DATA IN FIRST TIME
	const fetchPackageOfStudent = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			if (!userInformation) return;
			const res = await packageStudentApi.getAll({
				...filters,
				StudentID: userInformation.UserInformationID
			});

			if (res.status === 200) {
				setPackageOfStudentList(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status === 204) {
				setPackageOfStudentList([]);
				setTotalPage(0);
				showNoti('danger', 'Dữ liệu trống');
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
		fetchPackageOfStudent();
	}, [filters, userInformation]);

	return (
		<>
			<div className="row package-set package-detail-list">
				<div className="col-12">
					<TitlePage title="Danh sách bộ đề học viên" />
					<div className="wrap-table">
						<Card
							className="package-set-wrap"
							title={
								<div className="extra-table">
									<PackageStudentFilterForm
										handleFilter={onFilter}
										handleResetFilter={onResetSearch}
										typeOptionList={typeOptionList}
									/>
									<SortBox dataOption={sortOptionList} handleSort={onSort} />
								</div>
							}
						>
							<List
								loading={isLoading?.type === 'GET_ALL' && isLoading?.status}
								pagination={{
									onChange: getPagination,
									total: totalPage,
									size: 'small',
									current: filters.pageIndex
								}}
								itemLayout="horizontal"
								dataSource={packageOfStudentList}
								renderItem={(item: IPackageStudent, idx) => {
									const {
										ID,
										SetPackageName,
										SetPackageID,
										SetPackageAvatar,
										Level,
										Type,
										TypeName,
										Price,
										Approval,
										ApprovalName
									} = item;
									return (
										<List.Item>
											<div className="wrap-set d-flex">
												{Type === 1 && <div className="tag-free">{TypeName}</div>}
												<div className="wrap-set-avatar">
													{(Approval === 1 || Approval === 2) && (
														<Image
															width="100%"
															height="100%"
															preview={false}
															src={SetPackageAvatar === '' ? '/images/default-book.jpeg' : SetPackageAvatar}
															title="Ảnh bìa bộ đề"
															alt="Ảnh bìa bộ đề"
															style={{ objectFit: 'cover' }}
														/>
													)}
													{Approval === 3 && (
														<Link
															href={{
																pathname: '/package/package-student/package-student-detail/[slug]',
																query: { slug: ID }
															}}
														>
															<a>
																<Image
																	width="100%"
																	height="100%"
																	preview={false}
																	src={
																		SetPackageAvatar === ''
																			? '/images/default-book.jpeg'
																			: SetPackageAvatar
																	}
																	title="Ảnh bìa bộ đề"
																	alt="Ảnh bìa bộ đề"
																	style={{ objectFit: 'cover' }}
																/>
															</a>
														</Link>
													)}
												</div>
												<div className="wrap-set-content">
													<h6 className="set-title">
														{(Approval === 1 || Approval === 2) && SetPackageName}
														{Approval === 3 && (
															<Link
																href={{
																	pathname: '/package/package-student/package-student-detail/[slug]',
																	query: { slug: ID }
																}}
															>
																<a>{SetPackageName}</a>
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
														{/* <li className="desc">
															Mô tả:<span>{Description}</span>
														</li> */}
													</ul>
													<div className="set-btn">
														{(Approval === 1 || Approval === 2) && (
															<button type="button" className="btn btn-secondary" disabled={true}>
																{ApprovalName}
															</button>
														)}
														{Approval === 3 && (
															<Link
																href={{
																	pathname: '/package/package-student/package-student-detail/[slug]',
																	query: { slug: SetPackageID }
																}}
															>
																<a className="btn btn-warning">Chi tiết bộ đề</a>
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
