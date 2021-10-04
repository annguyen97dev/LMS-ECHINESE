import {Card} from 'antd';
import React, {useRef} from 'react';
import ReactHtmlParser from 'react-html-parser';
import PropTypes from 'prop-types';
InvoiceVoucherLayout.propTypes = {
	title: PropTypes.string,
	templateString: PropTypes.string,
};
InvoiceVoucherLayout.defaultProps = {
	title: '',
	templateString: '',
};
function InvoiceVoucherLayout(props) {
	const {title, templateString} = props;

	const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
		input !== null && input.tagName === 'IFRAME';

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

	return (
		<div>
			<Card
				title={<h4>{title}</h4>}
				className="card-invoice"
				extra={
					<>
						<button className="btn btn-success mr-1">Gửi Email</button>
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
								display: 'none',
							}}
						></iframe>
					</div>
				</div>
			</Card>
		</div>
	);
}

export default InvoiceVoucherLayout;
