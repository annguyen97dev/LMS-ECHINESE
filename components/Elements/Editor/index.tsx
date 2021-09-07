import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./Editor"), {
  ssr: false,
});

const Editor = (props) => {
  const {
    handleChange,
    deleteSingleQuestion,
    isReset,
    questionContent,
    addQuestion,
    deleteAllQuestion,
    exerciseList,
  } = props;

  return (
    <div className="summernote-style">
      <DynamicComponentWithNoSSR
        exerciseList={exerciseList}
        addQuestion={(inputID) => addQuestion(inputID)}
        getDataEditor={(value) => handleChange(value)} // Get content with string type
        deleteSingleQuestion={(quesID: number) => deleteSingleQuestion(quesID)} // Get id of space is deleted
        deleteAllQuestion={deleteAllQuestion} // Delete all
        isReset={isReset}
        questionContent={questionContent}
      />
    </div>
  );
};

export default Editor;
