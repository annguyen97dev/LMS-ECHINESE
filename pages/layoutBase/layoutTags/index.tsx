import React from "react";
import { Card } from "antd";
import LayoutBase from "~/components/LayoutBase";
const layoutTags = () => {
  return (
    <div className="layout-tags">
      <div className="row">
        <div className="col-12">
          <Card title="List Tags">
            <div className="row-tags">
              <span className="tag green">Active</span>
              <span className="tag red">Active</span>
              <span className="tag gray">Active</span>
              <span className="tag blue">Active</span>
              <span className="tag yellow">Active</span>
              <span className="tag black">Active</span>
              <div className="tag blue-weight">Active</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

layoutTags.layout = LayoutBase;
export default layoutTags;
