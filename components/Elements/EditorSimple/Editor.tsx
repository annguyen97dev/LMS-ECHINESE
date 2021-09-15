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
import { format } from "path";

const EditorSummernote = (props) => {
  const { getDataEditor, questionContent, isReset } = props;
  const [valueEditor, setValueEditor] = useState(questionContent);

  // ON CHANGE
  const onChange = (content) => {
    getDataEditor(content);
  };

  // UPLOAD IMAGES
  const onImageUpload = async (fileList) => {
    try {
      let res = await studentApi.uploadImage(fileList[0]);
      if (res.status == 200) {
        ReactSummernote.insertImage(res.data.data);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
    }
  };

  // HANDLE RESET
  useEffect(() => {
    isReset && (ReactSummernote.reset(), setValueEditor(""));
  }, [isReset]);

  return (
    <div className="wrap-editor">
      <ReactSummernote
        children={ReactHtmlParser(valueEditor)}
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
        onImageUpload={onImageUpload}
      />
    </div>
  );
};

export default EditorSummernote;
