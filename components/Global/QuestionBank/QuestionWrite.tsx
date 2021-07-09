import React from "react";
import { Tooltip } from "antd";

import { Trash2 } from "react-feather";
import CreateQuestionForm from "~/components/Global/QuestionBank/CreateQuestionForm";

const QuestionWrite = () => {
  return (
    <>
      <div className="question-item">
        <div className="box-detail">
          <div className="box-title">
            <span className="title-ques">Câu hỏi 1</span>
            <p className="title-text">
              Jack's father is a farmer, he 55 years old and he work in
              <span className="input-show-text">Company</span>.
            </p>
          </div>
          <div className="box-answer">
            <div className="question-single question-wrap w-100"></div>
          </div>
        </div>
        <div className="box-action">
          <Tooltip placement="topLeft" title="Sửa câu hỏi">
            <CreateQuestionForm isEdit={true} />
          </Tooltip>
          <Tooltip placement="topLeft" title="Xóa câu hỏi">
            <button className="btn btn-icon delete">
              <Trash2 />
            </button>
          </Tooltip>
          {/* <div className="d-block">
            <p className="text-center note-type-question">Điền từ</p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default QuestionWrite;
