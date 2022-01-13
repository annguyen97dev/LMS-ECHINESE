import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { branchApi, studentApi } from '~/apiBase';
import { shoppingCartApi } from '~/apiBase/shopping-cart/shopping-cart';
import ResetPassStudent from '~/components/Global/Customer/Student/ResetPassStudent';
import { useWrap } from '~/context/wrap';

const SuccessCheckout = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState({ type: '', status: false });
	const [statuPayment, setStatuPayment] = useState<IStatusPayment>(null);
	const { userInformation, pageSize } = useWrap();
	const [branchInfo, setBranchInfo] = useState<IBranch[]>(null);

	console.log(branchInfo);

	const getStatus = async () => {
		if (router.query.type === 'cashpayment' || router.query.type === 'transferpayment') {
			setStatuPayment({ ...statuPayment, StatusName: 'Thành công, hệ thống đã tiếp nhận đơn hàng và đang đợi xác nhận!', Status: 2 });
		} else if (router.query.type === 'paypal') {
			setIsLoading({ type: 'GET_ALL', status: true });
			try {
				let res = await shoppingCartApi.getPaypalStatus({ PayerID: router.query.PayerID, guid: router.query.guid });
				if (res.status === 200) {
					setStatuPayment(res.data.data);
				}
			} catch (err) {
			} finally {
				setIsLoading({ type: 'GET_ALL', status: false });
			}
		} else {
			setIsLoading({ type: 'GET_ALL', status: true });
			try {
				let res = await shoppingCartApi.getPaymentStatus(router.query.paymentcode);
				if (res.status === 200) {
					setStatuPayment(res.data.data);
				}
			} catch (err) {
			} finally {
				setIsLoading({ type: 'GET_ALL', status: false });
			}
		}
	};

	const getBranchInfo = async () => {
		try {
			let res = await branchApi.getAll({ pageIndex: 1, pageSize: pageSize });
			if (res.status === 200) {
				setBranchInfo(res.data.data);
			}
		} catch (error) {
		} finally {
		}
	};

	useEffect(() => {
		getStatus();
	}, [router.query.type]);

	useEffect(() => {
		getBranchInfo();
	}, []);

	return (
		<div className="success__checkout">
			<div className="success__checkout-content">
				<div className="success__checkout-logo d-flex justify-content-center">
					{statuPayment && statuPayment.Status === 2 && <img src="/images/checked-success.svg" alt="check icon" />}
					{statuPayment && statuPayment.Status === 3 && <img src="/images/checked-fail.svg" alt="check icon" />}
				</div>
				<div className="success__checkout-text">
					{statuPayment && statuPayment.Status === 2 && (
						<>
							<h3 className="font-weight-green text-center">{statuPayment && statuPayment.StatusName}</h3>
							<p className="text-center">
								Mọi thắc mắc xin liên hệ Email: <span>{branchInfo && branchInfo[0].Email}</span> hoặc số điện thoại{' '}
								<span>{branchInfo && branchInfo[0].Phone}</span>
							</p>
						</>
					)}
					{statuPayment && statuPayment.Status === 3 && (
						<>
							<h3 className="font-weight-primary text-center">{statuPayment && statuPayment.StatusName}</h3>
							<p className="text-center">
								Mọi thắc mắc xin liên hệ Email: <span>{branchInfo && branchInfo[0].Email}</span> hoặc số điện thoại{' '}
								<span>{branchInfo && branchInfo[0].Phone}</span>
							</p>
						</>
					)}
				</div>
				<div className="success__checkout-btn  d-flex justify-content-center ">
					<button
						onClick={() => {
							router.push('/');
						}}
						className="btn btn-primary mr-1"
					>
						Quay lại trang chủ
					</button>
					<button
						onClick={() => {
							router.push('/video-course-student');
						}}
						className="btn btn-warning ml-1"
					>
						Xem đơn hàng
					</button>
				</div>
			</div>
		</div>
	);
};

export default SuccessCheckout;
