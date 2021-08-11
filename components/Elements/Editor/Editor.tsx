// import React from "react";
// import ReactDOM from "react-dom";

// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter";

// // import "./styles.css";

// // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html

// /* import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
// import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
// import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
// import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph"; */

// /* const editorConfiguration = {
//   plugins: [Essentials, Bold, Italic, Paragraph],
//   toolbar: ["bold", "italic"]
// }; */

// function Editor(props) {
//   const { getDataEditor } = props;

//   return (
//     <div className="App">
//       <CKEditor
//         editor={ClassicEditor}
//         data=""
//         onReady={(editor) => {
//           // You can store the "editor" and use when it is needed.
//           console.log("Editor is ready to use!", editor);
//         }}
//         onChange={(event, editor) => {
//           const data = editor.getData();
//           getDataEditor(data);
//           console.log({ event, editor, data });
//         }}
//         onBlur={(event, editor) => {
//           console.log("Blur.", editor);
//         }}
//         onFocus={(event, editor) => {
//           console.log("Focus.", editor);
//         }}
//       />
//     </div>
//   );
// }

// export default Editor;

import React, { Component } from "react";
import ReactSummernote from "react-summernote";
import "react-summernote/dist/react-summernote.css"; // import styles
import "react-summernote/lang/summernote-ru-RU"; // you can import any other locale

// Import bootstrap(v3 or v4) dependencies
import "bootstrap/js/src/modal";
import "bootstrap/js/src/dropdown";
import "bootstrap/js/src/tooltip";
import "bootstrap/dist/css/bootstrap.css";

const EditorSummernote = () => {
  const onChange = (content) => {
    console.log("onChange", content);
  };

  const onImageUpload = (fileList) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      ReactSummernote.insertImage(reader.result);
    };
    reader.readAsDataURL(fileList[0]);
  };

  return (
    <ReactSummernote
      value="Default value"
      options={{
        lang: "vn",
        height: 350,
        dialogsInBody: true,
        toolbar: [
          ["style", ["style"]],
          ["font", ["bold", "underline", "clear"]],
          ["fontname", ["fontname"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["table", ["table"]],
          ["insert", ["link", "picture", "video"]],
          ["view", ["fullscreen", "codeview"]],
        ],
      }}
      onChange={onChange}
      onImageUpload={onImageUpload}
    />
  );
};

export default EditorSummernote;
