import React, { useState } from 'react';
import 'antd/dist/antd.css';
import Link from 'next/link';
import { parseToMoney } from '~/utils/functions';
import { Popover, Spin } from 'antd';
import { useWrap } from '~/context/wrap';
import ModalUpdateDetail from '~/lib/video-course/modal-update-details';
import ModalUpdateInfo from '~/lib/video-course/modal-update-info';

// CARD ITEM ON VIDEO COURSE
const RenderItemCard = ({ item, addToCard, _onSubmitEdit, loading }) => {
	const { userInformation } = useWrap();

	const [showModalUpdate, setShowModalUpdate] = useState(false);
	const [showModalEdit, setShowModalEdit] = useState(false);

	const params = {
		Category: item.CategoryName,
		Level: item.LevelName,
		Create: item.CreatedOn,
		Thum: item.ImageThumbnails,
		VideoName: item.VideoCourseName,
		slug: item.ID,
		Original: item.OriginalPrice,
		Sell: item.SellPrice,
		Active: item.StatusActive,
		TotalVideo: item.TotalVideoCourseSold
	};

	const PopoverItem = (
		<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', maxWidth: 260 }}>
			{/* <div className="rotate-45" style={{ width: 20, height: 20, backgroundColor: '#fff' }} /> */}
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
						<button
							onClick={(e) => {
								e.stopPropagation();
								addToCard(item);
							}}
							className="btn btn-primary btn-add"
						>
							Thêm vào giỏ {loading && <Spin className="loading-base" />}
						</button>
						{item.Active == 'activated' ? (
							<Link
								href={{
									pathname: '/video-learning',
									query: {
										course: item.ID,
										complete: 0 + '/' + 0,
										name: item.VideoCourseName
									}
								}}
							>
								<button className="btn btn-dark btn-add mt-2">Xem khóa học</button>
							</Link>
						) : (
							<button className="btn btn-warning btn-add mt-2">Kích hoạt</button>
						)}
						<button className="btn btn-light btn-add mt-2">Mua ngay</button>
					</>
				)}
			</div>
		</div>
	);

	return (
		<>
			<Popover content={PopoverItem} placement="right">
				<div className="vc-store_item">
					<div className="vc-store_item_warp-image">
						<Link
							href={{
								pathname: '/video-course-store/[slug]',
								query: params
							}}
						>
							{item.ImageThumbnails === '' || item.ImageThumbnails === null || item.ImageThumbnails === undefined ? (
								<img src="/images/logo-final.jpg" />
							) : (
								<img src={item.ImageThumbnails} />
							)}
						</Link>
					</div>
					<div className="vc-store_item_content">
						<Link
							href={{
								pathname: '/video-course-store/[slug]',
								query: params
							}}
						>
							<span style={{ width: '90%' }} className="vc-store_item_title ml-3 mr-3 in-1-line">
								{item.VideoCourseName}
							</span>
						</Link>
						<Link
							href={{
								pathname: '/video-course-store/[slug]',
								query: params
							}}
						>
							<span style={{ width: '90%' }} className="ml-3 mr-3 vc-store_item_price-old in-1-line">
								Số video: {item.TotalVideoCourseSold}
							</span>
						</Link>
						<Link
							href={{
								pathname: '/video-course-store/[slug]',
								query: params
							}}
						>
							<span style={{ width: '90%' }} className="ml-3 mr-3 vc-store_item_price-old in-1-line">
								Loại: {item.CategoryName}
							</span>
						</Link>
						<Link
							href={{
								pathname: '/video-course-store/[slug]',
								query: params
							}}
						>
							<span style={{ width: '90%' }} className="ml-3 mr-3 vc-store_item_price-old in-1-line">
								Cấp độ: {item.LevelName}
							</span>
						</Link>
						<Link
							href={{
								pathname: '/video-course-store/[slug]',
								query: params
							}}
						>
							<i
								className="ml-3 mr-3 vc-store_item_price-old in-2-line pr-1"
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
								pathname: '/video-course-store/[slug]',
								query: params
							}}
						>
							<span style={{ width: '90%' }} className="ml-3 mb-3 vc-store_item_price in-2-line">
								Giá bán: {parseToMoney(item.SellPrice)}đ
							</span>
						</Link>
					</div>
				</div>
			</Popover>
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
