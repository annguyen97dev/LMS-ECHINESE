import { Card, Image, List } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { packageApi, packageStudentApi } from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import TitlePage from '~/components/Elements/TitlePage';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';
import PackageStoreFilterForm from './PackageStoreFilterForm/PackageStoreFilterForm';
import PackageStoreForm from './PackageStoreForm/PackageStoreForm';

const PackageStore = () => {
	const router: any = useRouter();
	const { type } = router.query;
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [storePackageList, setStorePackageList] = useState<IPackage[]>([]);
	const [totalPage, setTotalPage] = useState(null);
	const { showNoti, userInformation } = useWrap();
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,

		TeacherID: null,
		Type: null,
		Level: router.query.filter == undefined ? null : parseInt(router.query.filter),
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
	const levelOptionList = [
		{
			value: 1,
			title: 'HSK 1'
		},
		{
			value: 2,
			title: 'HSK 2'
		},
		{
			value: 3,
			title: 'HSK 3'
		},
		{
			value: 4,
			title: 'HSK 4'
		},
		{
			value: 5,
			title: 'HSK 5'
		},
		{
			value: 6,
			title: 'HSK 6'
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
	const fetchPackageList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			const res = await packageApi.getAll(filters);

			if (res.status === 200) {
				setStorePackageList(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status === 204) {
				setStorePackageList([]);
				setTotalPage(0);
				showNoti('danger', 'Cửa hàng trống');
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
		fetchPackageList();
	}, [filters]);

	useEffect(() => {
		if (type) {
			setFilters({
				...listFieldInit,
				...refValue.current,
				pageIndex: 1,
				Type: type
			});
		}
	}, [type]);

	const onSubmit = async (data: { ID: number; Price: string; PaymentMethodsID: number; Note: string }) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			const { ID, Price, PaymentMethodsID, Note } = data;
			const newPackageStudent = {
				StudentID: userInformation.UserInformationID,
				SetPackageID: ID,
				Paid: Price === 'Miễn phí' ? 0 : parseInt(Price.toString().replace(/\D/g, '')),
				PaymentMethodsID,
				Note
			};
			const res = await packageStudentApi.add(newPackageStudent);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				if (storePackageList.length === 1) {
					filters.pageIndex === 1 && setStorePackageList([]);
					return;
				}
				fetchPackageList();
			}
			return res;
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};
	return (
		<div className="row package-set package-detail-list">
			<div className="col-12">
				<TitlePage title="Cửa hàng" />
				<div className="wrap-table">
					<Card
						className="package-set-wrap"
						title={
							<div className="extra-table">
								<PackageStoreFilterForm
									handleFilter={onFilter}
									handleResetFilter={onResetSearch}
									optionListForFilter={{
										levelOptionList: levelOptionList,
										typeOptionList: typeOptionList
									}}
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
							dataSource={storePackageList}
							renderItem={(item: IPackage, idx) => {
								const { ID, Name, Avatar, Level, Type, TypeName, Price, Description } = item;
								return (
									<List.Item>
										<div className="wrap-set d-flex">
											{Type === 1 && <div className="tag-free">{TypeName}</div>}
											{console.log('avatar', item)}
											<div className="wrap-set-avatar">
												<Image
													width="100%"
													height="100%"
													src={Avatar}
													title="Ảnh bìa bộ đề"
													alt="Ảnh bìa bộ đề"
													style={{ objectFit: 'cover' }}
												/>
											</div>
											<div className="wrap-set-content">
												<h6 className="set-title">{Name}</h6>
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
													{userInformation?.RoleID !== 1 &&
														userInformation?.RoleID !== 5 &&
														(Type === 1 ? (
															<PackageStoreForm
																isAddPackageFree={true}
																isLoading={isLoading}
																packageItem={item}
																handleSubmit={onSubmit}
															/>
														) : (
															<PackageStoreForm
																isLoading={isLoading}
																packageItem={item}
																handleSubmit={onSubmit}
															/>
														))}
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
	);
};

export default PackageStore;
