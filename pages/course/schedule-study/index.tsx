import React from "react";
import { Card } from "antd";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import events from "../../../lib/create-course/events";
import CheckOneStudyTime from "~/components/Global/ScheduleStudy/CheckOneStudyTime";
import CheckManyStudyTime from "~/components/Global/ScheduleStudy/CheckManyStudyTime";
import CheckRoom from "~/components/Global/ScheduleStudy/CheckRoom";
import CalendarManyTeacher from "~/components/Global/ScheduleStudy/CalendarManyTeacher";
import CheckEmptyTeacher from "~/components/Global/ScheduleStudy/CheckEmptyTeacher";
import { useWrap } from "~/context/wrap";
import LayoutBase from "~/components/LayoutBase";
const localizer = momentLocalizer(moment);

const ScheduleStudy = () => {
  const { getTitlePage } = useWrap();

  getTitlePage("Kiểm tra lịch học");
  return (
    <div className="row">
      <div className="col-12">
        <Card
          extra={
            <div className="card-list-btn">
              <CheckOneStudyTime />
              <CheckManyStudyTime />
              <CheckRoom />
              <CheckEmptyTeacher />
              <CalendarManyTeacher />
            </div>
          }
        >
          <div className="wrap-calendar">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
ScheduleStudy.layout = LayoutBase;
export default ScheduleStudy;
