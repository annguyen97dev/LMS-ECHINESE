import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import styles from './LoginForm.module.scss';

import { useRouter } from 'next/router';
import { Spin } from 'antd';
import Link from 'next/link';
import GoogleLogin from 'react-google-login';
import _ from '~/appConfig';

type Inputs = {
	text: string;
	textRequired: string;
};

interface LoginInputs {
	username: Inputs;
	password: Inputs;
}

function index(props: any) {
	const {
		register,
		handleSubmit,
		watch,

		formState: { errors }
	} = useForm<LoginInputs>();
	// const { loading, setLoading } = useState();
	const router = useRouter();

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Load the required SDK asynchronously for facebook, google and linkedin
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
				appId: '4898676230192926',
				cookie: true, // enable cookies to allow the server to access the session
				xfbml: true, // parse social plugins on this page
				version: 'v2.8' // use version 2.1
			});
		};
		return () => {};
	}, []);

	const facebookLogin = () => {
		/*window.FB.login(
            this.checkLoginState(), 
            { scope : 'email, public_profile' } //Add scope whatever you need about the facebook user
        ); */

		// @ts-ignore
		window.FB.login(function (resp) {
			console.log('resp: ', resp);
		});
	};

	const _Submit = async (data: {}) => {
		setLoading(true);
		props?.onSubmit(data);
	};

	const moveToSignUp = (e) => {
		e.preventDefault();
		router.push('/account/register');
	};

	const handleGoogleLogin = (param) => {
		console.log('handleGoogleLogin: ', param);

		setLoading(true);
		props?.onGoogleLogin({ ...param, type: 'google', username: param.profileObj.email, password: '123456' });
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
									validate: (value) => {
										//@ts-ignore
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

							{/* <div className="wrap-google-login">
								<GoogleLogin
									clientId={_.googleCredentials}
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
							<div className="wrap-google-login">
								<div
									onClick={facebookLogin}
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										paddingTop: 2,
										backgroundColor: 'red'
									}}
								>
									<i className="fab fa-google" style={{ fontSize: 20, marginRight: 8 }}></i> Google
								</div>
							</div> */}

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
