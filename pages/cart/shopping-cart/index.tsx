import React, { useState, useEffect } from 'react';
import { Input, Skeleton, Dropdown, Card } from 'antd';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';
import { UserOutlined, RedoOutlined, LogoutOutlined, LoginOutlined, FormOutlined, EllipsisOutlined } from '@ant-design/icons';
import Notifiaction from '../../../components/Header/notification';
import { Popover } from 'antd';
import { User } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { shoppingCartApi } from '~/apiBase/shopping-cart/shopping-cart';
import { numberWithCommas } from '~/utils/functions';
import { SearchOutlined } from '@ant-design/icons';

const ShoppingCart = () => {
	const [session, loading] = useSession();
	const [dataUser, setDataUser] = useState<IUser>();
	const { titlePage, userInformation } = useWrap();
	const [cartItems, setCartItems] = useState<IShoppingCart[]>();
	const [dropDownVisible, setDropDownVisible] = useState(false);
	console.log(dropDownVisible);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});
	const { Search } = Input;

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
		setIsLoading({ status: 'loading', loading: true });
		try {
			let res = await shoppingCartApi.getAll();
			if (res.status == 200) {
				setCartItems(res.data.data);
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
				<div className="cart__item-img col-6 col-sm-3">
					<Link href="/">
						<a href="#">
							<img src={item.ImageThumbnails.length ? item.ImageThumbnails : '/images/cat-ben.jpg'} alt="img course"></img>
						</a>
					</Link>
				</div>
				<div className="cart__item-action d-inline-block d-sm-none col-6 col-sm-3">
					<p>Xóa</p>
					<p>Lưu xem sau</p>
					<p>Thêm vào yêu thích</p>
				</div>
				<div className="cart__item-detail col-12 col-sm-4 mt-3 mb-3 mt-sm-0 mb-sm-0">
					<h5>{item.VideoCourseName}</h5>
					{/* <p>Tạo bởi: Dr. Angele Yu</p> */}
					{/* <div className="detail__hours">
						<span>21 giờ học</span>
						<span>240 bài học</span>
						<span>Trung cấp</span>
					</div> */}
				</div>
				<div className="cart__item-action d-none d-sm-inline-block col-12 col-sm-3">
					<p>Xóa</p>
					<p>Lưu xem sau</p>
					<p>Thêm vào yêu thích</p>
				</div>
				<div className="cart__item-price col-12 col-sm-2">
					<p className="font-weight-green">{numberWithCommas(item.Price)} vnd</p>
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

									{/* <div className="user-name-mobile">
									<User />
								</div> */}
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
								{' '}
								<img className="logo-img" src="/images/logo-final.jpg" alt="logo branch"></img>
							</a>
						</Link>
					</div>
					<div className="header__search d-none d-md-inline-block col-md-5">
						<Input onChange={(event) => {}} name="CourseSearch" placeholder="Tìm khóa học" className="style-input" />
					</div>
					<div className="header__profile col-2 col-md-3">
						<div className="col-setting">
							<ul className="col-setting-list">
								<li className="notification d-none d-md-inline-block">
									<Notifiaction />
								</li>
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
			<div className="shopping__cart-body container mt-5">
				<h1>Giỏ Hàng</h1>
				{isLoading.loading ? (
					<Skeleton active />
				) : (
					<div className="shopping__cart-content row mt-3 mb-3 align-items-start">
						<div className="shopping__cart-items col-12 col-lg-8">{renderCartItems()}</div>
						<div className="shopping__cart-total col-12 col-lg-4 mt-5 mt-md-0 mb-3">
							<h4>Tổng cộng: </h4>
							<h1 className="font-weight-green">
								{numberWithCommas(cartItems?.reduce((a, b) => Number(a) + Number(b.Price), 0))}
								vnd
							</h1>
							<Link href="/cart/check-out">
								<button className="btn btn-primary w-100">Thanh toán</button>
							</Link>
							<p>Mã khuyến mãi</p>
							<Search
								onChange={(event) => {}}
								name="Promotions"
								placeholder="Nhập mã khuyến mãi"
								className="input-promo"
								allowClear
								enterButton="Áp dụng"
								size="large"
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default ShoppingCart;
