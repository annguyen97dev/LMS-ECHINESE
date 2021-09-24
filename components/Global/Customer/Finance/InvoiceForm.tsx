import {Card} from 'antd';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';

const InvoiceForm = (props) => {
	return (
		<div>
			<Card title={<h4>{props.title}</h4>} className="card-invoice">
				<div className="row">
					<div className="col-12">{ReactHtmlParser(props.data)}</div>
				</div>
			</Card>
		</div>
	);
};

export default InvoiceForm;
