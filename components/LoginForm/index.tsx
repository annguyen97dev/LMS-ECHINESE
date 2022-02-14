import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import styles from './LoginForm.module.scss';

import { useRouter } from 'next/router';
import { Spin } from 'antd';
import Link from 'next/link';

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
		return () => {};
	}, []);

	const _Submit = async (data: {}) => {
		setLoading(true);
		props?.onSubmit(data);
	};

	const moveToSignUp = (e) => {
		e.preventDefault();
		router.push('/account/register');
	};

	return (
		<>
			<div className={styles.container}>
				<div className={styles.wrapBox}>
					{/* <div className={styles.imgLogin}>
            <img src="/images/symbol-login.jpg" alt="" />
          </div> */}
					<div className={styles.wrapForm}>
						<form onSubmit={handleSubmit(_Submit)} className={`${styles.loginForm}`}>
							<div className={styles.loginFormImg}>
								<img src="/images/logo.jpg" alt="" />
							</div>
							<h6 className={styles.title}>Đăng nhập</h6>

							{/* <div className={styles.boxSocial}>
                <ul>
                  <li>
                    <a href="">
                      <img src="/images/google.png" alt="" />
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <img src="/images/facebook.png" alt="" />
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <img src="/images/twitter.png" alt="" />
                    </a>{" "}
                  </li>
                </ul>
              </div>

              <div className={styles.noteLogin}>
                <p>Hoặc đăng nhập với tên đăng nhập</p>
              </div> */}

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
									}
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
								{/* <div className={styles.checkbox}>
                  <input type="checkbox" id="check" name="check" value="" />

                  <label htmlFor="check">
                    <span> </span>Nhớ mật khẩu
                  </label>
                </div> */}

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

							<div className={styles.boxSignup}>
								Bạn chưa có tài khoản?{' '}
								<a href="" onClick={moveToSignUp}>
									Đăng kí
								</a>
							</div>

							<div className="mt-4 text-center">Username: admin / Pass: 123456</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default index;
