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
import index from "~/components/LoginForm";
import IdiomsForm from "~/components/Global/Option/IdiomsForm";
// import "bootstrap/dist/css/bootstrap.css";

// let keys = "";
let arrKey = [];
let countEnter = 0;
let indexChar = 0;
let textReplace = "";

const EditorSummernote = (props) => {
  const {
    getDataEditor,
    isReset,
    questionContent,
    addQuestion,
    deleteSingleQuestion,
    deleteAllQuestion,
    exerciseList,
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
  const [changePosition, setChangePosition] = useState(false);

  // console.log("Propety: ", propetyEditor);
  // console.log("Value editor: ", valueEditor);
  console.log("Count Enter: ", countEnter);
  // console.log("Position is: ", position);
  console.log("Key Editor: ", keyEditor);
  // console.log("List Input: ", listInput);
  // console.log("Is Focus: ", isFocus);
  console.log("Index Char:  ", indexChar);
  console.log("List input: ", listInput);
  // console.log("Text Replace: ", textReplace);

  const formatKey = (e) => {
    switch (e.keyCode) {
      // case 32:
      //   arrKey.push("&nbsp;");
      //   break;
      case 8: // backspace
        arrKey.splice(arrKey.length - 1, 1);
        // if (arrKey.length == 0) {
        //   countEnter--;
        //   if (countEnter < 0) {
        //     countEnter = 0;
        //   }
        // }

        indexChar--;
        if (indexChar < 0) {
          countEnter--;
          if (countEnter < 0) {
            countEnter = 0;
          }

          indexChar = 0;
        }

        textReplace =
          textReplace.slice(0, indexChar) + textReplace.slice(indexChar + 1);

        break;
      case 13: // enter
        countEnter++;
        arrKey = [];
        break;
      default:
        indexChar++;
        arrKey.push(e.key);
        break;
    }

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
    // console.log("E KEY UP: ", e);
    let node = null;
    let id = null;

    // Get id of element
    if (e.currentTarget.childNodes.length > 0) {
      node = e.currentTarget.childNodes[countEnter];
      // if (node && e.currentTarget.childNodes.length == 1) {
      //   node.id = countEnter;
      // }
      if (node) {
        id = node.id;
      }
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
  };

  // ON FOCUS
  const onFocus = (e) => {
    console.log("E in focus: ", e);
    countEnter = e.target.id;

    // setKeyEditor({
    //   ...keyEditor,
    //   id: e.target.id,
    // });

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

    console.log("Range: ", range);

    if (
      range.startContainer.previousSibling ||
      range.startContainer.nextSibling
    ) {
      textReplace = range.startContainer.textContent;
      textReplace = textReplace.substring(0, textReplace.length - 1);
    }
    indexChar = offset;

    setPropetyEditor({
      textNode: textNode,
      offset: offset,
    });
  };

  // Thao tác click add input vào đoạn văn
  const handleAddSpace = () => {
    // On add space
    const onAddSpace = () => {
      // Set id for input
      let inputID = createInputID();
      let indexInput = listInput.indexOf(inputID);

      // On add space
      let replacement = propetyEditor.textNode.splitText(propetyEditor.offset);
      let inputE = document.createElement("input");
      inputE.className = "space-editor";
      inputE.id = inputID.toString();
      inputE.setAttribute("placeholder", `(${(indexInput + 1).toString()})`);
      propetyEditor.textNode.parentNode.insertBefore(inputE, replacement);
      // setPropetyEditor({ ...propetyEditor });
      // addQuestion && addQuestion(inputID);

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
    isReset && (ReactSummernote.reset(), setValueEditor(""));
  }, [isReset]);

  // HANDLE BACKSPACE
  useEffect(() => {
    let tagP = document.querySelectorAll(".note-editable p");
  }, [indexChar]);

  // HANDLE ENTER ADD ID
  useEffect(() => {
    indexChar = 0;
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

  // Function any handle delete
  const anyHandleDelete = () => {
    console.log("On delete all");
    setListInput([]);
    countEnter = 0;
    arrKey = [];
    deleteAllQuestion && deleteAllQuestion();
    setKeyEditor({
      id: null,
      key: "",
    });
  };

  // ========================== ACTION WHEN CHANGE VALUE =======================================
  useEffect(() => {
    let editor = document.querySelectorAll(".note-editable");
    let tagP = document.querySelectorAll(".note-editable p"); // Get node element in editor
    let spaceEditor = document.querySelectorAll(".note-editable .space-editor");

    console.log("List Editor: ", editor);

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
        console.log("Xóa 1 item");
        deleteSingleQuestion && deleteSingleQuestion(difID[0]); // xóa câu hỏi ở ngoài
        let indexID = listInput.indexOf(difID[0]);
        listInput.splice(indexID, 1);
        setListInput([...listInput]);

        // Kiểm tra và thay đổi vị trí của các ô input
        setChangePosition(true);
      }
    }
    // Check delete all
    if (editor[0].childNodes.length == 0) {
      anyHandleDelete();
    } else {
      console.log("Xóa tất cả nhá");
      let isEmpty = true;
      editor[0].childNodes.forEach((item, index) => {
        let node = editor[0].children[index];
        // console.log("node là: ", node);
        if (node.innerHTML !== "<br>" && node.innerHTML !== " ") {
          isEmpty = false;
        }
      });
      if (isEmpty) {
        anyHandleDelete();
      }
      // if (editor[0].children.length == 1) {
      //   if (editor[0].children[0].innerHTML == "<br>") {
      //     anyHandleDelete();
      //   }
      // }
    }

    if (tagP.length > 0) {
      tagP.forEach((item, index) => {
        // CHECK ITEM HAVE ID OR NOT => AND ADD ID FOR ITEM
        if (!item.hasAttribute("id")) {
          item.id = index.toString();
        }

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
          arrKey = [];
          return false;
        });

        // ON HOVER HTML NODE
        // item.addEventListener("mouseover", (e) => {
        //   if (isFocus) {
        //     if (item.id) {
        //       console.log("On mouse over");
        //       let id = item.id;
        //       countEnter = parseInt(id);
        //     }
        //   }
        // });
      });
    } else {
      // check trường hợp trong editable là SPAN
    }
  }, [valueEditor]);

  function replaceNbsps(str) {
    var re = new RegExp(String.fromCharCode(160), "g");
    return str.replace(re, " ");
  }

  // ========================== HANDLE ADD INPUT =======================================
  useEffect(() => {
    if (isAdd) {
      let inputID = createInputID();
      let indexInput = listInput.indexOf(inputID);

      let editable = document.querySelectorAll(".note-editable");
      let tagP = document.querySelectorAll(".note-editable p");

      // Sau khi backspace tất cả thì mất phần tử <p> => check xem nếu ko tồn tại thì add space thẳng trong editor và ngược lại
      if (tagP.length == 0) {
        let content = editable[0].innerHTML;

        content = content.replace(
          keyEditor.key,
          keyEditor.key +
            `<input id="${inputID}" class='space-editor' placeholder="(${
              indexInput + 1
            })">`
        );

        editable[0].innerHTML = content;
      } else {
        tagP.forEach((item) => {
          if (item.id === keyEditor.id) {
            let content = item.innerHTML;
            content = content.replace("&nbsp;", " ");
            console.log("Content: ", content);
            // --- Check empty key ---
            if (keyEditor.key == "") {
              // TH1: nếu trong text đã có input, sau khi click gần đó thì vị trí bắt đầu tính từ input trở đi nên phải kiểm tra
              if (content.includes("space-editor")) {
                console.log("Add Space 1");
                let arrTextReplace = textReplace.split("");
                // console.log("ArrText: ", arrTextReplace);
                arrTextReplace.splice(
                  indexChar,
                  0,
                  `<input id="${inputID}" class='space-editor' placeholder="(${
                    indexInput + 1
                  })">`
                );
                console.log("arrText: ", arrTextReplace);
                let stringTextReplace = arrTextReplace.join("");
                // console.log("Content trước đó: ", content);
                console.log("String convert: ", stringTextReplace);
                content = content.replace(textReplace, stringTextReplace);
              } else {
                console.log("Add Space 2");
                let newContent = content.split("");
                newContent.splice(
                  indexChar,
                  0,
                  `<input id="${inputID}" class='space-editor' placeholder="(${
                    inputID + 1
                  })">`
                );
                content = newContent.join("");
              }

              // console.log("Content is: ", content);
            } else {
              console.log("Add Space 3");
              content = content.replace(
                keyEditor.key,
                keyEditor.key +
                  `<input id="${inputID}" class='space-editor' placeholder="(${
                    indexInput + 1
                  })">`
              );
            }

            item.innerHTML = content;
          }
        });
      }

      // Reset content
      setReloadContent(true);
      setTimeout(() => {
        setReloadContent(false);
      }, 200);
    }
  }, [isAdd]);

  // ========================== RELOAD CONTENT =======================================
  useEffect(() => {
    let spaceEditor = document.querySelectorAll(".note-editable .space-editor");
    // console.log("Space Editor: ", spaceEditor);

    // Trường hợp các câu hỏi đã có id mới và cần làm mới lại
    if (spaceEditor?.length > 0) {
      spaceEditor.forEach((item, index) => {
        let id = parseInt(item.id);
        if (!listInput.includes(id)) {
          listInput.push(id);
          setListInput([...listInput]);
        }
      });
    }

    if (reloadContent) {
      let allContentNode = document.querySelectorAll(".note-editable");
      let allContent = allContentNode[0].innerHTML;
      getDataEditor(allContent);
      setValueEditor(allContent);

      // Check and add - Check nếu hiện space trong đoạn văn mới add thêm câu hỏi
      let newList = [];
      spaceEditor.forEach((item, index) => {
        newList.push(parseInt(item.id));
        console.log("item: ", item);
        if (parseInt(item.id) === listInput[listInput.length - 1]) {
          addQuestion && addQuestion(listInput[listInput.length - 1]);
        }
      });
      if (!newList.includes(listInput[listInput.length - 1])) {
        listInput.splice(-1);
        setListInput([...listInput]);
      }
    }
  }, [reloadContent]);

  // ================ CHECK AND CHANGE POSITION WHEN DELTE 1 INPUT ===================
  useEffect(() => {
    let spaceEditor = document.querySelectorAll(".note-editable .space-editor");
    if (changePosition) {
      console.log("Change position");
      if (spaceEditor.length > 0) {
        spaceEditor.forEach((item, index) => {
          if (listInput.includes(parseInt(item.id))) {
            let index = listInput.indexOf(parseInt(item.id));
            item.setAttribute("placeholder", `(${(index + 1).toString()})`);
          }
        });
      }
      setChangePosition(false);
    }
  }, [changePosition]);

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
