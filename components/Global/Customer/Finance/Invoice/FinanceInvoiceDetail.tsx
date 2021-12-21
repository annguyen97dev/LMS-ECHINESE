import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { invoiceApi } from '~/apiBase';
import InvoiceVoucherLayout from '~/components/Global/Customer/Finance/InvoiceVoucher/InvoiceVoucherLayout';
import { useWrap } from '~/context/wrap';

const FinanceInvoiceDetail = () => {
	const router = useRouter();
	const slug = router.query.slug;
	const [templateString, setTemplateString] = useState(null);
	const { showNoti } = useWrap();

	const getInvoice = async () => {
		try {
			let res = await invoiceApi.export(slug);
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
		getInvoice();
	}, []);

	return <InvoiceVoucherLayout title="Phiếu thu" templateString={templateString} />;
};

export default FinanceInvoiceDetail;
