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
import DocumentCourse from "~/components/Global/CourseList/CourseListDetail/Document/DocumentCourse";
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
              <span title="tab-title"> Lịch học</span>
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
              <span title="tab-title"> Chỉnh sửa</span>
            </>
          }
          key="2"
        ></TabPane>
        <TabPane
          tab={
            <>
              <Book />
              <span title="tab-title"> Học viên</span>
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
              <span title="tab-title"> Điểm danh</span>
            </>
          }
          key="4"
        >
          <RollUp courseID={parseInt(router.query.slug as string)} />
        </TabPane>
        <TabPane
          tab={
            <>
              <Activity />
              <span title="tab-title"> Nhập điểm</span>
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
              <span title="tab-title"> Bài tập</span>
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
              <span title="tab-title"> Tài liệu</span>
            </>
          }
          key="7"
        >
          <DocumentCourse courseID={parseInt(router.query.slug as string)} />
        </TabPane>
        <TabPane
          tab={
            <>
              <Flag />
              <span title="tab-title"> Phản hồi</span>
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
