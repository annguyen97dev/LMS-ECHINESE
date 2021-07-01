import { Card, Select, DatePicker, Input, Form } from "antd";
import ActionTable from "~/components/ActionTable";
import SearchBox from "~/components/Elements/SearchBox";

import SortBox from "~/components/Elements/SortBox";

import React, { useState } from "react";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import CourseListContent from "~/components/Global/CourseList/CourseListContent";
import Link from "next/link";
import ScheduleRoom from "~/components/Global/CourseList/ScheduleRoom";
import ScheduleTeacher from "~/components/Global/CourseList/ScheduleTeacher";
import TitlePage from "~/components/Elements/TitlePage";
import FilterBase from "~/components/FilterBase";
import LayoutBase from "~/components/LayoutBase";

const dataOption = [
  {
    text: "Option 1",
    value: "option 1",
  },
  {
    text: "Option 2",
    value: "option 2",
  },
  {
    text: "Option 3",
    value: "option 3",
  },
];

const CourseList = () => {
  return (
    <div className="course-list-page">
      <div className="row">
        <div className="col-12">
          <TitlePage title="Danh sách khóa học" />

          <div className="wrap-table">
            <Card
              title={
                <div className="list-action-table">
                  <FilterTable />
                  <SortBox dataOption={dataOption} />
                </div>
              }
              extra={
                <div className="list-btn">
                  <ScheduleRoom />
                  <ScheduleTeacher />
                </div>
              }
            >
              <div className="course-list-content">
                <CourseListContent />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

CourseList.layout = LayoutBase;
export default CourseList;
