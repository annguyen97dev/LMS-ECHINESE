import { Card, Input, List, Modal, notification } from 'antd';
import 'antd/dist/antd.css';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { VideoCourseListApi } from '~/apiBase';
import { teacherApi } from '~/apiBase';
import { VideoCourseCardApi, VideoCourseStoreApi } from '~/apiBase/video-course-store';
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category';
import { VideoCourseCurriculumApi } from '~/apiBase/video-course-store/get-list-curriculum';
import { VideoCourseLevelApi } from '~/apiBase/video-course-store/level';
import FilterVideoCourses from '~/components/Global/Option/FilterTable/FilterVideoCourses';
import LayoutBase from '~/components/LayoutBase';
import RenderItemCard from '~/components/VideoCourse/RenderItemCourseStudent';
import { useWrap } from '~/context/wrap';
import ModalCreateVideoCourse from '~/lib/video-course/modal-create-video-course';

const key = 'updatable';
const { Search } = Input;

let pageIndex = 1;

const VideoCourseStore = () => {
	const router = useRouter();
	const { userInformation, pageSize, showNoti, handleReloadNoti, getTitlePage } = useWrap();
	const [data, setData] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [rerender, setRender] = useState('');
	const [isLoading, setIsLoading] = useState({ type: 'GET_ALL', status: true });
	const [addToCardLoading, setAddToCardLoading] = useState(false);
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
	const [dataTeacher, setDataTeacher] = useState([]);
	const [category, setCategory] = useState([]);
	const [categoryLevel, setCategoryLevel] = useState([]);
	const [buyNowLoading, setByNowLoading] = useState(false);

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
		getTitlePage('Khóa học video');
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
                getTeacherOption();
                
				setRender(res + '');
				setIsLoading({ type: 'GET_ALL', status: false });
			} else {
				// HOC VIEN
				const res = await VideoCourseStoreApi.getAllForStudent({ ...todoApi, pageSize: 9 });
                console.log('video course for student', res.data.data)
				res.status == 200 && (setData(res.data.data), setTotalPage(res.data.totalRow));
				setRender(res + '');
				setIsLoading({ type: 'GET_ALL', status: false });
			}
		} catch (err) {}
	};
    // GET TEACHER LEVEL
    const getTeacherOption = async () => {
        const temp = {
			pageIndex: 1,
			pageSize: 20,
			search: null
		};
		try {
			const res = await teacherApi.getAll(temp);
            console.log('teacher api', res.data.data)
			res.status == 200 && setDataTeacher(res.data.data);
			setRender(res + '');
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
            console.log('category:', res.data.data)
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
            console.log('category level', res.data.data)
			res.status == 200 && setCategoryLevel(res.data.data);
			setRender(res + '');
		} catch (err) {}
	};

	// ADD COURSE VIDEO TO CART
	const postAddToCard = async (data, type) => {
		try {
			const res = await VideoCourseCardApi.add(data);
			if (type == 1) {
				res.status == 200 && setShowModal(true);
				res.status !== 200 && openNotification();
				handleReloadNoti();
			} else {
				router.push('/cart/check-out');
			}
		} catch (error) {
		} finally {
			if (type == 1) {
				setAddToCardLoading(false);
				setByNowLoading(false);
			}
		}
	};

	// HANDLE AD TO CARD (STUDENT)
	const addToCard = (p, type) => {
		type == 1 ? setAddToCardLoading(true) : setByNowLoading(true);

		let temp = {
			VideoCourseID: p.ID,
			Quantity: 1
		};
		postAddToCard(temp, type);
	};

	// CREATE NEW COURSE
	const createNewCourse = async (param) => {
		setIsLoading({ type: 'GET_ALL', status: true });
		let temp = {
			CategoryID: param.CategoryID,
			LevelID: param.LevelID,
			CurriculumID: param.CurriculumID,
			VideoCourseName: param.VideoCourseName,
			ImageThumbnails: param.ImageThumbnails,
			OriginalPrice: param.OriginalPrice,
			SellPrice: param.SellPrice,
			TagArray: param.TagArray,
			Slogan: param.Slogan,
			Requirements: param.Requirements,
			Description: param.Description,
			ResultsAchieved: param.ResultsAchieved,
			CourseForObject: param.CourseForObject,
            TeacherID: param.TeacherID,
		};

		try {
			const res = await VideoCourseStoreApi.add(temp);
			res.status == 200 && showNoti('success', 'Thêm thành công');
			res.status !== 200 && showNoti('danger', 'Thêm không thành công');
			getAllArea();
		} catch (error) {
			showNoti('danger', 'Thêm không thành công');
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	// UPDATE COURSE
	const updateCourse = async (param) => {
		setIsLoading({ type: 'GET_ALL', status: true });
		let temp = {
			ID: param.ID,
			CategoryID: null,
			LevelID: null,
			VideoCourseName: param.VideoCourseName,
			ImageThumbnails: param.ImageThumbnails == '' ? null : param.ImageThumbnails,
			OriginalPrice: param.OriginalPrice,
			SellPrice: param.SellPrice,
			TagArray: null,
            TeacherID: param.TeacherID,
            Slogan: param.Slogan,
            Requirements: param.Requirements,
            Description: param.Description,
            ResultsAchieved: param.ResultsAchieved,
            CourseForObject: param.CourseForObject,
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
		setTodoApi(newTodoApi);
	};

	// RESET FILTER
	const handleReset = () => {
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
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
		setTodoApi(newTodoApi);
	};

	// HANDLE CHANGE PAGE
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setTodoApi({
			...todoApi,
			pageIndex: pageIndex
		});
	};

	const [activeLoading, setActiveLoading] = useState(false);

	// UPDATE COURSE
	const handleActive = async (param) => {
		setActiveLoading(true);
        
		try {
			const res = await VideoCourseListApi.updateActiveCode(param);
			res.status == 200 && showNoti('success', 'Thành công');
			res.status === 204 && showNoti('danger', 'Thành công');
			getAllArea();
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setActiveLoading(false);
		}
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
			{userInformation !== null && (
				<Card
					style={{ width: '100%' }}
					loading={isLoading.status}
					className="video-course-list"
					title={<div className="m-2">{Extra()}</div>}
					extra={
						userInformation.RoleID !== 1 ? null : (
							<div className="vc-teach-modal_header">
								<ModalCreateVideoCourse
									dataLevel={categoryLevel}
                                    dataTeacher={dataTeacher}
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
					<>
						<List
							itemLayout="horizontal"
							dataSource={data}
							grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
							renderItem={(item) => (
								<RenderItemCard
									_onSubmitEdit={(data: any) => updateCourse(data)}
									loading={addToCardLoading}
									buyNowLoading={buyNowLoading}
									activeLoading={activeLoading}
									addToCard={addToCard}
									item={item}
                                    dataTeacher={dataTeacher}
									handleActive={handleActive}
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
							title="Thêm vào giỏ hàng"
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
								<a href="/cart/shopping-cart">
									<button type="button" className="btn btn-primary">
										Đến giỏ hàng
									</button>
								</a>
							</div>
						</Modal>
					</>
				</Card>
			)}
		</div>
	);
};

VideoCourseStore.layout = LayoutBase;
export default VideoCourseStore;
