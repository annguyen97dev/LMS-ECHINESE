import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import LayoutBase from '~/components/LayoutBase';

const ProductDetails = (props) => {
	const router = useRouter();
	console.log(router.query);
	return <>HEELLOO</>;
};

ProductDetails.layout = LayoutBase;
export default ProductDetails;
