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
// import "bootstrap/dist/css/bootstrap.css";

// let keys = "";
let arrKey = [];
let countEnter = 0;

const EditorSummernote = (props) => {
  const { getDataEditor, isReset, questionContent, addQuestion } = props;
  const [valueEditor, setValueEditor] = useState(questionContent);
  const [propetyEditor, setPropetyEditor] = useState({
    textNode: null,
    offset: null,
  });
  const [isFocus, setIsFocus] = useState(false);
  const [keyEditor, setKeyEditor] = useState({
    id: null,
    key: "",
  });
  const [position, setPosition] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [listID, setListID] = useState([]);
  const [listInput, setListInput] = useState([]);

  // console.log("Propety: ", propetyEditor);
  // console.log("Value editor: ", valueEditor);
  // console.log("Count Enter: ", countEnter);
  // console.log("Position is: ", position);
  // console.log("Key Editor: ", keyEditor);

  const formatKey = (e) => {
    switch (e.keyCode) {
      // case 32:
      //   arrKey.push("&nbsp");
      //   break;
      case 8: // backspace
        arrKey.splice(arrKey.length - 1, 1);
        if (arrKey.length == 0) {
          countEnter--;
          if (countEnter < 0) {
            countEnter = 0;
            arrKey = [];
          }
        }
        break;
      case 13: // enter
        countEnter++;
        arrKey = [];
        break;
      default:
        if (e.keyCode !== 32) {
          arrKey.push(e.key);
        }
        break;
    }

    // Remove backspace khỏi mảng
    let newArr = arrKey.filter((item) => item !== "Backspace");

    // console.log("NewArr: ", newArr);

    return newArr;
  };

  // ON KEY UP
  const onKeyDown = (e) => {
    // console.log("E KEY UP: ", e);
    let node = null;
    let id = null;

    // Get id of element
    if (e.currentTarget.childNodes.length > 0) {
      node = e.currentTarget.childNodes[countEnter];
      if (e.currentTarget.childNodes.length == 1) {
        node.id = countEnter;
      }
      id = node.id;
    }

    // Get array character
    let arrChar = formatKey(e);

    // Get key and set state
    let key = arrChar.join("");
    setKeyEditor({
      id: id,
      key: key,
    });

    // Reset propety editor
    setPropetyEditor({
      textNode: null,
      offset: null,
    });
  };

  // ON CHANGE
  const onChange = (content) => {
    setIsFocus(false);
    setIsAdd(false);

    getDataEditor(content);
    setValueEditor(content);
  };

  // ON FOCUS
  const onFocus = (e) => {
    countEnter = e.target.id;
    setIsFocus(true);
    setIsAdd(false);

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

  // Thao tác click add input vào đoạn văn
  const handleAddSpace = () => {
    // On add space
    const onAddSpace = () => {
      let replacement = propetyEditor.textNode.splitText(propetyEditor.offset);
      let inputE = document.createElement("input");
      inputE.className = "space-editor";

      propetyEditor.textNode.parentNode.insertBefore(inputE, replacement);
      setPropetyEditor({ ...propetyEditor });
    };
    // ---------------------//

    if (!isFocus) {
      setIsAdd(true);
      // setKeyEditor({
      //   id: "",
      //   key: "",
      // });
    } else {
      if (propetyEditor.textNode && propetyEditor.textNode.nodeType == 3) {
        onAddSpace();
      }
    }
    // handle add question in form (props)
    addQuestion();
  };

  // UPLOAD IMAGES
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

  // CREATE RANDOM ID
  const randomID = () => {
    let rID = null;

    // Check exist id
    if (listID.length > 0) {
      for (let i = 0; i < 1000; i++) {
        rID = Math.floor(Math.random() * 100 + 1);
        if (listID.includes(rID)) {
          continue;
        } else {
          listID.push(rID);
          setListID([...listID]);
          break;
        }
      }
    } else {
      rID = Math.floor(Math.random() * 100 + 1);
      listID.push(rID);
      setListID([...listID]);
    }

    return rID;
  };

  // HANDLE RESET
  useEffect(() => {
    isReset && ReactSummernote.reset();
  }, [isReset]);

  // HANDLE ENTER
  useEffect(() => {
    setTimeout(() => {
      let tagP = document.querySelectorAll(".note-editable p"); // Get node element in editor
      let nodeP = tagP.item(countEnter);

      // let rID = randomID();
      if (nodeP.hasAttribute("id")) {
        if (countEnter > 0) {
          let nodePBefore = tagP.item(countEnter - 1);
          if (nodeP.id == nodePBefore.id) {
            nodeP.id = countEnter.toString();
          }
        }
      } else {
        nodeP.id = countEnter.toString();
      }
    }, 200);
  }, [countEnter]);

  // HANDLE CLICK AND HOVER
  useEffect(() => {
    let tagP = document.querySelectorAll(".note-editable p"); // Get node element in editor

    tagP.forEach((item, index) => {
      // ON CLICK HTML NODE
      item.addEventListener("click", (e) => {
        onFocus(e);
        setKeyEditor({
          id: "",
          key: "",
        });
        // keys = "";
        arrKey = [];
        return false;
      });

      // ON HOVER HTML NODE
      item.addEventListener("mouseover", (e) => {
        let id = item.id;
        countEnter = parseInt(id);
      });

      if (item.textContent.includes(keyEditor.key)) {
        setPosition(
          item.textContent.indexOf(keyEditor.key) + keyEditor.key.length + 1
        );
      }
    });
  }, [valueEditor]);

  // HANDLE ADD INPUT
  useEffect(() => {
    let inputID = null;
    if (isAdd) {
      // console.log("keyEditor is: ", keyEditor);
      let tagP = document.querySelectorAll(".note-editable p");
      tagP.forEach((item) => {
        // console.log("Content is: ", item.innerHTML);
        if (
          item.textContent.includes(keyEditor.key) &&
          item.id === keyEditor.id
        ) {
          let content = item.innerHTML;

          // Check add set id for input
          if (listInput.length == 0) {
            inputID = 0;
          } else {
            inputID = listInput.length;
          }
          listInput.push(inputID);
          setListID([...listInput]);
          // --------------------- //

          content = content.replace(
            keyEditor.key,
            keyEditor.key + `<input id="${inputID}" class='space-editor'>`
          );
          // console.log("New Content is: ", content);
          item.innerHTML = content;
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
        onKeyDown={onKeyDown}
        onImageUpload={onImageUpload}
      />
    </div>
  );
};

export default EditorSummernote;
