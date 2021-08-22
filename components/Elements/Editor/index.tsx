import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./Editor"), {
  ssr: false,
});

const Editor = (props) => {
  const { handleChange, isReset, questionContent } = props;

  return (
    <div className="summernote-style">
      <DynamicComponentWithNoSSR
        getDataEditor={(value) => handleChange(value)}
        isReset={isReset}
        questionContent={questionContent}
      />
    </div>
  );
};

export default Editor;
