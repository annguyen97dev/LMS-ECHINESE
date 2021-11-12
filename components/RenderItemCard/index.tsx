import React from 'react';
import 'antd/dist/antd.css';
import Link from 'next/link';
import { parseToMoney } from '~/utils/functions';

const RenderItemCardVideo = ({ item, addToCard }) => {
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
					<a className="vc-store_item_title ml-3 mr-3 in-2-line">{item.VideoCourseName}</a>
				</Link>
				{/* <span className="ml-3 mr-3 vc-store_item_price-old in-2-line">Số video: {item.TotalVideoCourseSold}</span> */}
				<div className="m-0 row">
					{/* <span className="ml-3 vc-store_item_price in-2-line">Giá bán: {parseToMoney(item.SellPrice)}Đ</span>
					<i
						className="ml-3 mr-3 vc-store_item_price-old in-2-line"
						style={{
							textDecorationLine: 'line-through'
						}}
					>
						Giá gốc: {parseToMoney(item.OriginalPrice)}Đ
					</i> */}
				</div>
			</div>
		</div>
	);
};

export default RenderItemCardVideo;
