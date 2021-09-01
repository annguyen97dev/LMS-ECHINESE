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
let cloneOffset = 0;

const EditorSummernote = (props) => {
  const {
    getDataEditor,
    isReset,
    questionContent,
    addQuestion,
    handleDelete,
    deleteAllQuestion,
  } = props;
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
  const [reloadContent, setReloadContent] = useState(false);
  // const [listID, setListID] = useState([]);
  const [listInput, setListInput] = useState([]);

  console.log("Propety: ", propetyEditor);
  // console.log("Value editor: ", valueEditor);
  // console.log("Count Enter: ", countEnter);
  // console.log("Position is: ", position);
  // console.log("Key Editor: ", keyEditor);
  // console.log("List Input: ", listInput);
  // console.log("Is Focus: ", isFocus);
  console.log("Position: ", position);

  const formatKey = (e) => {
    switch (e.keyCode) {
      // case 32:
      //   arrKey.push("&nbsp;");
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

        cloneOffset--;
        console.log("clone offset: ", cloneOffset);

        // let offset = propetyEditor.offset;
        // console.log("offset này: ", offset);
        // offset--;

        setPropetyEditor({
          ...propetyEditor,
        });
        break;
      case 13: // enter
        countEnter++;
        arrKey = [];
        break;
      default:
        arrKey.push(e.key);
        break;
    }

    console.log("Arr Key: ", arrKey);

    // Remove backspace khỏi mảng
    let newArr = arrKey.filter((item) => item !== "Backspace");

    // Bóc tách và xóa backspace
    for (let i = 0; i < 10; i++) {
      if (newArr[newArr.length - 1] == " ") {
        newArr.splice(newArr.length - 1, 1);
      } else {
        break;
      }
    }
    for (let i = 0; i < 5; i++) {
      if (newArr[0] == " ") {
        newArr.splice(0, 1);
      } else {
        break;
      }
    }

    return newArr;
  };

  // ON KEY UP
  const onKeyDown = (e) => {
    console.log("E KEY UP: ", e);
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
    // setPropetyEditor({
    //   textNode: null,
    //   offset: null,
    // });
  };

  // ON CHANGE
  const onChange = (content) => {
    setIsFocus(false);
    setIsAdd(false);

    getDataEditor(content);
    setValueEditor(content);

    // console.log("Content nha: ", content);
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
      console.log("Not support caretPositionFromPoint");
      return;
    }

    setPropetyEditor({
      textNode: textNode,
      offset: offset,
    });
    cloneOffset = offset;
  };

  // Thao tác click add input vào đoạn văn
  const handleAddSpace = () => {
    // On add space
    const onAddSpace = () => {
      let inputID = createInputID();

      // Check add set id for input
      let replacement = propetyEditor.textNode.splitText(propetyEditor.offset);
      let inputE = document.createElement("input");
      inputE.className = "space-editor";
      inputE.id = inputID.toString();
      // inputE.value = `(${(inputID + 1).toString()})`;
      inputE.setAttribute("value", `(${(inputID + 1).toString()})`);

      propetyEditor.textNode.parentNode.insertBefore(inputE, replacement);
      setPropetyEditor({ ...propetyEditor });
      addQuestion(inputID);

      // Reload Content
      setReloadContent(true);
      setTimeout(() => {
        setReloadContent(false);
      }, 200);
    };
    // ---------------------//

    if (!isFocus) {
      setIsAdd(true);
    } else {
      if (propetyEditor.textNode && propetyEditor.textNode.nodeType == 3) {
        onAddSpace();
      }
    }
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

  // create input ID
  const createInputID = () => {
    let inputID = null;
    // Check add set id for input
    if (listInput.length == 0) {
      inputID = 0;
    } else {
      inputID = listInput[listInput.length - 1] + 1;
    }

    listInput.push(inputID);
    setListInput([...listInput]);

    return inputID;
  };

  // HANDLE RESET
  useEffect(() => {
    isReset && ReactSummernote.reset();
  }, [isReset]);

  // HANDLE ENTER ADD ID
  useEffect(() => {
    setTimeout(() => {
      let tagP = document.querySelectorAll(".note-editable p"); // Get node element in editor
      let nodeP = tagP.item(countEnter);

      if (nodeP) {
        if (nodeP.hasAttribute("id")) {
          if (countEnter > 0) {
            let nodePBefore = tagP.item(countEnter - 1);
            if (nodeP.id == nodePBefore.id) {
              nodeP.id = countEnter.toString();
            }
          }
        } else {
          if (countEnter > 0) {
            let nodePBefore = tagP.item(countEnter - 1);
            if (nodePBefore && !nodePBefore.hasAttribute("id")) {
              nodePBefore.id = (countEnter - 1).toString();
            }
          }
          nodeP.id = countEnter.toString();
        }
      }
    }, 200);
  }, [countEnter]);

  // HANDLE CLICK AND HOVER
  useEffect(() => {
    let tagP = document.querySelectorAll(".note-editable p"); // Get node element in editor
    let spaceEditor = document.querySelectorAll(".space-editor");

    // Check space is deleted
    let newList = [];
    if (spaceEditor) {
      spaceEditor.forEach((item) => {
        item.id && newList.push(item.id);
      });
    }

    if (listInput.length > 0) {
      let difID = listInput.filter((x) => !newList.includes(x.toString()));
      // console.log("New List: ", newList);
      // console.log("Input list: ", listInput);
      // console.log("difID: ", difID);
      if (difID.length > 0) {
        handleDelete(difID[0]);
        // let indexID = listInput.findIndex((x) => x === difID[0]);
        let indexID = listInput.indexOf(difID[0]);
        listInput.splice(indexID, 1);
        setListInput([...listInput]);
      }
    }
    // Check delete all
    if (valueEditor === "<p><br></p>" || valueEditor === '<p id="0"><br></p>') {
      setListInput([]);
      countEnter = 0;
      arrKey = [];
      deleteAllQuestion();
      setKeyEditor({
        id: null,
        key: "",
      });
    }

    if (tagP.length > 0) {
      tagP.forEach((item, index) => {
        // CHECK IF HAVE "SPAN" IN TAG P
        if (item.children.length > 0) {
          let node = item.children[0];
          if (node && node.nodeName == "SPAN") {
            item.innerHTML = node.innerHTML;
          }
        }

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
          if (isFocus) {
            if (item.id) {
              let id = item.id;
              countEnter = parseInt(id);
            }
          }
        });
      });
    }
  }, [valueEditor]);

  // HANDLE ADD INPUT
  useEffect(() => {
    if (isAdd) {
      let inputID = createInputID();
      // Check add set id for input
      // if (listInput.length == 0) {
      //   inputID = 0;
      // } else {
      //   inputID = listInput[listInput.length - 1] + 1;
      //   console.log("kiểm tra: ", listInput[listInput.length - 1]);
      // }

      // listInput.push(inputID);

      // setListInput([...listInput]);
      // --------------------- //

      let editable = document.querySelectorAll(".note-editable");
      let tagP = document.querySelectorAll(".note-editable p");

      // Sau khi backspace tất cả thì mất phần tử <p> => check xem nếu ko tồn tại thì add space thẳng trong editor và ngược lại
      if (tagP.length == 0) {
        let content = editable[0].innerHTML;
        content = content.replace(
          keyEditor.key,
          keyEditor.key +
            `<input id="${inputID}" class='space-editor' value="(${
              inputID + 1
            })">`
        );
        editable[0].innerHTML = content;
      } else {
        tagP.forEach((item) => {
          if (
            item.textContent.includes(keyEditor.key) &&
            item.id === keyEditor.id
          ) {
            let content = item.innerHTML;

            content = content.replace(
              keyEditor.key,
              keyEditor.key +
                `<input id="${inputID}" class='space-editor' value="(${
                  inputID + 1
                })">`
            );
            item.innerHTML = content;
          }
        });
      }

      // Reset content
      setReloadContent(true);
      setTimeout(() => {
        setReloadContent(false);
      }, 200);
      // handle add question in form (props)
      addQuestion(inputID);
    }
  }, [isAdd]);

  useEffect(() => {
    if (reloadContent) {
      let allContentNode = document.querySelectorAll(".note-editable");
      let allContent = allContentNode[0].innerHTML;
      getDataEditor(allContent);
    }
  }, [reloadContent]);

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
