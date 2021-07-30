import React, { useState } from "react";
import { Card, Select, Avatar, Tabs, Affix } from "antd";
import {
  UserOutlined,
  DeploymentUnitOutlined,
  WhatsAppOutlined,
  MailOutlined,
  AimOutlined,
} from "@ant-design/icons";

import LayoutBase from "~/components/LayoutBase";
import {
  Activity,
  Bell,
  Book,
  BookOpen,
  Calendar,
  CheckCircle,
  Edit,
  FileText,
  Flag,
} from "react-feather";
import StudentsList from "~/components/Global/CourseList/CourseListDetail/StudentsList";
import RollUp from "~/components/Global/CourseList/CourseListDetail/RollUp";
import Exam from "~/components/Global/CourseList/CourseListDetail/Exam";
import Exercise from "~/components/Global/CourseList/CourseListDetail/Exercise";
import DocumentCourse from "~/components/Global/CourseList/CourseListDetail/DocumentCourse";
import Comment from "~/components/Global/CourseList/CourseListDetail/Comment";
import NotificationCourse from "~/components/Global/CourseList/CourseListDetail/NotificationCourse";

const CourseListDetail = () => {
  const { TabPane } = Tabs;

  return (
    <div className="page-no-scroll">
      <Tabs tabPosition="right">
        <TabPane
          tab={
            <>
              <Calendar />
              <span title="tab-title"> Schedule</span>
            </>
          }
          key="1"
        >
          Content of Schedule
        </TabPane>
        <TabPane
          tab={
            <>
              <Edit />
              <span title="tab-title"> Edit</span>
            </>
          }
          key="2"
        >
          Content of Edit
        </TabPane>
        <TabPane
          tab={
            <>
              <Book />
              <span title="tab-title"> Students List</span>
            </>
          }
          key="3"
        >
          <StudentsList />
        </TabPane>
        <TabPane
          tab={
            <>
              <CheckCircle />
              <span title="tab-title"> Roll Up</span>
            </>
          }
          key="4"
        >
          <RollUp />
        </TabPane>
        <TabPane
          tab={
            <>
              <Activity />
              <span title="tab-title"> Exam</span>
            </>
          }
          key="5"
        >
          <Exam />
        </TabPane>
        <TabPane
          tab={
            <>
              <BookOpen />
              <span title="tab-title"> Exercise</span>
            </>
          }
          key="6"
        >
          <Exercise />
        </TabPane>
        <TabPane
          tab={
            <>
              <FileText />
              <span title="tab-title"> Document</span>
            </>
          }
          key="7"
        >
          <DocumentCourse />
        </TabPane>
        <TabPane
          tab={
            <>
              <Flag />
              <span title="tab-title"> Comment</span>
            </>
          }
          key="8"
        >
          <Comment />
        </TabPane>
        <TabPane
          tab={
            <>
              <Bell />
              <span title="tab-title"> Notification</span>
            </>
          }
          key="9"
        >
          <NotificationCourse />
        </TabPane>
      </Tabs>
    </div>
  );
};

CourseListDetail.layout = LayoutBase;
export default CourseListDetail;
