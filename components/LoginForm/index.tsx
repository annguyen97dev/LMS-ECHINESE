import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './LoginForm.module.scss';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import Link from 'next/link';
import GoogleLogin from 'react-google-login';

type Inputs = {
	text: string;
	textRequired: string;
};

interface LoginInputs {
	username: Inputs;
	password: Inputs;
}

// SOCIAL LOGIN
const _GGID = '390876628477-6boo4bsj7pijjkebp9lji2aeq422qhfh.apps.googleusercontent.com'; // Client Secret: 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
const _GGID_NEW = '286438363258-ilh01tlojsmeq1fgb8mpcvv4iqrcd5rn.apps.googleusercontent.com';
const _FBID = '444447504039960';

function index(props: any) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm<LoginInputs>();

	const router = useRouter();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Load the required SDK
		(function (d, s, id) {
			var js,
				fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s);
			js.id = id;
			js.src = '//connect.facebook.net/en_US/sdk.js';
			fjs.parentNode.insertBefore(js, fjs);
		})(document, 'script', 'facebook-jssdk');

		// @ts-ignore
		window.fbAsyncInit = function () {
			// @ts-ignore
			window.FB.init({
				appId: _FBID,
				cookie: true,
				xfbml: true,
				version: 'v2.8'
			});
		};
		return () => {};
	}, []);

	const facebookLogin = () => {
		// @ts-ignore
		window.FB.login(function (resp) {
			if (resp?.status == 'connected') {
				setLoading(true);
				props?.onSubmit({
					tokenId: resp?.authResponse?.accessToken,
					type: 'facebook',
					isSocial: true,
					username: resp?.authResponse?.userID,
					password: '123456'
				});
			}
		});
	};

	const _Submit = async (data: any) => {
		setLoading(true);
		props?.onSubmit(data);
	};

	const moveToSignUp = (e) => {
		e.preventDefault();
		router.push('/account/register');
	};

	const handleGoogleLogin = (param) => {
		setLoading(true);
		props?.onSubmit({ ...param, type: 'google', isSocial: true, username: param.profileObj.email, password: '123456' });
	};

	return (
		<>
			<div className={styles.container}>
				<div className={styles.wrapBox}>
					<div className={styles.wrapForm}>
						<form onSubmit={handleSubmit(_Submit)} className={`${styles.loginForm}`}>
							<div className={styles.loginFormImg}>
								<img src="/images/logo.jpg" alt="" />
							</div>
							<h6 className={styles.title}>Đăng nhập</h6>
							<input name="csrfToken" type="hidden" defaultValue={props?.csrfToken} />
							<label className={styles.fcontrol}>Tên đăng nhập</label>
							<input
								name="username"
								defaultValue=""
								{...register('username', {
									required: true,
									validate: (value: any) => {
										return !!value.trim();
									},
									setValueAs: (value) => value.trim()
								})}
								placeholder="Enter user name"
							/>
							{errors.username && <span className="form-error">Hãy điền tên đăng nhập</span>}
							<label className={styles.fcontrol}>Mật khẩu</label>
							<input
								name="password"
								type="password"
								defaultValue=""
								{...register('password', { required: true })}
								placeholder="Enter password"
							/>
							{errors.password && <span className="form-error">Hãy điền mật khẩu</span>}
							<div className="mt-2 d-flex justify-content-end">
								<div className={styles.forgetPass}>
									<Link href="/reset-password">
										<a>Quên mật khẩu?</a>
									</Link>
								</div>
							</div>
							<div className="position-relative">
								<input type="submit" value={'Đăng nhập'} />
								{loading && <Spin className="loading-login" />}
								<div className="w-100 m-1 text-center color-red fw-bold">{props.error && props.error}</div>
							</div>
							<div className="row m-0 p-0 social-login">
								<div className="wrap-google-login">
									<GoogleLogin
										clientId={_GGID_NEW}
										onSuccess={handleGoogleLogin}
										onFailure={(e) => console.log(e)}
										style={{ borderRadius: 999, backgroundColor: 'red' }}
										icon={false}
									>
										<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 2 }}>
											<i className="fab fa-google" style={{ fontSize: 20, marginRight: 8 }}></i> Google
										</div>
									</GoogleLogin>
								</div>
								<div className="wrap-google-facebook">
									<div onClick={facebookLogin}>
										<i className="fab fa-facebook-f" style={{ fontSize: 20, marginRight: 8 }}></i> Facebook
									</div>
								</div>
							</div>
							<div className={styles.boxSignup}>
								Bạn chưa có tài khoản?{' '}
								<a href="" onClick={moveToSignUp}>
									Đăng kí
								</a>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default index;
