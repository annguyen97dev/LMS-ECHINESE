import React, { Component } from "react";
import { render } from "react-dom";
import { Editor } from "@tinymce/tinymce-react";

const TinyMceEditor = (props) => {
  const onChange = (e) => {
    props.value(e.target.getContent());
  };

  return (
    <Editor
      apiKey="la1igo0sfogafdrl7wrj7w9j1mghl7txxke654lgzvkt86im"
      initialValue={props.initialValue || "Nhập nội dung"}
      init={{
        height: 300,
        branding: false,
        plugins: "link image code",
        toolbar:
          "undo redo | bold italic | alignleft aligncenter alignright | code",
      }}
      onChange={onChange}
    />
  );
};

const Editor = (props) => (
  <div>
    <TinyMceEditor
      initialValue={props.initialValue}
      value={(value) => props.onChangeTinyMCE(value)}
    />
  </div>
);

export default Editor;
