import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import Link from 'next/link';
import { parseToMoney } from '~/utils/functions';
import { Spin, Input } from 'antd';
import { useWrap } from '~/context/wrap';
import ModalUpdateDetail from '~/lib/video-course/modal-update-details';
import ModalUpdateInfo from '~/lib/video-course/modal-update-info';
import RatingStar from '~/components/RatingStar';
import ModalCreateVideoCourse from '~/lib/video-course/modal-create-video-course';
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category';
import { VideoCourseLevelApi } from '~/apiBase/video-course-store/level';
import { VideoCourseCurriculumApi } from '~/apiBase/video-course-store/get-list-curriculum';

// CARD ITEM ON VIDEO COURSE
const RenderItemCard = (props) => {
	const { item, addToCard, _onSubmitEdit, loading, activeLoading, handleActive, buyNowLoading, dataTeacher, refeshData } = props;
	const { userInformation } = useWrap();

	const [showModalUpdate, setShowModalUpdate] = useState(false);
	const [showModalEdit, setShowModalEdit] = useState(false);
	const [activing, setActiving] = useState(false);
	const [code, setCode] = useState('');
	const [dataCategory, setDataCategory] = useState([]);
	const [categoryLevel, setCategoryLevel] = useState([]);
	const [dataCurriculum, setDataCurriculum] = useState([]);
	const [rerender, setRender] = useState('');

	const params = {
		Category: item.CategoryName,
		Level: item.LevelName,
		Create: item.CreatedOn,
		Thum: item.ImageThumbnails,
		AverageRating: item.AverageRating,
		TotalFeedBack: item.TotalFeedBack,
		slug: item.ID,
		Original: item.OriginalPrice,
		Sell: item.SellPrice,
		Active: item.StatusActive,
		TotalVideo: item.TotalVideoCourseSold
	};

	//GET DATA CURRICULUM LEVEL
	const getCurriculum = async () => {
		try {
			const res = await VideoCourseCurriculumApi.getCurriculum();
			res.status == 200 && setDataCurriculum(res.data.data);
			setRender(res + '');
		} catch (err) {}
	};

	const getCategory = async () => {
		const temp = {
			pageIndex: 1,
			pageSize: 20,
			search: null
		};
		try {
			const res = await VideoCourseCategoryApi.getAll(temp);
			res.status == 200 && setDataCategory(res.data.data);
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

	useEffect(() => {
		getCategory();
		getCurriculum();
		getCategoryLevel()
	}, []);

	return (
		<>
			<div className="vc-store_container">
				<div className="vc-store_item" style={{ height: userInformation.RoleID == 1 || userInformation.RoleID == 2 ? 260 : 300 }}>
					<div className="flip-card-front">
						<div className="warp-image">
							<Link
								href={{
									pathname: '/video-course/[slug]',
									query: params
								}}
							>
								{item.ImageThumbnails === '' || item.ImageThumbnails === null || item.ImageThumbnails === undefined ? (
									<img src="/images/logo-thumnail.jpg" />
								) : (
									<img src={item.ImageThumbnails} />
								)}
							</Link>
						</div>

						<div className="content">
							<h3 style={{ width: '90%' }} className="title ml-3 mr-3 in-1-line">
								{item.VideoCourseName}
							</h3>
							<span style={{ width: '90%' }} className="ml-3 mr-3 in-1-line">
								<i className="fas fa-play-circle mr-1"></i> {item.TotalVideoCourseSold} đã bán
							</span>

							<Link
								href={{
									pathname: '/video-course/[slug]',
									query: params
								}}
							>
								<div className="ml-3">
									<RatingStar AverageRating={item.AverageRating} TotalFeedBack={item.TotalFeedBack} />
								</div>
							</Link>

							<Link
								href={{
									pathname: '/video-course/[slug]',
									query: params
								}}
							>
								<div className="ml-3 price-group">
									<i
										className="price price-old"
										style={{
											textDecorationLine: 'line-through'
										}}
									>
										{parseToMoney(item.OriginalPrice)}đ
									</i>
									<span className="price">{parseToMoney(item.SellPrice)}đ</span>
								</div>
							</Link>
						</div>
					</div>

					<div className="flip-card-back p-3" style={{}}>
						<Link
							href={{
								pathname: '/video-course/[slug]',
								query: params
							}}
						>
							<div
								className="rotate180"
								style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%' }}
							>
								<div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
									<h3 className="title mb-3">{item.VideoCourseName}</h3>
									<span className="in-1-line mb-1 ">
										<i className="fas fa-check"></i> {item.TeacherName}
									</span>
									<span className="in-1-line mb-1 ">
										<i className="fas fa-check"></i> {item.CategoryName}
									</span>
									<span className="in-1-line mb-1 ">
										<i className="fas fa-check"></i> {item.LevelName}
									</span>
									<span className="mb-1 in-1-line">
										<i className="fas fa-check"></i> {item.CreatedOn}
									</span>
									<div style={{ flex: 1 }} />
									{/* button action */}
									{userInformation.RoleID == 1 || userInformation.RoleID == 2 ? (
										<div style={{ zIndex: 99999 }}>
											<button
												type="button"
												className=" btn btn-warning"
												style={{ width: '100%' }}
												onClick={(e) => {
													e.stopPropagation();
													setShowModalUpdate(true);
												}}
											>
												Chỉnh sửa
											</button>
										</div>
									) : (
										<>
											{activing ? (
												<>
													<Input
														onClick={(e) => e.stopPropagation()}
														value={code}
														onChange={(e) => setCode(e.target.value)}
														placeholder="Mã kích hoạt"
														style={{ height: 36, borderRadius: 6 }}
													/>
													<button
														onClick={(e) => {
															e.stopPropagation();
															handleActive({ ID: item.ID, ActiveCode: code });
														}}
														className="btn btn-warning btn-add mt-2"
													>
														Kích hoạt {activeLoading && <Spin className="loading-base" />}
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation();
															setActiving(false);
														}}
														className="btn btn-primary btn-add mt-2"
													>
														Huỷ
													</button>
												</>
											) : (
												<>
													<button
														onClick={(e) => {
															e.stopPropagation();
															addToCard(item, 1);
														}}
														className="btn btn-primary btn-add"
													>
														Thêm vào giỏ {loading && <Spin className="loading-base" />}
													</button>
													{item.StatusActive == 'activated' ? (
														<Link
															href={{
																pathname: '/video-learning',
																query: {
																	ID: item.ID,
																	course: item.ID,
																	complete: 0 + '/' + 0,
																	name: item.VideoCourseName
																}
															}}
														>
															<button className="btn btn-dark btn-add mt-2">Xem khóa học</button>
														</Link>
													) : (
														<button
															onClick={(e) => {
																e.stopPropagation();
																setActiving(true);
															}}
															className="btn btn-warning btn-add mt-2"
														>
															Kích hoạt
														</button>
													)}
													<button
														onClick={(e) => {
															e.stopPropagation();
															addToCard(item, 0);
														}}
														className="btn btn-light btn-add mt-2"
													>
														Mua ngay {buyNowLoading && <Spin className="loading-base" />}
													</button>
												</>
											)}
										</>
									)}
								</div>
							</div>
						</Link>
					</div>
				</div>
			</div>
			<ModalUpdateInfo
				dataTeacher={dataTeacher}
				_onSubmitEdit={(data: any) => _onSubmitEdit(data)}
				programID={item.ID}
				rowData={item}
				isModalVisible={showModalUpdate}
				setIsModalVisible={setShowModalUpdate}
				refeshData={() => refeshData()}
				dataCategory={dataCategory}
				dataLevel={categoryLevel}
				dataCurriculum={dataCurriculum}
			/>
			<ModalUpdateDetail programID={item.ID} isModalVisible={showModalEdit} setIsModalVisible={setShowModalEdit} />
		</>
	);
};

export default RenderItemCard;
