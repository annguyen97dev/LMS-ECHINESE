import React, { useEffect, useState } from "react";
import { Radio, Tooltip, Skeleton } from "antd";
import { Info, Bookmark, Edit, Trash2 } from "react-feather";
import CreateQuestionForm from "~/components/Global/QuestionBank/CreateQuestionForm";
import EditQuestionForm from "./EditQuestionForm";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";

const listAlphabet = ["A", "B", "C", "D", "F", "G"];

const QuestionSingle = (props: any) => {
  const { listQuestion, loadingQuestion, onFetchData } = props;
  const [value, setValue] = React.useState(1);
  const [dataListQuestion, setDataListQuestion] = useState(listQuestion);

  console.log("List Question: ", listQuestion);

  const onChange = (e) => {
    e.preventDefault();
    console.log("radio checked", e.target.value);

    // setValue(e.target.value);
  };

  useEffect(() => {
    setDataListQuestion(listQuestion);
  }, [listQuestion]);

  return (
    <>
      {dataListQuestion?.map((item, index) => (
        <div className="question-item" key={index}>
          <div className="box-detail">
            <div className="box-title">
              <span className="title-ques">Câu hỏi {index + 1}</span>
              <div className="title-text">{ReactHtmlParser(item.Content)}</div>
            </div>
            <div className="box-answer">
              <div className="question-single question-wrap w-100">
                {item.ExerciseAnswer?.map((ans, i) => (
                  <Radio
                    defaultChecked={ans.isTrue}
                    key={i}
                    className="d-block"
                    value={ans.ID}
                    onChange={onChange}
                    disabled={ans.isTrue ? false : true}
                  >
                    <span className="tick">{listAlphabet[i]}</span>
                    <span className="text">{ans.AnswerContent}</span>
                  </Radio>
                ))}
              </div>
            </div>
          </div>
          <div className="box-action">
            <Tooltip placement="topLeft" title="Sửa câu hỏi">
              <CreateQuestionForm
                questionData={item}
                onFetchData={onFetchData}
              />
            </Tooltip>
            <Tooltip placement="topLeft" title="Xóa câu hỏi">
              <button className="btn btn-icon delete">
                <Trash2 />
              </button>
            </Tooltip>
          </div>
        </div>
      ))}
      {loadingQuestion && (
        <div>
          <Skeleton />
        </div>
      )}
    </>
  );
};

export default QuestionSingle;
