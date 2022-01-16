import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { productApi } from '~/apiBase/product/product';
import LayoutBase from '~/components/LayoutBase';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Thumbs } from 'swiper';
import 'swiper/swiper-bundle.css';
import { Card } from 'antd';
import { numberWithCommas } from '~/utils/functions';
import QuantityOfItems from '~/components/Global/Option/shopping-cart/QuantityOfItems';
import QuantityOfProduct from '~/components/Global/Product/QuantityOfProduct';
import { orderProductDetail } from '~/apiBase/product/order-product-detail';
import { useWrap } from '~/context/wrap';

SwiperCore.use([Navigation, Pagination, Thumbs]);

const ProductDetails = (props) => {
	const [productDetail, setProductDetail] = useState<IProduct>();
	const [isLoading, setIsLoading] = useState({ type: '', status: false });
	const [thumbsSwiper, setThumbsSwiper] = useState(null);
	const [slots, setSlots] = useState(1);
	const { showNoti, handleReloadCart, handleReloadNoti } = useWrap();
	const router = useRouter();
	console.log(router.query);

	const getProductDetail = async () => {
		setIsLoading({ type: 'GET', status: true });
		try {
			// Click product from [slug] page: router.query.ID - from shopping-cart page: router.query.ProductID
			let res = await productApi.getByID(Number(router.query.ProductID ? router.query.ProductID : router.query.ID));
			if (res.status === 200) {
				setProductDetail(res.data.data);
				console.log(res.data.data);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET', status: false });
		}
	};

	const thumbsItem = productDetail?.ImageOfProducts.map((item, index) => (
		<SwiperSlide key={`thumb-${index}`} tag="li" style={{ listStyle: 'none' }}>
			<img src={item.Link} style={{ width: 80, height: 60 }} />
		</SwiperSlide>
	));

	const handleAddToCart = async () => {
		setIsLoading({ type: 'POST', status: true });
		try {
			let res = await orderProductDetail.insert({ ProductID: productDetail.ID, Quantity: slots });
			if (res.status === 200) {
				showNoti('success', 'Thêm vào giỏ hàng thành công!');
				handleReloadCart();
				handleReloadNoti();
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'POST', status: false });
		}
	};

	useEffect(() => {
		getProductDetail();
	}, []);

	return (
		<>
			<div className="product__detail row">
				<div className="product__detail-img col-md-5 col-12 p-0" style={{ zIndex: 9 }}>
					<Card loading={isLoading.type === 'GET' && isLoading.status} className="vc-details ">
						<>
							<div className="mb-2">
								<Swiper
									id="main"
									tag="section"
									// wrapperTag="ul"
									spaceBetween={0}
									slidesPerView={1}
									slidesPerGroup={1}
									thumbs={{ swiper: thumbsSwiper }}
									navigation
									pagination
									loop
								>
									{productDetail &&
										//@ts-ignore
										productDetail.ImageOfProducts.map((item, index) => (
											<SwiperSlide
												key={`thumb-${index}`}
												tag="li"
												style={{
													listStyle: 'none',
													width: '100%',
													height: 300
												}}
											>
												<img
													src={item.Link}
													style={{
														width: '100%',
														height: 300,
														objectFit: 'cover'
													}}
												/>
											</SwiperSlide>
										))}
								</Swiper>
							</div>
							<Swiper
								id="thumbs"
								//  onSwiper={setThumbsSwiper}
								spaceBetween={5}
								slidesPerView={4}
							>
								{thumbsItem}
							</Swiper>
						</>
					</Card>
				</div>
				<div className="product__detail-info col-12 col-md-7 p-0">
					{productDetail && (
						<Card loading={isLoading.type === 'GET' && isLoading.status} className="vc-details ">
							<h3 className="product__detail-name font-weight-primary">{productDetail.Name}</h3>
							<p className="product__detail-decs">{productDetail.Description}</p>
							<p className="product__detail-price font-weight-green">
								{numberWithCommas(productDetail.Price)} đ{' '}
								<span className="product__detail-listedPrice font-weight-black">
									{numberWithCommas(productDetail.ListedPrice)} đ
								</span>
							</p>
							<p className="product__detail-quantity">
								Số lượng <QuantityOfProduct slots={slots} setSlots={setSlots} />
							</p>
							<button
								className="btn btn-primary"
								disabled={isLoading.type === 'POST' && isLoading.status}
								onClick={handleAddToCart}
							>
								Thêm vào giỏ
							</button>
						
						</Card>
					)}
				</div>
			</div>
		</>
	);
};

ProductDetails.layout = LayoutBase;
export default ProductDetails;
