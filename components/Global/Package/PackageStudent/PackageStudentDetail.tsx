import {Card, List} from 'antd';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useEffect, useRef, useState} from 'react';
import {packageDetailApi} from '~/apiBase/package/package-detail';
import TitlePage from '~/components/Elements/TitlePage';
import {useWrap} from '~/context/wrap';

const PackageStudentDetail = () => {
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

	useEffect(() => {
		fetchPackageDetailList();
	}, [filters]);

	return (
		<>
			<div className="row package-set package-detail-list">
				<div className="col-12">
					<TitlePage title="Chi tiết bộ đề" />
					<div className="wrap-table">
						<Card className="package-set-wrap">
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
											<div className="wrap-set" style={{paddingRight: 12}}>
												<div className="wrap-set-content">
													<h6 className="set-title">
														<Link
															href={{
																pathname: '/exam/exam-review/[slug]',
																query: {slug: ExamTopicID},
															}}
														>
															<a>{ExamTopicName}</a>
														</Link>
													</h6>
													<ul className="set-list">
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
																pathname: '/exam/exam-review/[slug]',
																query: {slug: ExamTopicID},
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

export default PackageStudentDetail;
