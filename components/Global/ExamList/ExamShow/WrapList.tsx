import React from "react";

const WrapList = (props) => {
  const { children, dataQuestion } = props;
  console.log("Data question: ", dataQuestion);
  return (
    <>
      {dataQuestion?.ExerciseGroupID !== 0 ? (
        <div className="wrap-group-list">
          <div className="content">{dataQuestion?.Content}</div>
          <div className="paragraph">{dataQuestion?.Paragrapgh}</div>
          <>{React.cloneElement(children)}</>
        </div>
      ) : (
        <>{React.cloneElement(children)}</>
      )}
    </>
  );
};

export default WrapList;
