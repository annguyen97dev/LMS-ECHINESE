import React from "react";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./Editor"), {
  ssr: false,
});

const Editor = (props) => {
  const { handleChange, isReset } = props;

  return (
    <div className="summernote-style">
      <DynamicComponentWithNoSSR
        getDataEditor={(value) => handleChange(value)}
        isReset={isReset}
      />
    </div>
  );
};

export default Editor;

// import React, { Component } from "react";
// import ReactSummernote from "react-summernote";
// import "react-summernote/dist/react-summernote.css"; // import styles
// import "react-summernote/lang/summernote-ru-RU"; // you can import any other locale

// // Import bootstrap(v3 or v4) dependencies
// import "bootstrap/js/dist/modal";
// import "bootstrap/js/dist/dropdown";
// import "bootstrap/js/dist/tooltip";
// import "bootstrap/dist/css/bootstrap.css";

// const Editor = () => {
//   const onChange = (content) => {
//     console.log("onChange", content);
//   };

//   return (
//     <ReactSummernote
//       value="Default value"
//       options={{
//         lang: "ru-RU",
//         height: 350,
//         dialogsInBody: true,
//         toolbar: [
//           ["style", ["style"]],
//           ["font", ["bold", "underline", "clear"]],
//           ["fontname", ["fontname"]],
//           ["para", ["ul", "ol", "paragraph"]],
//           ["table", ["table"]],
//           ["insert", ["link", "picture", "video"]],
//           ["view", ["fullscreen", "codeview"]],
//         ],
//       }}
//       onChange={onChange}
//     />
//   );
// };

// export default Editor;
