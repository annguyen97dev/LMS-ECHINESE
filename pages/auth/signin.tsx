import React, { useEffect, useState } from 'react';
import { providers, signIn, csrfToken, getProviders } from 'next-auth/client';
import { useRouter } from 'next/router';
import LoginForm from '~/components/LoginForm';
import { useWrap } from '~/context/wrap';
import AuthLayout from '~/components/AuthLayout';

function SignIn({ providers, csrfToken }) {
	const { showNoti } = useWrap();
	const router = useRouter();
	const [haveError, setHaveError] = useState('');
	// console.log("Csrf token: ", csrfToken);

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
			// router.replace("/", undefined, { shallow: true });
		}
		return () => {};
	}, []);
	const _Submit = (data) => {
		console.log('data', data);
		signIn('credentials-signin', {
			...data,
			callbackUrl: router.query?.callbackUrl ?? '/'
		});
	};

	console.log('Object: ', Object);

	return (
		<>
			<LoginForm onSubmit={_Submit} onGoogleLogin={_Submit} csrfToken={csrfToken} error={haveError} />
		</>
	);
}

SignIn.layout = AuthLayout;

export default SignIn;

export async function getServerSideProps(context) {
	const providers = await getProviders();
	console.log('providers', providers);
	return {
		props: { providers }
	};
}
