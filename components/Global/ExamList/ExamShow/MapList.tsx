import React from "react";

const MapList = (props) => {
  const { dataQuestion, listAlphabet, listQuestionID } = props;

  const returnPosition = (quesID) => {
    let index = listQuestionID.indexOf(quesID);
    let text = "Câu " + (index + 1).toString();
    return text;
  };
  return <div></div>;
};

export default MapList;
