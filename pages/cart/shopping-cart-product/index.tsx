import {
	EllipsisOutlined,
	FormOutlined,
	LoginOutlined,
	LogoutOutlined,
	RedoOutlined,
	SearchOutlined,
	UserOutlined
} from '@ant-design/icons';
import { Dropdown, Input, Popover, Skeleton, Form, Spin, Modal } from 'antd';
import { signIn, signOut, useSession } from 'next-auth/client';
import Link from 'next/link';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { orderProductApi } from '~/apiBase/product/order-product';
import { orderProductDetail } from '~/apiBase/product/order-product-detail';
import { shoppingCartApi } from '~/apiBase/shopping-cart/shopping-cart';
import QuantityOfItems from '~/components/Global/Option/shopping-cart/QuantityOfItems';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';
import DeleteItem from './../../../components/Tables/DeleteItem';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SelectField from '~/components/FormControl/SelectField';
import { branchApi } from '~/apiBase';

let returnSchema = {};
let schema = null;

const paymentMethods = [
	{ value: 1, title: 'Tiền mặt' },
	{ value: 2, title: 'Chuyển khoản' }
];

const ShoppingCartProduct = () => {
	const [session, loading] = useSession();
	const [dataUser, setDataUser] = useState<IUser>();
	const { userInformation, pageSize } = useWrap();
	const [cartItems, setCartItems] = useState<IOrderProductCart[]>();
	const [dropDownVisible, setDropDownVisible] = useState(false);
	const [clickedItem, setClickedItem] = useState(null);
	const [branch, setBranch] = useState(null);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});
	const [isDisabledPayButton, setIsDisabledPayButton] = useState(false);

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
			let res = await orderProductDetail.getByToken();
			if (res.status == 200) {
				setCartItems(res.data.data);
				if (res.data.data.length === 0) {
					setIsDisabledPayButton(true);
				}
			}
			if (res.status == 204) {
				setCartItems([]);
				setIsDisabledPayButton(true);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'GET_CART_DATA', loading: false });
		}
	};

	const getShoppingCartDataNoLoading = async () => {
		try {
			let res = await orderProductDetail.getByToken();
			if (res.status == 200) {
				setCartItems(res.data.data);
				if (res.data.data.length === 0) {
					setIsDisabledPayButton(true);
				}
			}
			if (res.status == 204) {
				setCartItems([]);
				setIsDisabledPayButton(true);
			}
		} catch (error) {
		} finally {
		}
	};

	const deleteItem = async (id) => {
		setIsLoading({ status: 'loading', loading: true });
		try {
			let res = await orderProductDetail.update({ ID: id, Enable: false });
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
			let res = await orderProductDetail.update({ ID: id, Quantity: quantity + 1, Enable: true });
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
			let res = await orderProductDetail.update(
				quantity == 1 ? { ID: id, Quantity: 1, Enable: true } : { ID: id, Quantity: quantity - 1, Enable: true }
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

	const handleCancelCart = async () => {
		try {
			let res = await orderProductDetail.cancelOrder();
			if (res.status === 200) {
				router.push('/stationery');
			}
		} catch (error) {}
	};

	const handleOrderProduct = async () => {
		try {
			let res = await orderProductApi.insert({
				PayBranchID: 1043,
				PaymentMethodsID: 1
			});
		} catch (error) {
		} finally {
		}
	};

	const renderCartItems = () => {
		return cartItems?.map((item, index) => (
			<div className="cart__item d-flex justify-content-between align-items-center row" key={index}>
				<div
					onClick={() =>
						router.push({
							pathname: '/stationery/[slug]',
							query: item
						})
					}
					className="cart__item-img"
				>
					<img src={item.Image || '/images/logo-thumnail.jpg'} alt="img course"></img>
				</div>

				<div className="cart__item-detail d-none d-sm-inline-block mt-sm-0 mb-sm-0">
					<h5>{item.ProductName}</h5>
				</div>

				<div className="cart__item-action d-none d-sm-inline-block d-none d-sm-inline-block col-sm-2">
					{/* Render quantity button */}
					<QuantityOfItems
						item={item}
						index={index}
						decreseItem={decreseItem}
						increseItem={increseItem}
						setClickedItem={setClickedItem}
					/>
				</div>

				<div className="cart__item-price d-none d-sm-inline-block">
					<p className="font-weight-primary">{numberWithCommas(item.Price * item.Quantity)} VND</p>
				</div>

				<div className="cart__item-remove d-none d-sm-inline-block col-sm-1">
					<DeleteItem onDelete={() => deleteItem(item.ID)} />
				</div>
				<div className="col-8 d-sm-none">
					<div className="cart__item-detail col-12 col-sm-3 mt-3  mt-sm-0 mb-sm-0">
						<h5>{item.ProductName}</h5>
					</div>

					<div className="cart__item-price">
						<p className="font-weight-primary">{numberWithCommas(item.Price * item.Quantity)} VND</p>
					</div>

					<div className="row mt-3">
						<div className="cart__item-action pl-5 col-8 col-sm-2">
							{/* Render quantity button */}
							<QuantityOfItems
								item={item}
								index={index}
								decreseItem={decreseItem}
								increseItem={increseItem}
								setClickedItem={setClickedItem}
							/>
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
		getBranch();
	}, []);

	const defaultValueInit = {
		PayBranchID: null,
		PaymentMethodsID: null,
		PaymentMethodsName: null
	};

	(function returnSchemaFunc() {
		returnSchema = { ...defaultValueInit };
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'PayBranchID':
					returnSchema[key] = yup.string().required('Bạn không được để trống');
					break;
				case 'PaymentMethodsID':
					returnSchema[key] = yup.string().required('Bạn không được để trống');
					break;

				default:
					// returnSchema[key] = yup.mixed().required("Bạn không được để trống");
					break;
			}
		});

		schema = yup.object().shape(returnSchema);
	})();

	const form = useForm({
		defaultValues: defaultValueInit,
		resolver: yupResolver(schema)
	});

	const [isVisible, setIsVisible] = useState(false);

	const _onSubmit = async (data) => {
		console.log(data);
		setIsLoading({ status: 'SUBMIT', loading: true });
		try {
			let res = await orderProductApi.insert({
				PayBranchID: Number(data.PayBranchID),
				PaymentMethodsID: Number(data.PaymentMethodsID),
				PaymentMethodsName: data.PaymentMethodsName
			});
			if (res.status === 200) {
				router.push({ pathname: '/stationery' });
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'SUBMIT', loading: false });
		}
	};

	const getBranch = async () => {
		try {
			let res = await branchApi.getAll({ pageIndex: 1, pageSize: pageSize });
			if (res.status === 200) {
				let temp = [];
				console.log(res.data.data);
				res.data.data.forEach((item) => temp.push({ value: item.ID, title: item.BranchName }));
				setBranch(temp);
			}
		} catch (error) {}
	};

	return (
		<div>
			<Modal
				footer={null}
				visible={isVisible}
				onCancel={() => {
					setIsVisible(false);
				}}
				title="Xác nhận thanh toán"
			>
				<Form onFinish={form.handleSubmit(_onSubmit)} layout="vertical">
					<div className="row">
						<div className="col-12">
							<SelectField form={form} name="PayBranchID" label="Trung tâm" optionList={branch} />
						</div>
						<div className="col-12">
							<SelectField
								form={form}
								name="PaymentMethodsID"
								label="Phương thức thanh toán"
								optionList={paymentMethods}
								onChangeSelect={(value) => {
									if (value === 1) {
										form.setValue('PaymentMethodsName', 'Tiền mặt');
									} else if (value === 2) {
										form.setValue('PaymentMethodsName', 'Chuyển khoản');
									}
								}}
							/>
						</div>
						<div className="col-12 justify-content-center align-items-center">
							<button
								className="btn btn-primary w-100"
								type="submit"
								disabled={isLoading.status === 'SUBMIT' && isLoading.loading}
							>
								Đặt hàng
							</button>
						</div>
					</div>
				</Form>
			</Modal>
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
				<div className="d-flex justify-content-between">
					<h1>Giỏ Hàng</h1>
					<button
						className="btn btn-primary"
						onClick={() => {
							router.push('/stationery');
						}}
					>
						Mua sắm thêm
					</button>
				</div>
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
							<button
								disabled={isDisabledPayButton}
								onClick={() => {
									setIsVisible(true);
								}}
								className="btn btn-primary w-100"
							>
								Đặt hàng
							</button>
							{/* <Link href="/cart/check-out">
							</Link> */}
							<p className="shopping__cart-cancel" onClick={handleCancelCart}>
								Hủy giỏ hàng
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default ShoppingCartProduct;
