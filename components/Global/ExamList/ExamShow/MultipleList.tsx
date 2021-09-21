import React from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { Radio, Tooltip, Skeleton, Popconfirm, Spin, Checkbox } from "antd";

const MultipleList = (props) => {
  const { dataQuestion, listAlphabet, listQuestionID } = props;
  // console.log("Data Question List: ", dataQuestion);

  const returnPosition = (quesID) => {
    let index = listQuestionID.indexOf(quesID);
    let text = "Câu " + (index + 1).toString();
    return text;
  };

  return (
    <>
      {dataQuestion.ExerciseTopic.map((ques, ind) => (
        <div className={`question-item`} key={ind}>
          <div className="box-detail">
            <div className="box-title">
              <span className="title-ques">
                {returnPosition(ques.ExerciseID)}
              </span>
              {/* {returnAudio(item)} */}
              <div className="title-text">{ReactHtmlParser(ques.Content)}</div>
            </div>
            <div className="box-answer">
              <div className="question-single question-wrap w-100">
                {ques.ExerciseAnswer?.map((ans, i) => (
                  // <div className="d-flex align-items-center" key={i}>
                  //   <Radio
                  //     key={i}
                  //     value={ans.ID}
                  //     onChange={(e) => e.preventDefault()}
                  //     disabled={true}
                  //   ></Radio>
                  //   <div>
                  //     <span className="tick">{listAlphabet[i]}</span>
                  //     <span className="text">{ans.AnswerContent}</span>
                  //   </div>
                  // </div>
                  <Checkbox
                    className="d-block"
                    key={i}
                    onChange={(e) => e.preventDefault()}
                    disabled={true}
                  >
                    <span className="tick">{listAlphabet[i]}</span>
                    <span className="text">{ans.AnswerContent}</span>
                  </Checkbox>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MultipleList;
