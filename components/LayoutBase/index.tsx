import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Layout from './layout';
import LoadingLayout from './LoadingLayout';

const LayoutBase = ({ children }) => {
	const [session, loading] = useSession();

	// Get path and slug
	const router = useRouter();
	// ---------------------
	useEffect(() => {
		if (loading || !session) return;
		let checkNewUser = localStorage.getItem('isNewUser');

		if (checkNewUser === 'true') {
			router.push('/change-password');
		}
	}, [loading, session]);

	if (loading) {
		return <LoadingLayout />;
	}

	if (!session) {
		signIn();
		return <LoadingLayout />;
	}

	return <Layout>{children}</Layout>;
};

export default LayoutBase;
