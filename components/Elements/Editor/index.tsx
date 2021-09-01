import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./Editor"), {
  ssr: false,
});

const Editor = (props) => {
  const {
    handleChange,
    handleDelete,
    isReset,
    questionContent,
    addQuestion,
    deleteAllQuestion,
  } = props;

  return (
    <div className="summernote-style">
      <DynamicComponentWithNoSSR
        addQuestion={(inputID) => addQuestion(inputID)}
        getDataEditor={(value) => handleChange(value)} // Get content with string type
        handleDelete={(quesID: number) => handleDelete(quesID)} // Get id of space is deleted
        isReset={isReset}
        questionContent={questionContent}
        deleteAllQuestion={deleteAllQuestion}
      />
    </div>
  );
};

export default Editor;
