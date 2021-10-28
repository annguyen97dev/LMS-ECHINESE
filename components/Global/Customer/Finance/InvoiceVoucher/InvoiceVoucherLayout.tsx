import { Card, Spin } from 'antd';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { invoiceApi, voucherApi } from '~/apiBase';
import { useDebounce } from '~/context/useDebounce';
import { useWrap } from '~/context/wrap';
InvoiceVoucherLayout.propTypes = {
	title: PropTypes.string,
	templateString: PropTypes.string
};
InvoiceVoucherLayout.defaultProps = {
	title: '',
	templateString: ''
};
function InvoiceVoucherLayout(props) {
	const router = useRouter();
	const { type, slug: id } = router.query;
	const { title, templateString } = props;
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState(false);
	const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement => input !== null && input.tagName === 'IFRAME';

	const onPrint = () => {
		const contentEl = document.getElementById('selector-print');
		const printEl = document.getElementById('iframe-print');
		if (isIFrame(printEl) && printEl.contentWindow) {
			const print = printEl.contentWindow;
			print.document.open();
			print.document.write(contentEl.innerHTML);
			print.document.close();
			print.focus();
			print.print();
		}
	};

	const onSendMail = async () => {
		try {
			setIsLoading(true);
			if (!type || !id) return;
			let res;
			if (type === 'invoice') {
				res = await invoiceApi.sendMail(id);
			}
			if (type === 'voucher') {
				res = await voucherApi.sendMail(id);
			}
			if (res?.status === 200) {
				showNoti('success', 'Gửi mail thành công');
			} else {
				showNoti('danger', 'Gửi mail thất bại');
			}
		} catch (error) {
			console.log('onSendMail', error.message);
		} finally {
			setIsLoading(false);
		}
	};
	const onSendMailDebounce = useDebounce(onSendMail, 500, []);
	return (
		<div>
			<Card
				title={<h4>{title}</h4>}
				className="card-invoice"
				extra={
					<>
						<button className="btn btn-success mr-1" disabled={isLoading} onClick={onSendMailDebounce}>
							Gửi Email {isLoading && <Spin className="loading-base" />}
						</button>
						<button className="btn btn-warning" onClick={onPrint}>
							In
						</button>
					</>
				}
			>
				<div className="row">
					<div className="col-12">
						<div id="selector-print">{ReactHtmlParser(templateString)}</div>
						<iframe
							id="iframe-print"
							style={{
								display: 'none'
							}}
						></iframe>
					</div>
				</div>
			</Card>
		</div>
	);
}

export default InvoiceVoucherLayout;
