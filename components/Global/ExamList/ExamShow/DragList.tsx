import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDoingTest } from "~/context/useDoingTest";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { Input } from "antd";

let activeDrag = null;

const DragList = (props) => {
  const { activeID, packageResult, getPackageResult } = useDoingTest();
  const { dataQuestion, listQuestionID, isDoingTest } = props;
  const [dataAnswer, setDataAnswer] = useState([]);
  // console.log("Data question in drag: ", dataQuestion);
  console.log("Data Answer is: ", dataAnswer);

  useEffect(() => {
    if (dataQuestion.Paragraph !== "") {
      let spaceEditor = document.querySelectorAll(".space-editor");

      if (spaceEditor && spaceEditor.length > 0) {
        spaceEditor.forEach((item, index) => {
          let quesID = parseInt(item.getAttribute("ques-id"));

          // Sắp xếp lại thứ tự các ô input trong đoạn văn
          let indexQues = null;
          if (listQuestionID.includes(quesID)) {
            indexQues = listQuestionID.indexOf(quesID);
          }

          item.innerHTML = `(${(indexQues + 1).toString()})`;
        });
      }
    }
  }, []);

  // ---- ALL ACTION IN DOING TEST ----

  // On Drop
  const drop = (ev) => {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));

    let nodeList = [...ev.target.childNodes];

    nodeList.forEach((item) => {
      dataAnswer.every((element) => {
        if (element.ansID === parseInt(item.id)) {
          element.ansID = null;
          element.html = null;
          element.text = null;
          setDataAnswer([...dataAnswer]);
          return false;
        }
        return true;
      });
    });
  };

  // Allow Drop
  const allowDrop = (ev) => {
    ev.preventDefault();
    const input = ev.target as HTMLElement;
  };

  // On Drag
  const drag = (ev) => {
    ev.dataTransfer.setData("text", ev.target.id);
  };

  useEffect(() => {
    if (isDoingTest) {
      let el = document.querySelectorAll(
        ".doingtest-group .drag-list .space-editor"
      );

      el.forEach((item) => {
        const quesID = parseInt(item.getAttribute("ques-id"));

        dataAnswer.push({
          quesID: quesID,
          ansID: null,
          html: null,
          text: null,
        });

        item.addEventListener("dragleave", (event) => {
          item.classList.remove("space-left");
          item.classList.remove("is-hover");
        });

        // ==================== DRAGOVER  ==============
        item.addEventListener("dragover", (event) => {
          const input = event.target as HTMLElement;
          event.preventDefault();

          input.classList.add("is-hover");

          // -- Đầy thành phần drop qua 1 bên khi có hành động drop khác
          if (item.childNodes.length > 0) {
            if (item.childNodes[0].nodeName === "DIV") {
              item.classList.add("space-left");
            }
          }
        });

        // ======================= DROP=========================
        item.addEventListener(
          "drop",
          (
            ev: CustomEvent & { dataTransfer?: DataTransfer } = new CustomEvent(
              null,
              { bubbles: true, cancelable: true }
            )
          ) => {
            // -- Thêm class auto và xóa khoảng cách sau khi đã drop xong
            item.classList.add("auto");
            item.classList.remove("space-left");
            item.classList.remove("is-hover");

            // -- Khởi tạo và xóa bên trong trước khi drop
            const input = ev.target as HTMLElement;
            input.innerHTML = "";

            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");

            input.appendChild(document.getElementById(data));

            // Kiểm tra sau khi drop thành công thì add vào mảng

            if (input.childNodes[0].nodeName === "DIV") {
              let indexQues = dataAnswer.findIndex(
                (item) => item.quesID === quesID
              );

              // -- Chặn drop thành phần bên trong
              input.childNodes[0].addEventListener("drop", (e) => {
                e.preventDefault(), e.stopPropagation();
              });

              input.childNodes[0].addEventListener(
                "dragstart",
                (
                  e: CustomEvent & {
                    dataTransfer?: DataTransfer;
                  } = new CustomEvent(null, { bubbles: true, cancelable: true })
                ) => {
                  const inputChild = e.target as HTMLElement;
                  activeDrag = inputChild.id;
                }
              );

              // -- Kiểm tra phần tử drop xuất phát từ vùng nào
              if (
                dataAnswer.some(
                  (e) => e["ansID"] === parseInt(input.children[0].id)
                )
              ) {
                let indexQuestion = dataAnswer.findIndex(
                  (e) => e.quesID === quesID
                );

                dataAnswer.every((element) => {
                  if (element.ansID === parseInt(input.children[0].id)) {
                    element.html = dataAnswer[indexQuestion].html;
                    element.ansID = dataAnswer[indexQuestion].ansID;
                    element.text = dataAnswer[indexQuestion].text;
                  }
                  return true;
                });
              } else {
                // -- Thay thế cái mới và trả về vùng chứa câu trả lời
                if (dataAnswer[indexQues].html && dataAnswer[indexQues].ansID) {
                  let getNodes = (str) =>
                    new DOMParser().parseFromString(str, "text/html").body
                      .childNodes;

                  let node = getNodes(dataAnswer[indexQues].html);

                  document.getElementById("area-drop").appendChild(node[0]);
                }
              }

              // -- Add phần tử mới vào mảng
              dataAnswer[indexQues].ansID = parseInt(input.children[0].id);
              dataAnswer[indexQues].html = input.innerHTML;
              dataAnswer[indexQues].text =
                input.children[0].children[0].innerHTML;
              setDataAnswer([...dataAnswer]);
            }
          }
        );
      });

      setDataAnswer([...dataAnswer]);
    }
  }, []);

  useEffect(() => {
    if (isDoingTest) {
      if (dataAnswer) {
        let el = document.querySelectorAll(".drag-list .space-editor");

        let boxAns = document.querySelectorAll(".drag-list .drag-list-answer");

        el.forEach((item) => {
          const quesID = parseInt(item.getAttribute("ques-id"));

          // --- Kiểm tra nếu có thành phần drop thì thêm class auto và ngược lại
          if (item.childNodes.length > 0) {
            if (item.childNodes[0].nodeName === "DIV") {
              item.classList.add("auto");
            } else {
              item.classList.remove("auto");
            }
          } else {
            item.classList.remove("auto");
          }

          // --- Tìm đúng vị trí ---
          let indexQues = null;
          if (listQuestionID.includes(quesID)) {
            indexQues = listQuestionID.indexOf(quesID);
          }
          // --- --------------- ---

          let indexFind = dataAnswer.findIndex(
            (item) => item.quesID === quesID
          );

          if (dataAnswer[indexFind].ansID == null) {
            item.innerHTML = `(${(indexQues + 1).toString()})`;
          } else {
            if (item.childNodes.length == 0) {
              let getNodes = (str) =>
                new DOMParser().parseFromString(str, "text/html").body
                  .childNodes;
              let node = getNodes(dataAnswer[indexFind].html);
              item.appendChild(node[0]);
              item.classList.add("auto");
            }
          }
        });

        boxAns.forEach((item) => {
          item.addEventListener(
            "dragstart",
            (
              ev: CustomEvent & {
                dataTransfer?: DataTransfer;
              } = new CustomEvent(null, { bubbles: true, cancelable: true })
            ) => {
              ev.dataTransfer.setData("text", item.id);
            }
          );

          // -- Chặn drop thành phần bên trong
          item.addEventListener("drop", (e) => {
            e.preventDefault(), e.stopPropagation();
          });
        });

        // -- ADD VÀO MẢNG --
        // Find index
        let indexQuestion =
          packageResult.SetPackageResultDetailInfoList.findIndex(
            (e) => e.ExamTopicDetailID === dataQuestion.ID
          );
        dataAnswer.forEach((item) => {
          let indexQuestionDetail =
            packageResult.SetPackageResultDetailInfoList[
              indexQuestion
            ].SetPackageExerciseStudentInfoList.findIndex(
              (e) => e.ExerciseID === item.quesID
            );

          // Add new answer to list - Kiểm tra xem mảng có data chưa, nếu chưa thì thêm mới, ngược lại thì cập nhật object
          // Đối với loại Điền từ thì mảng chỉ có 1 object đáp án
          if (
            packageResult.SetPackageResultDetailInfoList[indexQuestion]
              .SetPackageExerciseStudentInfoList[indexQuestionDetail]
              .SetPackageExerciseAnswerStudentList.length == 0
          ) {
            packageResult.SetPackageResultDetailInfoList[
              indexQuestion
            ].SetPackageExerciseStudentInfoList[
              indexQuestionDetail
            ].SetPackageExerciseAnswerStudentList.push({
              AnswerID: item.ansID,
              AnswerContent: item.text,
              FileAudio: "",
            });
          } else {
            packageResult.SetPackageResultDetailInfoList[
              indexQuestion
            ].SetPackageExerciseStudentInfoList[
              indexQuestionDetail
            ].SetPackageExerciseAnswerStudentList[0].AnswerContent = item.text;
            packageResult.SetPackageResultDetailInfoList[
              indexQuestion
            ].SetPackageExerciseStudentInfoList[
              indexQuestionDetail
            ].SetPackageExerciseAnswerStudentList[0].AnswerID = item.ansID;
          }
          getPackageResult({ ...packageResult });
        });
      }
    }
  }, [dataAnswer]);

  return (
    <div className="drag-list h-100">
      <h6 className="font-italic mb-3 mt-4">Kéo đáp án vào ô thích hợp</h6>

      {isDoingTest && ReactHtmlParser(dataQuestion.Paragraph)}

      <div
        className="area-drop h-100"
        id="area-drop"
        onDrop={(e) => drop(e)}
        onDragOver={(e) => allowDrop(e)}
      >
        {dataQuestion?.ExerciseTopic.map((item, index) =>
          item.ExerciseAnswer.map((ans, indexAns) => (
            <div
              className="drag-list-answer"
              key={indexAns}
              draggable="true"
              onDrop={(e) => (e.preventDefault(), e.stopPropagation())}
              onDragStart={(e) => drag(e)}
              id={ans.ID}
            >
              <span> {ans.AnswerContent}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DragList;
