import React from "react";

const DragList = (props) => {
  const { dataQuestion, listAlphabet, listQuestionID } = props;

  return (
    <div className="drag-list">
      <h6 className="font-italic mb-3 mt-4">Kéo đáp án vào ô thích hợp</h6>
      {dataQuestion?.ExerciseTopic.map((item, index) => (
        <div className="drag-list-answer">
          {item.ExerciseAnswer[0].AnswerContent}
        </div>
      ))}
    </div>
  );
};

export default DragList;
