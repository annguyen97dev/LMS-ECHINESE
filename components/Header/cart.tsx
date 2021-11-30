import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { shoppingCartApi } from '~/apiBase/shopping-cart/shopping-cart';
import { useRouter } from 'next/router';

const Cart = () => {
	const router = useRouter();
	const { reloadNotification, handleReloadNoti } = useWrap();
	const [cartData, setCartData] = useState([]);
	const [countNoti, setCountNoti] = useState(0);

	useEffect(() => {
		getCartData();
	}, [reloadNotification]);

	useEffect(() => {
		setCountNoti(cartData.length);
	}, [cartData]);

	const getCartData = async () => {
		try {
			const response = await shoppingCartApi.getAll();
			response.status == 200 && setCartData(response.data.data);
		} catch (error) {}
	};

	return (
		<>
			<button onClick={() => router.push('cart/shopping-cart')} className="cart-icon">
				<ShoppingCart size={18} />
			</button>
			<div className={countNoti > 0 ? 'count-notification' : 'hide'}>
				<span>{countNoti > 9 ? `9+` : countNoti}</span>
			</div>
		</>
	);
};
export default Cart;
