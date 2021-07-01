import React from "react";

import Widget from "./Widget";

const ChartCard = ({ prize, title, children, styleName, percent }) => {
  return (
    <div className="style-card">
      <Widget styleName="gx-card-full">
        <div className="row">
          <div className="col-12">
            <h6>{title}</h6>
          </div>
        </div>
        <div className="row ">
          <div className="col-6">
            <h4>{prize}</h4>
          </div>
          <div className="col-6 d-flex align justify-content-start align-items-center">
            <b>
              <span
                className={`gx-mb-0 gx-ml-2 gx-pt-xl-2 gx-fs-lg gx-chart-${styleName}`}
              >
                {percent}% <i className={`fas fa-angle-${styleName}`}></i>
              </span>
            </b>
          </div>
        </div>
        {children}
      </Widget>
    </div>
  );
};

export default ChartCard;
