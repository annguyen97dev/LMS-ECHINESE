import React, { useRef, useState } from "react";

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

const content = (
  <div className="question-bank-info">
    <ul className="list">
      <li className="list-item">
        <span className="list-title">Môn học:</span>
        <span className="list-text">English</span>
      </li>
      <li className="list-item">
        <span className="list-title">Loại môn học:</span>
        <span className="list-text">Phát âm</span>
      </li>
      <li className="list-item">
        <span className="list-title">Loại câu hỏi:</span>
        <span className="list-text">Câu hỏi nhóm</span>
      </li>
      <li className="list-item">
        <span className="list-title">Mức độ:</span>
        <span className="list-text">Rất khó</span>
      </li>
      <li className="list-item mb-0">
        <span className="list-title">Học kỳ:</span>
        <span className="list-text">học kỳ II</span>
      </li>
      <li className="list-item mb-0">
        <span className="list-title">Thời gian:</span>
        <span className="list-text">60 phút</span>
      </li>
    </ul>
  </div>
);

const ExamDetail = () => {
  const [tabActive, setTabActive] = useState(0);

  const getTabActive = (e) => {
    e.preventDefault();
    console.log(e.target);
    let tab = e.target.parentElement.getAttribute("data-index");
    setTabActive(tab);
  };

  return (
    <div className="question-create">
      <TitlePage title="Tạo đề thi" />

      <div className="row">
        <div className="col-md-9 col-12">
          <Card
            className="card-detail-exam"
            title={
              <div className="title-question-bank">
                <h3 className="title-big">
                  <Bookmark /> Đề thi tốt nghiệp
                </h3>
                <ul className="list-detail-question">
                  <li>
                    <Popover
                      content={content}
                      trigger="hover"
                      placement="rightBottom"
                    >
                      <span className="icon-detail-question">
                        <Info />
                      </span>
                    </Popover>
                  </li>
                  <li>
                    <span className="title">Môn học:</span>
                    <span className="text">English</span>
                  </li>
                  <li>
                    <span className="title">Mức độ:</span>
                    <span className="text">Trung bình</span>
                  </li>
                  <li>
                    <span className="title">Thời gian:</span>
                    <span className="text">60 phút</span>
                  </li>
                </ul>
              </div>
            }
            extra={<CreateExamForm isEdit={true} />}
          >
            <div className="question-list">
              <div className="question-item">
                <div className="box-title">
                  <span className="title-ques">Câu hỏi 1</span>
                  <p className="title-text">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout.
                  </p>
                </div>
                <div className="box-answer">
                  <ul className="list-answer">
                    <li>
                      <span className="tick">A</span>
                      <span className="ans">Đáp án</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-md-3 col-12 fixed-card">
          <Card
            className="card-exam-bank"
            title="DS rút gọn"
            extra={<CreateExamForm isEdit={false} />}
          >
            <ul className="list-exam-bank">
              <li>
                <a href="#" onClick={getTabActive} data-index={1}>
                  <span className="number">1/</span>
                  <span className="text">Đề thi số 1</span>
                </a>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
ExamDetail.layout = LayoutBase;
export default ExamDetail;
