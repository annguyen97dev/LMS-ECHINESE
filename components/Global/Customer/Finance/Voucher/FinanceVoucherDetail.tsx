import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {voucherApi} from '~/apiBase';
import InvoiceVoucherLayout from '~/components/Global/Customer/Finance/InvoiceVoucher/InvoiceVoucherLayout';
import {useWrap} from '~/context/wrap';

const FinanceVoucherDetail = () => {
	const router = useRouter();
	const slug = router.query.slug;
	const [templateString, setTemplateString] = useState(null);
	const {showNoti} = useWrap();

	const getVoucher = async () => {
		try {
			let res = await voucherApi.export(slug);
			if (res.status === 200) {
				setTemplateString(res.data.data);
			}
			if (res.status === 204) {
				showNoti('danger', 'Không có dữ liệu');
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	useEffect(() => {
		getVoucher();
	}, []);

	return (
		<InvoiceVoucherLayout title="Phiếu chi" templateString={templateString} />
	);
};

export default FinanceVoucherDetail;
