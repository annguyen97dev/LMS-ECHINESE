import React from 'react';
import 'antd/dist/antd.css';
import Link from 'next/link';
import { parseToMoney } from '~/utils/functions';
import { Tooltip } from 'antd';

// CARD ITEM ON VIDEO COURSE OF STUDENT
const RenderItemCardStudent = ({ item, addToCard }) => {
	return (
		<div className="vc-store_item">
			<Link href="">
				<div className="vc-store_item_warp-image">
					{item.ImageThumbnails === '' || item.ImageThumbnails === null || item.ImageThumbnails === undefined ? (
						<img src="/images/logo-final.jpg" />
					) : (
						<img src={item.ImageThumbnails} />
					)}
				</div>
			</Link>
			<div className="vc-store_item_content">
				<Link href="">
					<Tooltip title={item.VideoCourseName}>
						<a className="vc-store_item_title ml-3 mr-3 in-1-line">{item.VideoCourseName}</a>
					</Tooltip>
				</Link>
				<span className="ml-3 mr-3 vc-store_item_price-old in-2-line">Số video: {item.TotalVideoCourseSold}</span>{' '}
				<span className="ml-3 mr-3 vc-store_item_price-old in-2-line">Loại: {item.CategoryName}</span>
				<div className="m-0 row">
					<span className="ml-3 vc-store_item_price in-2-line">Giá bán: {parseToMoney(item.SellPrice)}đ</span>
					<i
						className="ml-3 mr-3 vc-store_item_price-old in-2-line pr-1"
						style={{
							textDecorationLine: 'line-through'
						}}
					>
						Giá gốc: {parseToMoney(item.OriginalPrice)}đ
					</i>
				</div>
				<button type="button" className="ml-3 mr-3 mb-3 mt-1 btn btn-warning" onClick={() => addToCard(item)}>
					Thêm vào giỏ hàng
				</button>
			</div>
		</div>
	);
};

export default RenderItemCardStudent;