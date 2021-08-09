import React from "react";
import ReactDOM from "react-dom";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter";

// import "./styles.css";

// https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html

/* import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph"; */

/* const editorConfiguration = {
  plugins: [Essentials, Bold, Italic, Paragraph],
  toolbar: ["bold", "italic"]
}; */

function Editor(props) {
  const { getDataEditor } = props;

  return (
    <div className="App">
      <CKEditor
        editor={ClassicEditor}
        data=""
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          getDataEditor(data);
          console.log({ event, editor, data });
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
      />
    </div>
  );
}

export default Editor;
