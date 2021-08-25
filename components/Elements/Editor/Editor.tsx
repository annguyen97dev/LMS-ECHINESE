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

let keys = "";

const EditorSummernote = (props) => {
  const { getDataEditor, isReset, questionContent, addQuestion } = props;
  const [valueEditor, setValueEditor] = useState(questionContent);
  const [propetyEditor, setPropetyEditor] = useState({
    textNode: null,
    offset: null,
  });
  const [isFocus, setIsFocus] = useState(false);
  const [keyEditor, setKeyEditor] = useState("");
  const [position, setPosition] = useState(null);
  const [isAdd, setIsAdd] = useState(false);

  // console.log("Propety: ", propetyEditor);

  // console.log("Position is: ", position);

  // console.log("Keyyyyy: ", keyEditor);

  const onKeyUp = (e) => {
    let range = null;

    console.log("E: ", e);
    console.log("Length char: ", e.currentTarget.innerText.length);
    let lengthChar = e.currentTarget.innerText.length;

    keys = keys + e.key;

    setKeyEditor(keys);
    // let newOffset = propetyEditor.offset + lengthChar;
    // setPropetyEditor({ ...propetyEditor, offset: newOffset });
  };

  const onChange = (content) => {
    setIsFocus(false);

    getDataEditor(content);
    setValueEditor(content);
  };

  const onFocus = (e) => {
    setIsFocus(true);
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
      console.log("Không hỗ trợ caretPositionFromPoint");
      return;
    }

    setPropetyEditor({
      textNode: textNode,
      offset: offset,
    });
  };

  const handleAddSpace = () => {
    const onAddSpace = () => {
      let replacement = propetyEditor.textNode.splitText(propetyEditor.offset);
      let inputE = document.createElement("input");
      inputE.className = "space-editor";

      propetyEditor.textNode.parentNode.insertBefore(inputE, replacement);
      setPropetyEditor({ ...propetyEditor });

      // handle add question
      addQuestion();
    };

    if (!isFocus) {
      setIsAdd(true);
    } else {
      if (propetyEditor.textNode && propetyEditor.textNode.nodeType == 3) {
        onAddSpace();
      }
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

  useEffect(() => {
    isReset && ReactSummernote.reset();
  }, [isReset]);

  useEffect(() => {
    let tagP = document.querySelectorAll(".note-editable p"); // Get node element in editor

    // forloop and find the indexof text
    tagP.forEach((item) => {
      console.log("item: ", item.textContent);
      item.addEventListener("click", (e) => {
        onFocus(e);
        keys = "";
        return false;
      });
      // console.log("Key bên ngoài: ", keyEditor);
      if (item.textContent.includes(keys)) {
        console.log("Chạy vô đây");
        setPosition(item.textContent.indexOf(keys) + keys.length);
      }
    });
  }, [valueEditor, keyEditor]);

  useEffect(() => {
    if (isAdd) {
      let tagP = document.querySelectorAll(".note-editable p");
      tagP.forEach((item) => {
        if (item.textContent.includes(keys)) {
          let arrStr = item.textContent.split("");
          arrStr[position] = "<input class='space-editor'>";
          item.textContent = arrStr.toString();
        }
      });
    }
  }, [isAdd]);

  return (
    <div className="wrap-editor">
      <button className="btn-editor" onClick={handleAddSpace}>
        Thêm input
      </button>
      <ReactSummernote
        value={valueEditor}
        children={ReactHtmlParser(valueEditor)}
        // onFocus={onFocus}
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
        onChange={(content) => onChange(content)}
        onKeyUp={onKeyUp}
        onImageUpload={onImageUpload}
      />
    </div>
  );
};

export default EditorSummernote;
