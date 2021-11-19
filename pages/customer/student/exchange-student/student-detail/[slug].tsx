import React from 'react';
import ProfileCustomer from '~/components/Profile/ProfileCustomer/ProfileCustomer';
import LayoutBase from '~/components/LayoutBase';
import { useRouter } from 'next/router';

const CustomerDetail = () => {
	const router = useRouter();
	const slug = router.query.slug;

	return <ProfileCustomer id={slug} />;
};

CustomerDetail.layout = LayoutBase;
export default CustomerDetail;
