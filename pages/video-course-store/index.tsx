import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { List, Card, Modal, notification, Tooltip, Input } from 'antd';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';
import { VideoCourseCardApi, VideoCourseStoreApi } from '~/apiBase/video-course-store';
import { parseToMoney } from '~/utils/functions';
import RenderItemCard from '~/components/VideoCourse/RenderItemCourseStudent';
import ModalCreateVideoCourse from '~/lib/video-course/modal-create-video-course';
import { VideoCourseLevelApi } from '~/apiBase/video-course-store/level';
import FilterVideoCourses from '~/components/Global/Option/FilterTable/FilterVideoCourses';
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category';
import { Eye } from 'react-feather';
import { VideoCourseCurriculumApi } from '~/apiBase/video-course-store/get-list-curriculum';
import CourseVideoTable from '~/components/CourseVideoTable';

const key = 'updatable';
const { Search } = Input;

let pageIndex = 1;

const VideoCourseStore = () => {
	const { userInformation, pageSize, showNoti } = useWrap();
	const [data, setData] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [rerender, setRender] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState({ type: 'GET_ALL', status: true });
	const [totalPage, setTotalPage] = useState(null);
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		search: null,
		categoryId: null,
		levelId: null,
		fromDate: null,
		toDate: null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);
	const [dataCurriculum, setDataCurriculum] = useState([]);
	const [category, setCategory] = useState([]);
	const [categoryLevel, setCategoryLevel] = useState([]);

	const openNotification = () => {
		notification.open({
			key,
			message: 'Không thành công',
			description: 'Vui lòng kiểm tra lại!'
		});
		setTimeout(() => {
			notification.open({
				key,
				message: 'Không thành công',
				description: 'Vui lòng kiểm tra lại!'
			});
		}, 1000);
	};

	// FIRST GET DATA
	useEffect(() => {
		if (userInformation !== null) {
			// ADMIN & HOC VIEN
			getAllArea();
		}
	}, [userInformation]);

	//GET DATA
	const getAllArea = async () => {
		// ADMIN & HOC VIEN
		setIsLoading({ type: 'GET_ALL', status: true });
		getCategory();
		try {
			if (userInformation.RoleID == 1) {
				// ADMIN
				const res = await VideoCourseStoreApi.getAll(todoApi);
				res.status == 200 && (setData(res.data.data), setTotalPage(res.data.totalRow));
				getCurriculum();
				setRender(res + '');
				setIsLoading({ type: 'GET_ALL', status: false });
			} else {
				// HOC VIEN
				const res = await VideoCourseStoreApi.getAllForStudent({ ...todoApi, pageSize: 9 });
				res.status == 200 && (setData(res.data.data), setTotalPage(res.data.totalRow));
				setRender(res + '');
				setIsLoading({ type: 'GET_ALL', status: false });
			}
		} catch (err) {}
	};

	//GET DATA CURRICULUM LEVEL
	const getCurriculum = async () => {
		try {
			const res = await VideoCourseCurriculumApi.getCurriculum();
			res.status == 200 && setDataCurriculum(res.data.data);
			setRender(res + '');
		} catch (err) {}
	};

	//GET DATA CATEGORY LEVEL
	const getCategory = async () => {
		const temp = {
			pageIndex: 1,
			pageSize: 20,
			search: null
		};
		try {
			const res = await VideoCourseCategoryApi.getAll(temp);
			res.status == 200 && setCategory(res.data.data);
			setRender(res + '');
			getCategoryLevel();
		} catch (err) {}
	};

	//GET DATA CATEGORY LEVEL
	const getCategoryLevel = async () => {
		const temp = {
			pageIndex: 1,
			pageSize: 20,
			search: null
		};
		try {
			const res = await VideoCourseLevelApi.getAll(temp);
			res.status == 200 && setCategoryLevel(res.data.data);
			setRender(res + '');
		} catch (err) {}
	};

	// ADD COURSE VIDEO TO CART
	const postAddToCard = async (data) => {
		try {
			const res = await VideoCourseCardApi.add(data);
			res.status == 200 && setShowModal(true);
			res.status !== 200 && openNotification();
		} catch (error) {}
	};

	// HANDLE AD TO CARD (STUDENT)
	const addToCard = (p) => {
		let temp = {
			VideoCourseID: p.ID,
			Quantity: 1
		};
		postAddToCard(temp);
	};

	// CREATE NEW COURSE
	const createNewCourse = async (param) => {
		setIsLoading({ type: 'GET_ALL', status: true });
		let temp = {
			CategoryID: param.CategoryID,
			LevelID: param.LevelID,
			CurriculumID: param.CurriculumID,
			VideoCourseName: param.VideoCourseName,
			OriginalPrice: param.OriginalPrice,
			SellPrice: param.SellPrice,
			TagArray: param.TagArray
		};
		try {
			const res = await VideoCourseStoreApi.add(temp);
			res.status == 200 && showNoti('success', 'Thêm thành công');
			res.status !== 200 && showNoti('danger', 'Thêm không thành công');
			getAllArea();
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	// UPDATE COURSE
	const updateCourse = async (param) => {
		setIsLoading({ type: 'GET_ALL', status: false });
		let temp = {
			ID: param.ID,
			CategoryID: null,
			LevelID: null,
			VideoCourseName: param.VideoCourseName,
			ImageThumbnails: param.ImageThumbnails == '' ? null : param.ImageThumbnails,
			OriginalPrice: param.OriginalPrice,
			SellPrice: param.SellPrice
		};
		try {
			const res = await VideoCourseStoreApi.update(temp);
			res.status == 200 && showNoti('success', 'Thành công');
			res.status !== 200 && showNoti('danger', 'Thêm không thành công');
			getAllArea();
		} catch (error) {}
	};

	useEffect(() => {
		getAllArea();
	}, [todoApi]);

	// HANDLE SEARCH
	const handleSearch = (e) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			search: e
		};
		setCurrentPage(1), setTodoApi(newTodoApi);
	};

	// RESET FILTER
	const handleReset = () => {
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	// FILTER
	const handleFilter = (paramFilter: any) => {
		let newTodoApi = {
			...listTodoApi,
			categoryId: paramFilter.Type,
			levelId: paramFilter.Level,
			fromDate: paramFilter.fromDate,
			toDate: paramFilter.toDate
		};
		setCurrentPage(1), setTodoApi(newTodoApi);
	};

	// HANDLE CHANGE PAGE
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: pageIndex
		});
	};

	const columnsVideoCourse = [
		{
			title: 'Tên khóa học',
			dataIndex: 'VideoCourseName',
			key: 'VideoCourseName'
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			key: 'CreatedOn'
		},
		{
			title: 'Loại',
			dataIndex: 'CategoryName',
			key: 'CategoryName',
			align: 'center'
		},
		{
			title: 'Cấp độ',
			dataIndex: 'LevelName',
			key: 'LevelName',
			align: 'center'
		},
		{
			title: 'video',
			dataIndex: 'TotalVideoCourseSold',
			key: 'TotalVideoCourseSold',
			align: 'center'
		},
		{
			title: 'Giá gốc',
			dataIndex: 'OriginalPrice',
			key: 'OriginalPrice',
			render: (value) => <span className="vc-store_table_custom_value">{parseToMoney(value)}</span>
		},
		{
			title: 'Giá bán',
			dataIndex: 'SellPrice',
			key: 'SellPrice',
			render: (value) => <span className="vc-store_table_custom_value">{parseToMoney(value)}</span>
		},
		{
			title: 'Doanh thu',
			dataIndex: 'RevenueEachVideoCourse',
			key: 'RevenueEachVideoCourse',
			render: (value) => <span className="vc-store_table_custom_value">{parseToMoney(value)}</span>
		},
		{
			title: 'Thao tác',
			dataIndex: 'Action',
			key: 'action',
			render: (Action, data, index) => (
				<div className="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					{/* <Link
						href={{
							// pathname: '/option/program/program-detail/[slug]',
							query: { slug: data.ID }
						}}
					>
						<Tooltip title="Chi tiết chương trình">
							<button className="btn btn-icon" style={{ marginRight: -10, marginLeft: -10 }}>
								<Eye />
							</button>
						</Tooltip>
					</Link> */}

					<div>
						<ModalCreateVideoCourse
							dataLevel={categoryLevel}
							dataCategory={category}
							getIndex={() => {}}
							_onSubmitEdit={(data: any) => updateCourse(data)}
							programID={data.ID}
							rowData={data}
							dataGrade={data}
							showAdd={true}
							isLoading={isLoading}
						/>
					</div>
				</div>
			)
		}
	];

	const expandedRowRender = () => {
		return (
			<>
				<div className="feedback-detail-text" style={{ backgroundColor: 'red' }}>
					asd asd asdqw tw qgasgdas dnb{' '}
				</div>
			</>
		);
	};

	// CARD EXTRA
	const Extra = () => {
		return (
			<div className="row m-0 vc-store_extra-table">
				<div className="row m-0">
					<div className="row m-0 st-fb-100w ">
						<div>
							<FilterVideoCourses
								handleReset={handleReset}
								dataLevel={categoryLevel}
								dataCategory={category}
								handleFilter={(value: any) => handleFilter(value)}
							/>
						</div>
						<Search
							className="fb-btn-search style-input vc-teach-modal_search"
							size="large"
							placeholder="input search text"
							onSearch={(e) => {
								handleSearch(e);
							}}
						/>
					</div>
				</div>
			</div>
		);
	};

	// RENDER
	return (
		<div className="">
			<p className="video-course-list-title">Khóa Học Video</p>
			{userInformation !== null && (
				<Card
					loading={isLoading.status}
					className="video-course-list"
					title={<div className="m-2">{Extra()}</div>}
					extra={
						userInformation.RoleID !== 1 ? null : (
							<div className="vc-teach-modal_header">
								<ModalCreateVideoCourse
									dataLevel={categoryLevel}
									dataCategory={category}
									dataCurriculum={dataCurriculum}
									_onSubmit={(data: any) => createNewCourse(data)}
									showAdd={false}
									isLoading={false}
									refeshData={() => getAllArea()}
								/>
							</div>
						)
					}
				>
					{/* {userInformation.RoleID == 3 && ( */}
					<>
						<List
							itemLayout="horizontal"
							dataSource={data}
							grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 5 }}
							renderItem={(item) => (
								<RenderItemCard
									_onSubmitEdit={(data: any) => updateCourse(data)}
									category={category}
									categoryLevel={categoryLevel}
									addToCard={addToCard}
									item={item}
									rowData={data}
									dataGrade={data}
								/>
							)}
							pagination={{
								onChange: getPagination,
								total: totalPage,
								size: 'small',
								current: pageIndex
							}}
						/>

						<Modal
							title="Têm vào giỏ hàng"
							visible={showModal}
							confirmLoading={false}
							className="vc-store_modal"
							footer={null}
							onCancel={() => setShowModal(false)}
							width={500}
						>
							<div className="m-0 row vc-store-center vc-store-space-beetween">
								<div className="m-0 row vc-store-center">
									<i className="fas fa-check-circle vc-store_modal_icon"></i>
									<span className="vc-store_modal_title">Thêm thành công</span>
								</div>
								<a href="/video-course-card">
									<button type="button" className="btn btn-primary">
										Đến giỏ hàng
									</button>
								</a>
							</div>
						</Modal>
					</>
					{/* )} */}

					{/* Table */}
					{/* {userInformation.RoleID == 1 && (
						<CourseVideoTable
							totalPage={totalPage && totalPage}
							getPagination={(pageNumber: number) => getPagination(pageNumber)}
							currentPage={currentPage}
							columns={columnsVideoCourse}
							dataSource={data}
							loading={isLoading}
							TitleCard={
								<div className="vc-teach-modal_header">
									<ModalCreateVideoCourse
										dataLevel={categoryLevel}
										dataCategory={category}
										dataCurriculum={dataCurriculum}
										_onSubmit={(data: any) => createNewCourse(data)}
										showAdd={false}
										isLoading={false}
										refeshData={() => getAllArea()}
									/>
								</div>
							}
							Extra={Extra()}
							expandable={() => expandedRowRender}
						></CourseVideoTable>
					)} */}
				</Card>
			)}
		</div>
	);
};

VideoCourseStore.layout = LayoutBase;
export default VideoCourseStore;
