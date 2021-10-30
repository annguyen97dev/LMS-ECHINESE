import React, { useState } from 'react';
import ProfileBase from '~/components/Profile';
import LayoutBase from '~/components/LayoutBase';
import { useSession } from 'next-auth/client';

const ProFileStaff = () => {
	const [fileList, setFileList] = useState([]);
	const [session, loading] = useSession();

	let dataUser = null;

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

	if (session !== undefined) {
		let token = session.accessToken;
		dataUser = parseJwt(token);
	}

	return <ProfileBase dataUser={dataUser} />;
};

ProFileStaff.layout = LayoutBase;
export default ProFileStaff;
