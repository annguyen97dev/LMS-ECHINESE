import React from "react";
import { Checkbox, Tooltip } from "antd";
import { Info, Bookmark, Edit, Trash2 } from "react-feather";
import CreateQuestionForm from "~/components/Global/QuestionBank/CreateQuestionForm";

const QuestionMultiple = () => {
  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
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
            <div className="question-wrap question-multiple">
              <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <Checkbox className="d-block" value="A">
                      <span className="tick">A.</span>
                      <span className="text">Đáp án 1</span>
                    </Checkbox>
                    <Checkbox className="d-block" value="B">
                      <span className="tick">B.</span>
                      <span className="text">Đáp án 1</span>
                    </Checkbox>
                  </div>
                  <div className="col-md-6 col-12">
                    <Checkbox className="d-block" value="C">
                      <span className="tick">C.</span>
                      <span className="text">Đáp án 1</span>
                    </Checkbox>
                    <Checkbox className="d-block" value="D">
                      <span className="tick">D.</span>
                      <span className="text">Đáp án 1</span>
                    </Checkbox>
                  </div>
                </div>
              </Checkbox.Group>
            </div>
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
        </div>
      </div>
    </>
  );
};

export default QuestionMultiple;
