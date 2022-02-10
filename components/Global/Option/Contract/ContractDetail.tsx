import { useRouter } from 'next/router';
import React from 'react';

const ContractDetail = () => {
	const router = useRouter();
	const slug = router.query.slug;
	return <p>Hợp đồng: {slug}</p>;
};

export default ContractDetail;
