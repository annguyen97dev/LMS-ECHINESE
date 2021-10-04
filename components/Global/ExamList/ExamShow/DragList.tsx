import React from "react";

const DragList = (props) => {
  const { dataQuestion, listAlphabet, listQuestionID } = props;

  // console.log("Data question in drag: ", dataQuestion);

  return (
    <div className="drag-list">
      <h6 className="font-italic mb-3 mt-4">Kéo đáp án vào ô thích hợp</h6>
      {dataQuestion?.ExerciseTopic.map((item, index) =>
        item.ExerciseAnswer.map((ans, indexAns) => (
          <div className="drag-list-answer" key={indexAns}>
            <span>{ans.AnswerContent}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default DragList;
