import { Tabs } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
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
import DocumentCourse from "~/components/Global/CourseList/CourseListDetail/DocumentCourse";
import Exam from "~/components/Global/CourseList/CourseListDetail/Exam";
import Exercise from "~/components/Global/CourseList/CourseListDetail/Exercise";
import RollUp from "~/components/Global/CourseList/CourseListDetail/RollUp/RollUp";
import StudentsList from "~/components/Global/CourseList/CourseListDetail/StudentList/StudentList";
import Comment from "./Comment/Comment";
import CourseDetailCalendar from "./CourseDetailCalendar/CourseDetailCalendar";
import NotificationCourse from "./NotificationCourse/NotificationCourse";

const { TabPane } = Tabs;
const CourseListDetail = () => {
  const router = useRouter();
  const { slug: ID } = router.query;
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div className="course-dt page-no-scroll">
      <Tabs
        tabPosition="right"
        onChange={(activeKey) => {
          if (parseInt(activeKey) === 2) {
            router.push(`/course/course-list/edit-course/${ID}`);
          }
          setActiveTab(+activeKey);
        }}
      >
        <TabPane
          tab={
            <>
              <Calendar />
              <span title="tab-title"> Schedule</span>
            </>
          }
          key="1"
        >
          {activeTab === 1 && <CourseDetailCalendar />}
        </TabPane>
        <TabPane
          tab={
            <>
              <Edit />
              <span title="tab-title"> Edit</span>
            </>
          }
          key="2"
        ></TabPane>
        <TabPane
          tab={
            <>
              <Book />
              <span title="tab-title"> Students List</span>
            </>
          }
          key="3"
        >
          {activeTab === 3 && <StudentsList />}
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
          <Comment courseID={parseInt(router.query.slug as string)} />
        </TabPane>
        <TabPane
          tab={
            <>
              <Bell />
              <span title="tab-title"> Thông báo</span>
            </>
          }
          key="9"
        >
          <NotificationCourse
            courseID={parseInt(router.query.slug as string)}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CourseListDetail;
