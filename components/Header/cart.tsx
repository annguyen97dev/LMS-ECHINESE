import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { shoppingCartApi } from '~/apiBase/shopping-cart/shopping-cart';
import { useRouter } from 'next/router';
import { orderProductDetail } from '~/apiBase/product/order-product-detail';
import { Dropdown, Menu } from 'antd';

const Cart = () => {
	const router = useRouter();
	const { reloadNotification, handleReloadNoti } = useWrap();
	const [cartData, setCartData] = useState([]);
	const [productCartData, setProductCartData] = useState([]);
	const [countNoti, setCountNoti] = useState(0);
	const [countNotiProduct, setCountNotiProduct] = useState(0);

	useEffect(() => {
		getCartData();
		getProductCartData();
	}, [reloadNotification]);

	useEffect(() => {
		setCountNoti(cartData.length);
		setCountNotiProduct(productCartData.length);
	}, [cartData, productCartData]);

	const getCartData = async () => {
		try {
			const response = await shoppingCartApi.getAll();
			response.status == 200 && setCartData(response.data.data);
		} catch (error) {}
	};

	const getProductCartData = async () => {
		try {
			let res = await orderProductDetail.getByToken();
			res.status === 200 && setProductCartData(res.data.data);
		} catch (error) {
		} finally {
		}
	};

	const menu = (
		<Menu>
			<Menu.Item>
				<div className="shopping__cart-detail d-flex justify-content-center align-items-center">
					<a href="/cart/shopping-cart" style={{ textDecoration: 'none' }}>
						Giỏ hàng khóa học video
					</a>
					<span className={countNoti > 0 ? 'count-notification' : 'hide'}>
						<span>{countNoti > 9 ? `9+` : countNoti}</span>
					</span>
				</div>
			</Menu.Item>
			<Menu.Item>
				<div className="shopping__cart-detail d-flex justify-content-center align-items-center">
					<a href="/cart/shopping-cart-product" style={{ textDecoration: 'none' }}>
						Giỏ hàng văn phòng phẩm
					</a>
					<span className={countNotiProduct > 0 ? 'count-notification' : 'hide'}>
						<span>{countNotiProduct > 9 ? `9+` : countNotiProduct}</span>
					</span>
				</div>
			</Menu.Item>
		</Menu>
	);

	return (
		<>
			{/* <Dropdown overlay={menu} placement="bottomRight">
				<button className="cart-icon">
					<ShoppingCart size={18} />
					<div className={countNoti > 0 || countNotiProduct > 0 ? 'count-notification' : 'hide'}>
						<span>{countNoti + countNotiProduct > 9 ? `9+` : countNoti + countNotiProduct}</span>
					</div>
				</button>
			</Dropdown> */}
			<div className="shopping__cart-detail d-flex justify-content-center align-items-center">
				<a href="/cart/shopping-cart" style={{ textDecoration: 'none' }}>
					<ShoppingCart size={18} />
				</a>
				<span className={countNoti > 0 ? 'count-notification' : 'hide'}>
					<span>{countNoti > 9 ? `9+` : countNoti}</span>
				</span>
			</div>
		</>
	);
};
export default Cart;
