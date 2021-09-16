import React, { useEffect, useRef, useState } from "react";

import {
  Popover,
  Card,
  Divider,
  Drawer,
  Form,
  Select,
  Input,
  Affix,
} from "antd";
import TitlePage from "~/components/Elements/TitlePage";
import { Info, Bookmark } from "react-feather";

import CreateExamForm from "~/components/Global/QuestionBank/CreateExamForm";
import { dataExam } from "~/lib/question-bank/dataExam";
import LayoutBase from "~/components/LayoutBase";
import { useRouter } from "next/router";
import { examDetailApi, examTopicApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const ExamDetail = () => {
  const { showNoti } = useWrap();
  const [tabActive, setTabActive] = useState(0);
  const router = useRouter();
  const examID = parseInt(router.query.slug as string);
  const [dataExamDetail, setDataExamDetail] = useState([]);
  const [examTopicDetail, setExamTopicDetail] = useState<IExamTopic>();

  const getExamDetail = async () => {
    try {
      let res = await examDetailApi.getAll(examID);
      if (res.status == 200) {
        setDataExamDetail(res.data.data);
      }
    } catch (error) {
      showNoti("danger", error);
    }
  };

  const getExamTopicDetail = async () => {
    try {
      let res = await examTopicApi.getByID(examID);
      if (res.status == 200) {
        setExamTopicDetail(res.data.data);
      }
    } catch (error) {
      showNoti("danger", error);
    }
  };

  console.log("Data Exam: ", dataExam);
  console.log("Exam topic detail: ", examTopicDetail);

  const getTabActive = (e) => {
    e.preventDefault();
    console.log(e.target);
    let tab = e.target.parentElement.getAttribute("data-index");
    setTabActive(tab);
  };

  useEffect(() => {
    getExamTopicDetail();
    getExamDetail();
  }, []);

  const content = (
    <div className="question-bank-info">
      <ul className="list">
        <li className="list-item mb-0">
          <span className="list-title">Chương trình</span>
          <span className="list-text">{examTopicDetail?.ProgramName}</span>
        </li>
        <li className="list-item">
          <span className="list-title">Môn học:</span>
          <span className="list-text">{examTopicDetail?.SubjectName}</span>
        </li>
        <li className="list-item">
          <span className="list-title">Loại câu hỏi:</span>
          <span className="list-text">{examTopicDetail?.TypeName}</span>
        </li>

        <li className="list-item mb-0">
          <span className="list-title">Thời gian:</span>
          <span className="list-text">{examTopicDetail?.Time} phút</span>
        </li>
      </ul>
    </div>
  );

  return (
    // <div className="question-create">
    //   <TitlePage title="Tạo đề thi" />

    //   <div className="row">
    //     <div className="col-md-9 col-12">
    //       <Card
    //         className="card-detail-exam"
    //         title={
    //           <div className="title-question-bank">
    //             <h3 className="title-big">
    //               <Bookmark /> {examTopicDetail?.Name}
    //             </h3>
    //             <Popover
    //               content={content}
    //               trigger="hover"
    //               placement="bottomLeft"
    //             >
    //               <ul className="list-detail-question">
    //                 <li>
    //                   <span className="icon-detail-question">
    //                     <Info />
    //                   </span>
    //                 </li>
    //                 <li>
    //                   <span className="title">Môn học:</span>
    //                   <span className="text">
    //                     {examTopicDetail?.SubjectName}
    //                   </span>
    //                 </li>
    //                 <li>
    //                   <span className="title">Thời gian:</span>
    //                   <span className="text">{examTopicDetail?.Time} phút</span>
    //                 </li>
    //               </ul>
    //             </Popover>
    //           </div>
    //         }
    //         extra={<CreateExamForm isEdit={true} />}
    //       >
    //         <div className="question-list">
    //           <div className="question-item">
    //             <div className="box-title">
    //               <span className="title-ques">Câu hỏi 1</span>
    //               <p className="title-text">
    //                 It is a long established fact that a reader will be
    //                 distracted by the readable content of a page when looking at
    //                 its layout.
    //               </p>
    //             </div>
    //             <div className="box-answer">
    //               <ul className="list-answer">
    //                 <li>
    //                   <span className="tick">A</span>
    //                   <span className="ans">Đáp án</span>
    //                 </li>
    //               </ul>
    //             </div>
    //           </div>
    //         </div>
    //       </Card>
    //     </div>
    //     <div className="col-md-3 col-12 fixed-card">
    //       <Card
    //         className="card-exam-bank"
    //         title="DS rút gọn"
    //         extra={<CreateExamForm isEdit={false} />}
    //       >
    //         <ul className="list-exam-bank">
    //           <li>
    //             <a href="#" onClick={getTabActive} data-index={1}>
    //               <span className="number">1/</span>
    //               <span className="text">Đề thi số 1</span>
    //             </a>
    //           </li>
    //         </ul>
    //       </Card>
    //     </div>
    //   </div>
    // </div>
    <>Trang này hiện vẫn chưa hoàn thiện</>
  );
};
ExamDetail.layout = LayoutBase;
export default ExamDetail;
