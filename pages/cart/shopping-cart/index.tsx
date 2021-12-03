import {
	EllipsisOutlined,
	FormOutlined,
	LoginOutlined,
	LogoutOutlined,
	RedoOutlined,
	SearchOutlined,
	UserOutlined
} from '@ant-design/icons';
import { Dropdown, Input, Popover, Skeleton, Form, Spin } from 'antd';
import { signIn, signOut, useSession } from 'next-auth/client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { shoppingCartApi } from '~/apiBase/shopping-cart/shopping-cart';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';
import Notifiaction from '../../../components/Header/notification';
import DeleteItem from './../../../components/Tables/DeleteItem';

const ShoppingCart = () => {
	const [session, loading] = useSession();
	const [dataUser, setDataUser] = useState<IUser>();
	const { titlePage, userInformation, handleReloadNoti } = useWrap();
	const [cartItems, setCartItems] = useState<IShoppingCart[]>();
	const [dropDownVisible, setDropDownVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});
	const [clickedItem, setClickedItem] = useState(null);

	const { Search } = Input;
	const { showNoti } = useWrap();

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

	const getShoppingCartData = async () => {
		setIsLoading({ status: 'GET_CART_DATA', loading: true });
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
			setIsLoading({ status: 'GET_CART_DATA', loading: false });
		}
	};

	const getShoppingCartDataNoLoading = async () => {
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
		}
	};

	const deleteItem = async (id) => {
		setIsLoading({ status: 'loading', loading: true });
		try {
			let res = await shoppingCartApi.update({ ID: id, Enable: false });
			if (res.status == 200) {
				getShoppingCartData();
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'loading', loading: false });
		}
	};

	const increseItem = async (id, quantity) => {
		setIsLoading({
			status: 'CHANGE_QUANTITY',
			loading: true
		});
		try {
			let res = await shoppingCartApi.update({ ID: id, Quantity: quantity + 1, Enable: true });
			if (res.status == 200) {
				getShoppingCartDataNoLoading();
			}
		} catch (error) {
		} finally {
			setIsLoading({
				status: 'CHANGE_QUANTITY',
				loading: false
			});
		}
	};

	const decreseItem = async (id, quantity) => {
		setIsLoading({
			status: 'CHANGE_QUANTITY',
			loading: true
		});
		try {
			let res = await shoppingCartApi.update(
				quantity == 1 ? { ID: id, Enable: false } : { ID: id, Quantity: quantity - 1, Enable: true }
			);
			if (res.status == 200) {
				getShoppingCartDataNoLoading();
			}
		} catch (error) {
		} finally {
			setIsLoading({
				status: 'CHANGE_QUANTITY',
				loading: false
			});
		}
	};

	const renderCartItems = () => {
		return cartItems?.map((item, index) => (
			<div className=" cart__item d-flex justify-content-between align-items-center row" key={index}>
				<div className="cart__item-img col-3">
					<img src={item.ImageThumbnails.length ? item.ImageThumbnails : '/images/logo-thumnail.jpg'} alt="img course"></img>
				</div>
				<div className="cart__item-detail d-none d-sm-inline-block col-sm-3 mt-3 mb-3 mt-sm-0 mb-sm-0">
					<h5>{item.VideoCourseName}</h5>
				</div>
				<div className="cart__item-action d-none d-sm-inline-block d-none d-sm-inline-block col-sm-2">
					<span
						className="quantity-btn"
						onClick={() => {
							decreseItem(item.ID, item.Quantity), setClickedItem(item.ID);
						}}
					>
						-
					</span>
					<span className="cart__item-quantity font-weight-green">
						{isLoading.status == 'CHANGE_QUANTITY' && isLoading.loading && clickedItem == item.ID ? (
							<Spin size="small" />
						) : (
							item.Quantity
						)}
					</span>
					<span
						className="quantity-btn"
						onClick={() => {
							increseItem(item.ID, item.Quantity), setClickedItem(item.ID);
						}}
					>
						+
					</span>
				</div>
				<div className="cart__item-price d-none d-sm-inline-block col-sm-2">
					<p className="font-weight-primary">{numberWithCommas(item.Price * item.Quantity)} VND</p>
				</div>
				<div className="cart__item-remove d-none d-sm-inline-block col-sm-1">
					<DeleteItem onDelete={() => deleteItem(item.ID)} />
				</div>
				<div className="col-8 d-sm-none">
					<div className="cart__item-detail col-12 col-sm-3 mt-3  mt-sm-0 mb-sm-0">
						<h5>{item.VideoCourseName}</h5>
					</div>
					<div className="cart__item-price col-12 col-sm-2">
						<p className="font-weight-primary">{numberWithCommas(item.Price * item.Quantity)} VND</p>
					</div>
					<div className="row mt-3">
						<div className="cart__item-action pl-5 col-8 col-sm-2">
							<span
								className="quantity-btn"
								onClick={() => {
									decreseItem(item.ID, item.Quantity), setClickedItem(item.ID);
								}}
							>
								-
							</span>
							<span className="cart__item-quantity font-weight-green">
								{isLoading.status == 'CHANGE_QUANTITY' && isLoading.loading && clickedItem == item.ID ? (
									<Spin size="small" />
								) : (
									item.Quantity
								)}
							</span>
							<span
								className="quantity-btn"
								onClick={() => {
									increseItem(item.ID, item.Quantity), setClickedItem(item.ID);
								}}
							>
								+
							</span>
						</div>
						<div className="cart__item-remove col-4 col-sm-1">
							<DeleteItem onDelete={() => deleteItem(item.ID)} />
						</div>
					</div>
				</div>
			</div>
		));
	};

	const menuDropdown = () => {
		return (
			<>
				<div className="menu__dropdown d-inline-block d-md-none" style={{ width: 300 }}>
					<div className="d-inline-block d-md-none ">
						<Search
							onChange={(event) => {}}
							name="CourseSearch"
							placeholder="Tìm khóa học"
							className="style-input mb-3"
							allowClear
							enterButton={<SearchOutlined />}
							size="large"
						/>
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
				</div>
			</>
		);
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
	}, []);

	return (
		<div>
			<header>
				<div className="shopping__cart-header justify-content-between align-items-center row">
					<div className="header__logo col-6 col-md-3">
						<Link href="/">
							<a href="#">
								<img className="logo-img" src="/images/logo-final.jpg" alt="logo branch"></img>
							</a>
						</Link>
					</div>
					<div className="header__profile col-2 col-md-3">
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

			<div className="shopping__cart-body container mt-5">
				<h1>Giỏ Hàng</h1>
				{isLoading.loading && isLoading.status == 'GET_CART_DATA' ? (
					<Skeleton active />
				) : (
					<div className="shopping__cart-content row mt-3 mb-3 align-items-start">
						<div className="shopping__cart-items col-12 col-lg-8">{renderCartItems()}</div>
						<div className="shopping__cart-total col-12 col-lg-4 mt-5 mt-md-0 mb-3">
							<div className="row">
								<h5 className="col-5">Tổng cộng: </h5>
								<h5 className="font-weight-primary col-7">
									{numberWithCommas(cartItems?.reduce((a, b) => Number(a) + Number(b.Price * b.Quantity), 0))}
									<span className="ml-2">VND</span>
								</h5>
							</div>
							<Link href="/cart/check-out">
								<button className="btn btn-primary w-100">Thanh toán</button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default ShoppingCart;
