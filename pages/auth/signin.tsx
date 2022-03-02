import React, { useEffect, useState } from 'react';
import { signIn, getProviders } from 'next-auth/client';
import { useRouter } from 'next/router';
import LoginForm from '~/components/LoginForm';
import { useWrap } from '~/context/wrap';
import AuthLayout from '~/components/AuthLayout';
import { Console } from 'console';
import { getTypeURL } from '~/utils/functions';

function SignIn({ providers, csrfToken }) {
	const { showNoti } = useWrap();
	const router = useRouter();
	const [haveError, setHaveError] = useState('');

	useEffect(() => {
		if (router.query?.error) {
			const { error } = router.query;
			const erData = JSON.parse(error.toString().split('Error:')[0]);
			switch (erData.status) {
				case 200:
					showNoti('success', 'Đăng nhập thành công');
					break;
				case 400:
					showNoti('danger', 'Tên đăng nhập hoặc mật khẩu không đúng');
					setHaveError(erData.message);
					break;
				case 404:
					console.log('Không truy cập được API');
					break;
				case 500:
					console.log('Lỗi API');
				default:
					console.log(JSON.stringify(erData));
					break;
			}
		}
		return () => {};
	}, []);

	const [currentUrl, setCurrentUrl] = useState('');

	useEffect(() => {
		setCurrentUrl(window.location.href);
	}, []);

	const _Submit = (data) => {
		let type = getTypeURL(currentUrl);
		signIn('credentials-signin', {
			...data,
			callbackUrl:
				type == 'LOCALHOST'
					? 'http://localhost:3009'
					: type == 'DEMO'
					? 'https://app.echinese.vn'
					: 'https://echinese-dev.herokuapp.com',
			redirect: true
		});
	};

	return (
		<>
			<LoginForm onSubmit={_Submit} csrfToken={csrfToken} error={haveError} />
		</>
	);
}

SignIn.layout = AuthLayout;

export default SignIn;

export async function getServerSideProps(context) {
	const providers = await getProviders();
	return {
		props: { providers }
	};
}
