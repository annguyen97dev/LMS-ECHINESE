import React from "react";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./Editor"), {
  ssr: false,
});

const Editor = (props) => {
  const { handleChange } = props;

  return (
    <div>
      <DynamicComponentWithNoSSR
        getDataEditor={(value) => handleChange(value)}
      />
    </div>
  );
};

export default Editor;
