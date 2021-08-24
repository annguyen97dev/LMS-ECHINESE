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

import React, { Component, useEffect, useState } from "react";
import ReactSummernote from "react-summernote";
import "react-summernote/dist/react-summernote.css"; // import styles
import "react-summernote/lang/summernote-ru-RU"; // you can import any other locale
import { studentApi } from "~/apiBase";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";

// Import bootstrap(v3 or v4) dependencies
import "bootstrap/js/src/modal";
import "bootstrap/js/src/dropdown";
import "bootstrap/js/src/tooltip";
// import "bootstrap/dist/css/bootstrap.css";

const EditorSummernote = (props) => {
  const { getDataEditor, isReset, questionContent } = props;
  const [valueEditor, setValueEditor] = useState(questionContent);
  const [propetyEditor, setPropetyEditor] = useState({
    textNode: null,
    offset: null,
  });

  const onChange = (content) => {
    getDataEditor(content);
    setValueEditor(content);
  };

  const onFocus = (e) => {
    console.log("E is: ", e);
    let range;
    let textNode;
    let offset;

    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY);
      textNode = range.startContainer;
      offset = range.startOffset;
    } else if (document.caretPositionFromPoint) {
      range = document.caretPositionFromPoint(e.clientX, e.clientY);
      textNode = range.offsetNode;
      offset = range.offset;
    } else {
      console.log("Không hỗ trợ");
      return;
    }

    setPropetyEditor({
      textNode: textNode,
      offset: offset,
    });
  };

  const handleAddSpace = () => {
    // let inputSpace = "<input class='space-editor'>";
    // let newValue = valueEditor + inputSpace;
    // console.log("newValue: ", newValue);
    // setValueEditor(newValue);
    if (propetyEditor.textNode && propetyEditor.textNode.nodeType == 3) {
      let replacement = propetyEditor.textNode.splitText(propetyEditor.offset);
      propetyEditor.textNode.parentNode.insertBefore(
        replacement,
        "<input class='space-editor'>"
      );
    }
  };

  const onImageUpload = async (fileList) => {
    try {
      let res = await studentApi.uploadImage(fileList[0]);
      if (res.status == 200) {
        ReactSummernote.insertImage(res.data.data);
      }
    } catch (error) {
    } finally {
    }
  };

  // var HelloButton = function (context) {
  //   var ui = ReactSummernote.ui;

  //   // create button
  //   var button = ui.button({
  //     contents: '<i class="fa fa-child"/> Hello',
  //     tooltip: "hello",
  //     click: function () {
  //       // invoke insertText method with 'hello' on editor module.
  //       context.invoke("editor.insertText", "hello");
  //     },
  //   });

  //   return button.render(); // return button as jquery object
  // };

  useEffect(() => {
    isReset && ReactSummernote.reset();
  }, [isReset]);

  return (
    <div className="wrap-editor">
      <button className="btn-editor" onClick={handleAddSpace}>
        Thêm input
      </button>
      <ReactSummernote
        value={valueEditor}
        children={ReactHtmlParser(valueEditor)}
        onFocus={onFocus}
        options={{
          lang: "vn",
          height: 220,
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
    </div>
  );
};

export default EditorSummernote;
