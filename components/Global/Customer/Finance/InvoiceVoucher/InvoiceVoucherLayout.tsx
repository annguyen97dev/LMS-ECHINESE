import {Card} from 'antd';
import React from 'react';
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
	const onPrint = () => {
		window.print();
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
					<div className="col-12">{ReactHtmlParser(templateString)}</div>
				</div>
			</Card>
		</div>
	);
}

export default InvoiceVoucherLayout;
