import React, { useState } from 'react';
import 'antd/dist/antd.css';
import Link from 'next/link';
import { parseToMoney } from '~/utils/functions';
import { Spin, Input } from 'antd';
import { useWrap } from '~/context/wrap';
import ModalUpdateDetail from '~/lib/video-course/modal-update-details';
import ModalUpdateInfo from '~/lib/video-course/modal-update-info';

// CARD ITEM ON VIDEO COURSE
const RenderItemCard = ({ item, addToCard, _onSubmitEdit, loading, activeLoading, handleActive, buyNowLoading }) => {
	const { userInformation } = useWrap();

	const [showModalUpdate, setShowModalUpdate] = useState(false);
	const [showModalEdit, setShowModalEdit] = useState(false);
	const [activing, setActiving] = useState(false);
	const [code, setCode] = useState('');

	const params = {
		Category: item.CategoryName,
		Level: item.LevelName,
		Create: item.CreatedOn,
		Thum: item.ImageThumbnails,
		slug: item.ID,
		Original: item.OriginalPrice,
		Sell: item.SellPrice,
		Active: item.StatusActive,
		TotalVideo: item.TotalVideoCourseSold
	};

	const PopoverItem = (
		<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', maxWidth: 260 }}>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<p style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>{item.VideoCourseName}</p>
				<span className="vc-store_item_price-old in-1-line">Số video: {item.TotalVideoCourseSold}</span>
				<span className="vc-store_item_price-old in-1-line">Loại: {item.CategoryName}</span>
				<span className="mb-3 vc-store_item_price-old in-1-line">Cấp độ: {item.LevelName}</span>
				{userInformation.RoleID == 1 ? (
					<div style={{ zIndex: 99999 }}>
						<button
							type="button"
							className=" btn btn-warning"
							style={{ width: '100%' }}
							onClick={() => setShowModalUpdate(true)}
						>
							Chỉnh sửa
						</button>
						<button
							type="button"
							className="btn btn-primary mt-2"
							style={{ width: '100%' }}
							onClick={() => setShowModalEdit(true)}
						>
							Cập nhật chi tiết
						</button>
					</div>
				) : (
					<>
						{activing ? (
							<>
								<Input
									value={code}
									onChange={(e) => setCode(e.target.value)}
									placeholder="Mã kích hoạt"
									style={{ height: 36, borderRadius: 6 }}
								/>
								<button
									onClick={() => handleActive({ ID: item.ID, ActiveCode: code })}
									className="btn btn-warning btn-add mt-2"
								>
									Kích hoạt {activeLoading && <Spin className="loading-base" />}
								</button>
								<button onClick={() => setActiving(false)} className="btn btn-primary btn-add mt-2">
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
									<button onClick={() => setActiving(true)} className="btn btn-warning btn-add mt-2">
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
	);

	return (
		<>
			<div className="vc-store_container">
				<div className="vc-store_item">
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
							<span style={{ width: '90%' }} className="title ml-3 mr-3 in-1-line">
								{item.VideoCourseName}
							</span>

							<span style={{ width: '90%' }} className="ml-3 mr-3 price-old in-1-line">
								Số video: {item.TotalVideoCourseSold}
							</span>

							<Link
								href={{
									pathname: '/video-course/[slug]',
									query: params
								}}
							>
								<span style={{ width: '90%' }} className="ml-3 mr-3 price-old in-1-line">
									Loại: {item.CategoryName}
								</span>
							</Link>
							<Link
								href={{
									pathname: '/video-course/[slug]',
									query: params
								}}
							>
								<span style={{ width: '90%' }} className="ml-3 mr-3 price-old in-1-line">
									Cấp độ: {item.LevelName}
								</span>
							</Link>
							<Link
								href={{
									pathname: '/video-course/[slug]',
									query: params
								}}
							>
								<i
									className="ml-3 mr-3 price-old in-2-line pr-1"
									style={{
										textDecorationLine: 'line-through',
										width: '90%'
									}}
								>
									Giá gốc: {parseToMoney(item.OriginalPrice)}đ
								</i>
							</Link>
							<Link
								href={{
									pathname: '/video-course/[slug]',
									query: params
								}}
							>
								<span style={{ width: '90%' }} className="ml-3 mb-3 price in-2-line">
									Giá bán: {parseToMoney(item.SellPrice)}đ
								</span>
							</Link>
						</div>
					</div>

					<div className="flip-card-back p-3">
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
									<p style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>{item.VideoCourseName}</p>
									<span className="in-1-line">Số video: {item.TotalVideoCourseSold}</span>
									<span className="in-1-line">Loại: {item.CategoryName}</span>
									<span className="mb-3 in-1-line">Cấp độ: {item.LevelName}</span>
									<div style={{ flex: 1 }} />
									{userInformation.RoleID == 1 ? (
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
				_onSubmitEdit={(data: any) => _onSubmitEdit(data)}
				programID={item.ID}
				rowData={item}
				isModalVisible={showModalUpdate}
				setIsModalVisible={setShowModalUpdate}
			/>
			<ModalUpdateDetail programID={item.ID} isModalVisible={showModalEdit} setIsModalVisible={setShowModalEdit} />
		</>
	);
};

export default RenderItemCard;
