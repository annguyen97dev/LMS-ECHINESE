import React, { useState, useEffect } from 'react';
import { Radio, Input, Popover, Checkbox, DatePicker, Skeleton, Spin, Dropdown, Form } from 'antd';
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
import { paymentConfig } from '~/apiBase/shopping-cart/payment-config';

const CheckOut = () => {
	const { showNoti } = useWrap();
	const router = useRouter();
	const [session, loading] = useSession();
	const [dataUser, setDataUser] = useState<IUser>();
	const [cartItems, setCartItems] = useState<IShoppingCart[]>();
	const [paymentMethods, setPaymentMethods] = useState([]);
	const [method, setMethod] = useState();
	// const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
	const [discounts, setDiscounts] = useState(0);
	const [dropDownVisible, setDropDownVisible] = useState(false);
	const [promoCode, setPromoCode] = useState('');
	const [promo, setPromo] = useState(null);
	const [cartID, setCartID] = useState(null);
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
	const [form] = Form.useForm();
	const [dataOrder, setDataOrder] =
		useState<{ Note: string; OrderDetailModels: Array<any>; OrderID: number; TotalPayment: number }>(null);

	const renderPaymentMethodDetail = () => {
		const onChangeCheckRemember = () => {};
		return (
			<>
				{method == 'Momo' && (
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

				{method == 'Paypal Test' && (
					<div className="paypal-info">
						<p>Để hoàn thành thanh toán chúng tôi sẽ chuyển bạn đến trang bảo mật của Paypal!</p>
						<div className="text-right align-items-center">
							<LockOutlined style={{ fontSize: 30, marginRight: 5 }} />
							<span>Secure Connection</span>
						</div>
					</div>
				)}

				{method == 'OnePay Quốc tế' && (
					<div className="paypal-info">
						<p>Vui lòng nhấn vào nút thanh toán để chuyển đến trang thanh toán Momo</p>
						<div className="text-right align-items-center">
							<LockOutlined style={{ fontSize: 30, marginRight: 5 }} />
							<span>Secure Connection</span>
						</div>
					</div>
				)}

				{method == 'OnePay Nội địa' && (
					<div className="paypal-info">
						<p>Vui lòng nhấn vào nút thanh toán để chuyển đến trang thanh toán Onepay</p>
						<div className="text-right align-items-center">
							<LockOutlined style={{ fontSize: 30, marginRight: 5 }} />
							<span>Secure Connection</span>
						</div>
					</div>
				)}

				{method == 'Momo Test' && (
					<div className="paypal-info">
						<p>
							Qúy khách vui lòng đến{' '}
							<span className="text-uppercase font-weight-bold">1600 Pennsylvania Avenue NW Washington, D.C. 20500</span> để
							hoàn tất thanh toán
						</p>
						<div className="text-right align-items-center">
							<LockOutlined style={{ fontSize: 30, marginRight: 5 }} />
							<span>Secure Connection</span>
						</div>
					</div>
				)}
			</>
		);
	};

	const renderPaymentMethod = () =>
		paymentMethods &&
		paymentMethods.map((item, index) => {
			return (
				<div className="payment-card type-checkout" key={index}>
					<Radio value={item.PaymentName}>
						<div className="logo-branch p-1 d-flex justify-content-between align-items-center">
							<p className="mb-0">{item.PaymentName}</p>
							<div>
								<img src={item.PaymentLogo} alt="img branch cc"></img>
							</div>
						</div>
					</Radio>
				</div>
			);
		});

	const handleCheckout = async () => {
		setIsLoading({
			status: 'CHECKOUT',
			loading: true
		});
		let res = null;
		try {
			switch (method) {
				case 'Momo':
					res = await shoppingCartApi.checkoutMomo({ OrderID: dataOrder.OrderID });
					break;
				case 'Paypal Test':
					res = await shoppingCartApi.checkoutPaypal({ OrderID: dataOrder.OrderID });
					break;
				case 'OnePay Quốc tế':
					res = await shoppingCartApi.checkoutCash({ CartId: cartID && cartID });
					break;
				case 'OnePay Nội địa':
					res = await shoppingCartApi.checkoutPaypal({ OrderID: dataOrder.OrderID });
					break;
				case 'Momo Test':
					res = await shoppingCartApi.checkoutPaypal({ OrderID: dataOrder.OrderID });
					break;
				default:
					break;
			}
			if (res.status == 200) {
				switch (method) {
					case 'Momo':
						router.push(res.data.payUrl);
						break;
					case 'Paypal Test':
						router.push(res.data.payUrl);
						break;
					case 'OnePay Quốc tế':
						showNoti('success', res.data.message);
						break;
					case 'OnePay Nội địa':
						break;
					case 'Momo Test':
						break;
					default:
						break;
				}
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

	const getShoppingCartData = async () => {
		setIsLoading({ status: 'loading', loading: true });
		try {
			let res = await shoppingCartApi.getAll();
			if (res.status == 200) {
				setCartItems(res.data.data);
				//@ts-ignore
				getOrderID(res.data.cartId);
				//@ts-ignore
				setCartID(res.data.cartId);
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
				</div>
				<div className="cart__item-action pl-1 col-1 ">
					<span className="cart__item-quantity font-weight-green">{item.Quantity}</span>
				</div>
				<div className="cart__item-price col-4">
					<p className="font-weight-green">{numberWithCommas(item.Price * item.Quantity)} vnd</p>
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
		let base64Url = token.split('.')[1];
		let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		let jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);

		return JSON.parse(jsonPayload);
	}

	const applyDiscount = async () => {
		setIsLoading({ status: 'APPLY_DISCOUNT', loading: true });
		try {
			let res = await shoppingCartApi.applyDiscount({ OrderID: dataOrder.OrderID, DiscountCode: promoCode });
			if (res.status == 200) {
				showNoti('success', 'Thêm mã khuyễn mãi thành công!');
				setPromo(res.data.data);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({ status: 'APPLY_DISCOUNT', loading: false });
		}
	};

	const getPaymentMethod = async () => {
		setIsLoading({ status: 'GET_ALL', loading: true });
		try {
			let res = await paymentConfig.getAll();
			if (res.status == 200) {
				setPaymentMethods(res.data.data);
				// @ts-ignore
				setMethod(res.data.data[0].PaymentName);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'GET_ALL', loading: false });
		}
	};

	const getOrderID = async (cartId) => {
		try {
			let res = await shoppingCartApi.getOrderID({ cartId: cartId });
			if (res.status == 200) {
				setDataOrder(res.data.data);
			}
		} catch (error) {}
	};

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
		getPaymentMethod();
	}, []);

	const onChangeRadio = (event) => {
		setMethod(event.target.value);
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
				<div className="row pb-5">
					<div className="checkout__content col-12 col-lg-7">
						<h1>Thanh toán</h1>
						{/* @ts-ignore */}
						<Radio.Group onChange={onChangeRadio} value={method}>
							{renderPaymentMethod()}
						</Radio.Group>
						<div className="payment-method">{renderPaymentMethodDetail()}</div>
						<div className="order-detail mt-4">
							<h4>Chi tiết mua hàng</h4>
							{isLoading.loading ? <Skeleton active /> : renderCartItems()}
						</div>
					</div>
					<div className="sumary col-12 col-lg-5 mt-4">
						<div className="sumary-wrap">
							<h6>Mã khuyến mãi</h6>
							<Form form={form}>
								<Form.Item>
									<Search
										onChange={(event) => {
											setPromoCode(event.target.value);
										}}
										onSearch={(event) => {
											applyDiscount();
										}}
										name="Promotions"
										placeholder="Nhập mã khuyến mãi"
										className="input-promo"
										enterButton="Áp dụng"
										size="large"
										loading={isLoading.status == 'APPLY_DISCOUNT' && isLoading.loading}
									/>
								</Form.Item>
							</Form>
							<h4>Tổng thanh toán</h4>
							<div className="row">
								<div className="col-7">
									<h6>Giá gốc</h6>
								</div>
								<div className="col-5">
									<span className="mr-2">{numberWithCommas(dataOrder?.TotalPayment)}</span>
									<span>VND</span>
								</div>
							</div>
							<div className="row sumary__price">
								<div className="col-7">
									<h6>Khuyến mãi</h6>
								</div>
								<div className="col-5">
									<p>- {promo ? promo.DiscountPrice : 0} VND</p>
								</div>
							</div>
							<div className="row">
								<div className="col-7" style={{ fontWeight: 700 }}>
									<p>Tổng cộng:</p>
								</div>
								<div className="col-5" style={{ fontWeight: 700 }}>
									<span className="mr-2">{numberWithCommas(dataOrder?.TotalPayment - discounts)}</span>
									<span>VND</span>
								</div>
							</div>
							<p>
								Udemy is required by law to collect applicable transaction taxes for purchases made in certain tax
								jurisdictions.
							</p>
							<p>By completing your purchase you agree to these Terms of Service.</p>
							<button className="btn btn-primary w-100" onClick={handleCheckout}>
								Thanh toán
								{isLoading.status == 'CHECKOUT' && isLoading.loading && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckOut;
