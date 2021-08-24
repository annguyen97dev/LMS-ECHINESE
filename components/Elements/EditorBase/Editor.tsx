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

import "bootstrap/js/src/modal";
import "bootstrap/js/src/dropdown";
import "bootstrap/js/src/tooltip";

const EditorSummernote = (props) => {
  const { getDataEditor, isReset, questionContent } = props;

  const onChange = (content) => {
    getDataEditor(content);
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

  return (
    <div className="wrap-editor">
      <ReactSummernote
        children={ReactHtmlParser(questionContent)}
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
