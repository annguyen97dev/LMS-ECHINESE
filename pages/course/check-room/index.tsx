import WrapFilter from "~/components/Global/CheckRoom/WrapFilter";
import React, { useState } from "react";
import { Card } from "antd";
import LayoutBase from "~/components/LayoutBase";

const CheckRoom = () => {
  const [showFilter, showFilterSet] = useState(false);

  const funcShowFilter = () => {
    showFilter ? showFilterSet(false) : showFilterSet(true);
  };
  return (
    <div className="row">
      <div className="col-12">
        <Card title="Kiểm tra phòng">
          <WrapFilter showFilter={showFilter} />
        </Card>
      </div>
    </div>
  );
};

CheckRoom.layout = LayoutBase;
export default CheckRoom;
