import { Card, Divider } from "antd";
import React from "react";
import { data } from "~/lib/invoice/data";
import ReactHtmlParser from 'react-html-parser';

const InvoiceForm = (props) => {
  return (
    <div className="container-fluid d-flex justify-content-center w-50">
      <Card title={<h4>{props.title}</h4>} className="card-invoice">
        {/*  */}
        <div className="row">
          <div className="col-6">
              {ReactHtmlParser(props.data)}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceForm;
