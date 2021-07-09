import React, { useState } from "react";
import { Radio, Tooltip } from "antd";
import { Info, Bookmark, Edit, Trash2 } from "react-feather";
import CreateQuestionForm from "~/components/Global/QuestionBank/CreateQuestionForm";
import EditQuestionForm from "./EditQuestionForm";

const QuestionSingle = () => {
  const [value, setValue] = React.useState(1);

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <>
      <div className="question-item">
        <div className="box-detail">
          <div className="box-title">
            <span className="title-ques">Câu hỏi 1</span>
            <p className="title-text">
              Jack's father is a farmer, he 55 years old and he work in ...
              company
            </p>
          </div>
          <div className="box-answer">
            <div className="question-single question-wrap w-100">
              <Radio.Group className="w-100" onChange={onChange} value={value}>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <Radio className="d-block" value={1}>
                      <span className="tick">A.</span>
                      <span className="text">Đáp án 1</span>
                    </Radio>
                    <Radio className="d-block" value={2}>
                      <span className="tick">B.</span>
                      <span className="text">Đáp án 2</span>
                    </Radio>
                  </div>
                  <div className="col-md-6 col-12">
                    <Radio className="d-block" value={3}>
                      <span className="tick">C.</span>
                      <span className="text">Đáp án 3</span>
                    </Radio>
                    <Radio className="d-block" value={4}>
                      <span className="tick">D.</span>
                      <span className="text">Đáp án 4</span>
                    </Radio>
                  </div>
                </div>
              </Radio.Group>
            </div>
          </div>
        </div>
        <div className="box-action">
          <Tooltip placement="topLeft" title="Sửa câu hỏi">
            <EditQuestionForm />
          </Tooltip>
          <Tooltip placement="topLeft" title="Xóa câu hỏi">
            <button className="btn btn-icon delete">
              <Trash2 />
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default QuestionSingle;
