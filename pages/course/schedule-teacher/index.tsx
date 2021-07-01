import React from "react";
import WrapFilter from "~/components/Global/ScheduleTeacher";
import { Card } from "antd";
import LayoutBase from "~/components/LayoutBase";
const ScheduleTeacher = () => {
  return (
    <div className="row">
      <div className="col-12">
        <Card title="Xem lịch giáo viên">
          <WrapFilter />
        </Card>
      </div>
    </div>
  );
};
ScheduleTeacher.layout = LayoutBase;
export default ScheduleTeacher;
