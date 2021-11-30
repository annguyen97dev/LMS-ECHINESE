import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { List, Card, Modal, notification } from 'antd';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';
import Link from 'next/link';
import { VideoCourseCardApi, VideoCourseStoreApi } from '~/apiBase/video-course-store';
import { parseToMoney } from '~/utils/functions';

const ItemVideo = ({ item, addToCard }) => {
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
				<span className="ml-3 mr-3 vc-store_item_price-old in-2-line">Số video: {item.TotalVideoCourseSold}</span>
				<div className="m-0 row">
					<span className="ml-3 vc-store_item_price in-2-line">Giá bán: {parseToMoney(item.SellPrice)}Đ</span>
					<i
						className="ml-3 mr-3 vc-store_item_price-old in-2-line"
						style={{
							textDecorationLine: 'line-through'
						}}
					>
						Giá gốc: {parseToMoney(item.OriginalPrice)}Đ
					</i>
				</div>
				<button type="button" className="ml-3 mr-3 mb-3 mt-1 btn btn-warning" onClick={() => addToCard(item)}>
					Thêm vào giỏ hàng
				</button>
			</div>
		</div>
	);
};

const key = 'updatable';

const VideoCourseCard = () => {
	const { userInformation } = useWrap();
	const [data, setData] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [rerender, setRender] = useState('');

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

	useEffect(() => {
		getAllArea('');
	}, []);

	//GET DATA
	const getAllArea = async (search) => {
		let temp = {
			pageIndex: 1,
			pageSize: 5,
			videocoursename: search || ''
		};
		try {
			const res = await VideoCourseStoreApi.getAll(temp);
			res.status == 200 && setData(res.data.data);
			setRender(res + '');
		} catch (err) {}
	};

	// ADD COURSE VIDEO TO CARD
	const postAddToCard = async (data) => {
		try {
			const res = await VideoCourseCardApi.add(data);
			res.status == 200 && setShowModal(true);
			res.status !== 200 && openNotification();
			getAllArea('');
		} catch (error) {}
	};

	// HANDLE AD TO CARD
	const addToCard = (p) => {
		let temp = {
			VideoCourseID: p.ID,
			Quantity: 1
		};
		postAddToCard(temp);
	};

	const [cardData, setCardData] = useState([]);

	// GET CARD DATA
	const getCardData = async () => {
		try {
			const res = await VideoCourseCardApi.getAll();
			res.status == 200 && setCardData(res.data.data);
		} catch (error) {}
	};

	// RENDER
	return (
		<div className="">
			<p className="video-course-list-title">Khóa Học Video</p>
			<Card className="video-course-list">
				<List
					itemLayout="horizontal"
					dataSource={data}
					grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
					renderItem={(item) => <ItemVideo addToCard={addToCard} item={item} />}
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
					{/* <div className="m-0 p-0 mt-4 vc-store_modal_card">
						<List
							itemLayout="vertical"
							dataSource={cardData}
							renderItem={(item) => <RenderItemCardVideo addToCard={addToCard} item={item} />}
						/>
					</div> */}
				</Modal>
			</Card>
		</div>
	);
};

VideoCourseCard.layout = LayoutBase;
export default VideoCourseCard;
