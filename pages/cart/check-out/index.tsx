import React, { useState, useEffect } from 'react';
import { Radio, Input, Popover, Checkbox, DatePicker, Skeleton, Spin, Dropdown } from 'antd';
import Link from 'next/link';
import Notifiaction from './../../../components/Header/notification';
import { UserOutlined, RedoOutlined, LogoutOutlined, LoginOutlined, LockOutlined, EllipsisOutlined } from '@ant-design/icons';
import { session, signIn, signOut, useSession } from 'next-auth/client';
import { FormOutlined } from '@ant-design/icons';
import { User } from 'react-feather';
import { useWrap } from './../../../context/wrap';
import { shoppingCartApi } from '~/apiBase/shopping-cart/shopping-cart';
import { numberWithCommas } from '~/utils/functions';
import moment from 'moment';
import { parsePriceStrToNumber } from './../../../utils/functions/index';
import { useRouter } from 'next/router';

const CheckOut = () => {
	const { showNoti } = useWrap();
	const router = useRouter();
	const [method, setMothod] = useState('card');
	const [session, loading] = useSession();
	const [dataUser, setDataUser] = useState<IUser>();
	const [cartItems, setCartItems] = useState<IShoppingCart[]>();
	const [discounts, setDiscounts] = useState(0);
	const [dropDownVisible, setDropDownVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});
	const { Search } = Input;
	const { titlePage, userInformation } = useWrap();
	const monthFormat = 'MM/YYYY';
	const [params, setParams] = useState({
		NameCard: '',
		CardNumber: 0,
		SecureCode: 0
	});
	const [dataOrder, setDataOrder] =
		useState<{ Note: string; OrderDetailModels: Array<any>; OrderID: number; TotalPayment: number }>(null);

	const renderPaymentMethod = () => {
		let dummyTxt = '1234567890123456';

		let joy = dummyTxt.match(/.{1,4}/g);

		const onChangeCheckRemember = () => {};
		return (
			<>
				{method == 'card' && (
					<div className="card-info">
						<Input className="style-input mb-4" size="large" placeholder="Tên chủ thẻ" />
						<Input
							className="style-input mb-4"
							size="large"
							placeholder="Số thẻ"
							maxLength={19}
							value={params.CardNumber.toString()
								.match(/.{1,4}/g)
								?.join(' ')}
							onChange={(event) => {
								setParams({ ...params, CardNumber: parsePriceStrToNumber(event.target.value) });
							}}
						/>
						<div className="row">
							<div className="col-6">
								{/* <Input className="style-input mb-4" size="large" placeholder="DD/MM" /> */}
								<DatePicker
									className="style-input"
									defaultValue={moment('01/2021', monthFormat)}
									format={monthFormat}
									picker="month"
								/>
							</div>
							<div className="col-6">
								<Input
									className="style-input mb-4"
									size="large"
									placeholder="Mã bảo vệ"
									maxLength={4}
									value={params.SecureCode}
									onChange={(event) => {
										setParams({ ...params, SecureCode: parsePriceStrToNumber(event.target.value) });
									}}
								/>
							</div>
							<div className="col-6">
								<Input className="style-input mb-4" size="large" placeholder="Zip/Postal code" />
							</div>
						</div>
						<div className="row">
							<div className="col-6">
								<Checkbox onChange={onChangeCheckRemember}>Ghi nhớ thẻ này</Checkbox>
							</div>
							<div className="col-6 text-right align-items-center">
								<LockOutlined style={{ fontSize: 30, marginRight: 5 }} />
								<span>Secure Connection</span>
							</div>
						</div>
					</div>
				)}
				{method == 'paypal' && (
					<div className="paypal-info">
						<p>Để hoàn thành thanh toán chúng tôi sẽ chuyển bạn đến trang bảo mật của Paypal!</p>
						<div className="text-right align-items-center">
							<LockOutlined style={{ fontSize: 30, marginRight: 5 }} />
							<span>Secure Connection</span>
						</div>
					</div>
				)}

				{method == 'momo' && (
					<div className="paypal-info">
						<p>Vui lòng nhấn vào nút thanh toán để chuyển đến trang thanh toán Momo</p>
						<div className="text-right align-items-center">
							<LockOutlined style={{ fontSize: 30, marginRight: 5 }} />
							<span>Secure Connection</span>
						</div>
					</div>
				)}
			</>
		);
	};

	console.log('Data Order: ', dataOrder);

	const getOrderID = async (cartId) => {
		try {
			let res = await shoppingCartApi.getOrderID({ cartId: cartId });
			if (res.status == 200) {
				setDataOrder(res.data.data);
			}
		} catch (error) {}
	};

	const getShoppingCartData = async () => {
		setIsLoading({ status: 'loading', loading: true });
		try {
			let res = await shoppingCartApi.getAll();
			if (res.status == 200) {
				setCartItems(res.data.data);
				//@ts-ignore
				getOrderID(res.data.cartId);
			}
			if (res.status == 204) {
				setCartItems([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'loading', loading: false });
		}
	};

	const renderCartItems = () => {
		return cartItems?.map((item, index) => (
			<div className=" cart__item d-flex justify-content-between align-items-center row" key={index}>
				<div className="cart__item-img col-3">
					<Link href="/">
						<a href="#">
							<img src={item.ImageThumbnails.length ? item.ImageThumbnails : '/images/cat-ben.jpg'} alt="img course"></img>
						</a>
					</Link>
				</div>
				<div className="cart__item-detail col-4">
					<h5>{item.VideoCourseName}</h5>
					{/* <p>Tạo bởi: Dr. Angele Yu</p> */}
					{/* <div className="detail__hours">
						<span>21 giờ học</span>
						<span>240 bài học</span>
						<span>Trung cấp</span>
					</div> */}
				</div>
				<div className="cart__item-price col-3">
					<p className="font-weight-green">{numberWithCommas(item.Price)} vnd</p>
				</div>
			</div>
		));
	};

	const moveToLogin = () => {
		signIn();
	};

	const contentLogout = (
		<ul className="user-function">
			<li>
				<Link href="/profile">
					<a href="">
						<span className="icon">
							<UserOutlined />
						</span>
						<span className="function-name">Trang cá nhân</span>
					</a>
				</Link>
			</li>
			<li>
				<Link href="/change-password">
					<a href="#">
						<span className="icon inbox">
							<RedoOutlined />
						</span>
						<span className="function-name">Đổi mật khẩu</span>
					</a>
				</Link>
			</li>
			<li>
				<a href="#" onClick={() => (signOut(), localStorage.removeItem('dataUserEchinese'))}>
					<span className="icon logout">
						<LogoutOutlined />
					</span>
					<span className="function-name">Log out</span>
				</a>
			</li>
		</ul>
	);

	const contentLogin = (
		<ul className="user-function">
			<li>
				<a href="#" onClick={moveToLogin}>
					<span className="icon">
						<LoginOutlined />
					</span>
					<span className="function-name">Đăng nhập</span>
				</a>
			</li>
			<li>
				<a href="#">
					<span className="icon inbox">
						<FormOutlined />
					</span>
					<span className="function-name">Đăng kí</span>
				</a>
			</li>
		</ul>
	);

	function parseJwt(token) {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		var jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);

		return JSON.parse(jsonPayload);
	}

	useEffect(() => {
		if (session !== undefined) {
			let token = session.accessToken;
			if (userInformation) {
				setDataUser(userInformation);
			} else {
				setDataUser(parseJwt(token));
			}
		}
	}, [userInformation]);

	useEffect(() => {
		getShoppingCartData();
	}, []);

	const onChangeRadio = (event) => {
		setMothod(event.target.value);
	};

	const handleCheckout = async () => {
		setIsLoading({
			status: 'CHECKOUT',
			loading: true
		});
		let res = null;
		try {
			switch (method) {
				case 'momo':
					res = await shoppingCartApi.checkoutMomo({ OrderID: dataOrder.OrderID });
					break;
				case 'paypal':
					res = await shoppingCartApi.checkoutPaypal({ OrderID: dataOrder.OrderID });
					break;
				default:
					break;
			}
			if (res.status == 200) {
				router.push(res.data.payUrl);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				status: 'CHECKOUT',
				loading: false
			});
		}
	};

	const menuDropdown = () => {
		return <></>;
	};

	return (
		<div style={{ backgroundColor: '#fff' }}>
			<header>
				<div className="shopping__cart-header justify-content-between align-items-center row">
					<div className="header__logo col-6 col-md-3">
						<Link href="/">
							<a href="#">
								{' '}
								<img className="logo-img" src="/images/logo-final.jpg" alt="logo branch"></img>
							</a>
						</Link>
					</div>
					<div className="header__profile col-2">
						<div className="col-setting">
							<ul className="col-setting-list">
								<li className="user">
									<div className="d-inline-block d-md-none  w-25 ">
										<Dropdown overlay={menuDropdown} trigger={['click']} visible={dropDownVisible}>
											<a
												className="ant-dropdown-link"
												onClick={(e) => {
													e.preventDefault();
													setDropDownVisible(!dropDownVisible);
												}}
											>
												<EllipsisOutlined />
											</a>
										</Dropdown>
									</div>
									<div className="d-none d-md-inline-block ">
										<Popover content={!session ? contentLogin : contentLogout} trigger="click" title="">
											<div className="user-wrap">
												<div className="user-info">
													{session?.user ? (
														<div className="user-wrap">
															<div className="user-img">
																<img src={dataUser?.Avatar ? dataUser.Avatar : '/images/user.png'} alt="" />
															</div>
															<div className="user-info">
																<p className="user-name">{dataUser?.FullNameUnicode}</p>
																<p className="user-position">{dataUser?.RoleName}</p>
															</div>
														</div>
													) : (
														<p>Tài khoản</p>
													)}
													{/* 
												<div className="user-name-mobile">
													<User />
												</div> */}
												</div>
											</div>
										</Popover>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</header>
			<div className="container checkout mt-5">
				<div className="d-flex justify-content-end">
					<Link href="/cart/shopping-cart">
						<p className="text-right font-weight-primary mb-5" style={{ cursor: 'pointer', width: 110 }}>
							Hủy thanh toán
						</p>
					</Link>
				</div>
				<div className="row">
					<div className="checkout__content col-12 col-md-7">
						<h1>Thanh toán</h1>
						<Radio.Group onChange={onChangeRadio} value={method}>
							<div className="payment-card type-checkout">
								<Radio value={'card'}>
									<div className="logo-branch">
										<img src={'/images/mastercard.svg'} alt="img branch cc"></img>
										<img src={'/images/visa.svg'} alt="img branch cc"></img>
									</div>
								</Radio>
							</div>
							<div className="paypal type-checkout">
								<Radio value={'paypal'}>
									<div className="logo-branch">
										<img src={'/images/paypal.svg'} alt="img branch cc"></img>
									</div>
								</Radio>
							</div>
							<div className="momo type-checkout">
								<Radio value={'momo'}>
									<div className="logo-branch">
										<img src={'/images/momo.jpg'} alt="img branch cc"></img>
									</div>
								</Radio>
							</div>
						</Radio.Group>
						<div className="payment-method">{renderPaymentMethod()}</div>
						<div className="order-detail mt-4">
							<h4>Chi tiết mua hàng</h4>
							{isLoading.loading ? <Skeleton active /> : renderCartItems()}
						</div>
					</div>
					<div className="sumary col-12 col-md-5 mt-4">
						<div className="sumary-wrap">
							<h4>Tổng thanh toán</h4>
							<div className="row">
								<div className="col-7">
									<p>Giá gốc</p>
								</div>
								<div className="col-5">
									<p>
										{numberWithCommas(cartItems?.reduce((a, b) => Number(a) + Number(b.Price), 0))}
										vnd
									</p>
								</div>
							</div>
							<div className="col-5">
								<p>{numberWithCommas(cartItems?.reduce((a, b) => Number(a) + Number(b.Price), 0))} VNĐ</p>
							</div>
						</div>
						<div className="row sumary__price">
							<div className="col-7">
								<p>Khuyến mãi</p>
							</div>
							<div className="col-5">
								<p>- {discounts} VNĐ</p>
							</div>
							<p>
								Udemy is required by law to collect applicable transaction taxes for purchases made in certain tax
								jurisdictions.
							</p>
							<p>By completing your purchase you agree to these Terms of Service.</p>
							<Link href="/cart/check-out">
								<button className="btn btn-primary w-100">Thanh toán</button>
							</Link>
						</div>
						<div className="row">
							<div className="col-7" style={{ fontWeight: 700 }}>
								<p>Tổng cộng:</p>
							</div>
							<div className="col-5" style={{ fontWeight: 700 }}>
								<p>
									{/* {numberWithCommas(cartItems?.reduce((a, b) => Number(a) + Number(b.Price), 0) - discounts)} */}
									{numberWithCommas(dataOrder?.TotalPayment)}
									VNĐ
								</p>
							</div>
						</div>
						{/* <p>
							Udemy is required by law to collect applicable transaction taxes for purchases made in certain tax
							jurisdictions.
						</p>
						<p>By completing your purchase you agree to these Terms of Service.</p> */}
						<Link href="/cart/check-out">
							<button className="btn btn-primary w-100">Thanh toán</button>
						</Link>

						<button className="btn btn-primary w-100" onClick={handleCheckout}>
							Thanh toán
							{isLoading.status == 'CHECKOUT' && isLoading.loading && <Spin className="loading-base" />}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckOut;
