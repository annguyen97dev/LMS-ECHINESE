import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import styles from './RegisterForm.module.scss';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import { Spin } from 'antd';
import { userApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import { CheckCircleOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/client';

enum roles {
	user = 'user',
	admin = 'admin',
	moderator = 'moderator'
}
type Inputs = {
	text: string;
	textRequired: string;
};
interface RegisterInputs {
	FullNameUnicode: Inputs;
	Email: Inputs;
	Mobile: Inputs;
}

interface dataNewAccount {
	FullNameUnicode: string;
	Email: string;
	Mobile: string;
}

function RegisterForm(props) {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		reset
	} = useForm<RegisterInputs>();

	const [loading, setLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const { showNoti } = useWrap();

	const _Submit = async (data: dataNewAccount) => {
		setLoading(true);

		try {
			let res = await userApi.createAccount(data);
			if (res.status === 200) {
				setIsSuccess(true);
				const dataLogin = {
					username: data.Email,
					password: '123456'
				};
				handleLogin(dataLogin);
				localStorage.setItem('isNewUser', 'true');
			} else {
				showNoti('danger', 'Đường truyền mạng đang không ổn định');
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	const handleLogin = (data) => {
		signIn('credentials-signin', {
			...data,
			callbackUrl: router.query?.callbackUrl ?? '/'
		});
	};

	const moveToSignIn = (e) => {
		e.preventDefault();
		router.push('/auth/signin');
	};

	useEffect(() => {
		return () => {};
	}, []);

	// console.log(watch("username"));
	// console.log(watch("password"));
	/* "handleSubmit" will validate your inputs before invoking "onSubmit" */
	return (
		<>
			<Toaster position="top-center" />
			<div className={styles.container}>
				<div className={styles.wrapBox}>
					<div className={styles.wrapForm}>
						<form onSubmit={handleSubmit(_Submit)} className={`${styles.loginForm}`}>
							{!isSuccess && <h6 className={styles.title}>Đăng ký</h6>}
							{!isSuccess ? (
								<>
									<div className="form-control-input">
										<label className={styles.fcontrol}>Họ và tên</label>
										<input
											name="FullNameUnicode"
											placeholder="Nhập họ và tên"
											defaultValue=""
											{...register('FullNameUnicode', { required: true })}
										/>
										{errors.FullNameUnicode && <span className={styles.errorText}>Hãy điền tên đăng nhập</span>}
									</div>

									<div className="form-control-input">
										<label className={styles.fcontrol}>Email</label>
										<input
											name="Email"
											placeholder="Nhập Email"
											defaultValue=""
											{...register('Email', { required: true })}
										/>
										{errors.Email && <span className={styles.errorText}>Hãy điền email</span>}
									</div>

									<div className="form-control-input">
										<label className={styles.fcontrol}>Số điện thoại</label>
										<input
											type="number"
											name="Mobile"
											defaultValue=""
											{...register('Mobile', { required: true })}
											placeholder="Nhập số điện thoại"
										/>
										{errors.Mobile && <span className={styles.errorText}>Hãy điền số điện thoại</span>}
									</div>
									<div className={styles.boxSubmit}>
										<input type="submit" value={'Đăng ký'} />
										{loading && <Spin className="loading-login" />}
									</div>
									<div className={styles.boxSignup}>
										Bạn đã có tài khoản?{' '}
										<a href="" onClick={moveToSignIn}>
											Đăng nhập
										</a>
									</div>
								</>
							) : (
								<div className="success-reset mt-3">
									<CheckCircleOutlined />
									<p className="success-text">Tạo tài khoản thành công! </p>
									<p className="move-text">Hệ thống sẽ tự đăng nhập sau 2s...</p>
								</div>
							)}
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default RegisterForm;
