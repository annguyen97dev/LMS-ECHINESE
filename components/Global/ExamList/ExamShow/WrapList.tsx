import React from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";

const WrapList = (props) => {
  const { children, dataQuestion, listQuestionID } = props;
  console.log("List question ID: ", listQuestionID);

  const returnSpaceQuestion = (data) => {
    let indexStart = listQuestionID.indexOf(data[0].ExerciseID);
    let indexEnd = listQuestionID.indexOf(data[data.length - 1].ExerciseID);

    let text =
      "Câu " + (indexStart + 1).toString() + " - " + (indexEnd + 1).toString();
    return <p className="space-question">{text}</p>;
  };

  return (
    <>
      {dataQuestion?.ExerciseGroupID !== 0 ? (
        <div className="wrap-group-list">
          <div className="content">
            <h6 className="content-title">Đọc đoạn văn và trả lời câu hỏi</h6>
            {returnSpaceQuestion(dataQuestion?.ExerciseTopic)}
            {dataQuestion.LinkAudio !== "" && (
              <audio controls>
                <source src={dataQuestion.LinkAudio} type="audio/mpeg" />
              </audio>
            )}

            {ReactHtmlParser(dataQuestion?.Content)}
          </div>
          {dataQuestion?.Paragraph && (
            <div className="paragraph">
              {ReactHtmlParser(dataQuestion?.Paragraph)}
            </div>
          )}
          <>{React.cloneElement(children)}</>
        </div>
      ) : (
        <>{React.cloneElement(children)}</>
      )}
    </>
  );
};

export default WrapList;
