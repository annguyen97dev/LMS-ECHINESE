import React from 'react';
import 'antd/dist/antd.css';
import Link from 'next/link';
import { parseToMoney } from '~/utils/functions';
import { Tooltip } from 'antd';
import { useWrap } from '~/context/wrap';
import ModalCreateVideoCourse from '~/lib/video-course/modal-create-video-course';

// CARD ITEM ON VIDEO COURSE
const RenderItemCard = ({ item, addToCard, categoryLevel, category, _onSubmitEdit, rowData, dataGrade }) => {
	const { userInformation, pageSize, showNoti } = useWrap();

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

	return (
		<Link
			href={{
				pathname: '/video-course-store/[slug]',
				query: params
			}}
		>
			<div className="vc-store_item">
				<div className="vc-store_item_warp-image">
					{item.ImageThumbnails === '' || item.ImageThumbnails === null || item.ImageThumbnails === undefined ? (
						<img src="/images/logo-final.jpg" />
					) : (
						<img src={item.ImageThumbnails} />
					)}
				</div>

				<div className="vc-store_item_content">
					<Link href="">
						<Tooltip title={item.VideoCourseName}>
							<span className="vc-store_item_title ml-3 mr-3 in-1-line">{item.VideoCourseName}</span>
						</Tooltip>
					</Link>
					<span className="ml-3 mr-3 vc-store_item_price-old in-1-line">Số video: {item.TotalVideoCourseSold}</span>{' '}
					<Tooltip title={item.CategoryName}>
						<span className="ml-3 mr-3 vc-store_item_price-old in-1-line">Loại: {item.CategoryName}</span>
					</Tooltip>
					<Tooltip title={item.LevelName}>
						<span className="ml-3 mr-3 vc-store_item_price-old in-1-line">Cấp độ: {item.LevelName}</span>
					</Tooltip>
					<div className="m-0 row">
						<i
							className="ml-3 mr-3 vc-store_item_price-old in-2-line pr-1"
							style={{
								textDecorationLine: 'line-through'
							}}
						>
							Giá gốc: {parseToMoney(item.OriginalPrice)}đ
						</i>
						<span className="ml-3 vc-store_item_price in-2-line">Giá bán: {parseToMoney(item.SellPrice)}đ</span>
					</div>
				</div>
				{userInformation.RoleID == 3 ? (
					<button
						type="button"
						className="ml-3 mr-3 mb-3 mt-1 btn btn-warning"
						onClick={(e) => {
							e.stopPropagation();
							addToCard(item);
						}}
					>
						Thêm vào giỏ hàng
					</button>
				) : (
					<ModalCreateVideoCourse
						dataLevel={categoryLevel}
						dataCategory={category}
						getIndex={() => {}}
						_onSubmitEdit={(data: any) => _onSubmitEdit(data)}
						programID={item.ID}
						rowData={item}
						dataGrade={item}
						showAdd={true}
						isLoading={false}
					/>
				)}
			</div>
		</Link>
	);
};

export default RenderItemCard;
