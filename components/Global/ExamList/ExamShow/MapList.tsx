import React from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";

const MapList = (props) => {
  const { dataQuestion, listAlphabet, listQuestionID } = props;

  // console.log("Data Question in map list: ", dataQuestion);

  return (
    <>
      <h6 className="font-italic mb-3 mt-4">Tích chọn đáp án đúng</h6>

      <table className="table-question w-100" style={{ maxWidth: "100%" }}>
        <thead>
          <tr>
            <th>Câu hỏi</th>
            {dataQuestion?.ExerciseTopic.map((item, index) =>
              item.ExerciseAnswer.map((ans, ansIndex) => (
                <th className="text-center" key={ansIndex}>
                  {ans.AnswerContent}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {dataQuestion?.ExerciseTopic.map((item, index) => (
            <tr key={index}>
              <td className="w-50"> {ReactHtmlParser(item.Content)}</td>
              {dataQuestion?.ExerciseTopic.map((itemQues, indexQues) =>
                itemQues.ExerciseAnswer.map((ans, ansIndex) => (
                  <td className="text-center" key={ansIndex}></td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MapList;
