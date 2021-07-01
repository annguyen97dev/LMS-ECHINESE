import React, { Component } from "react";
import { render } from "react-dom";
import { Editor } from "@tinymce/tinymce-react";

const TinyMceEditor = () => {
  const onChange = (e) => {
    console.log(e.target.getContent());
  };

  return (
    <Editor
      apiKey="la1igo0sfogafdrl7wrj7w9j1mghl7txxke654lgzvkt86im"
      initialValue="<p>This is the initial content of the editor</p>"
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

const TinyBox = () => (
  <div>
    <TinyMceEditor />
  </div>
);

export default TinyBox;
