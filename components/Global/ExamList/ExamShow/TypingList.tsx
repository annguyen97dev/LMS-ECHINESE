import React, { useEffect, useState } from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { useDoingTest } from "~/context/useDoingTest";

const TypingList = (props) => {
  const { dataQuestion, listQuestionID, isDoingTest } = props;
  const {
    activeID,
    getActiveID,
    packageResult,
    getPackageResult,
    getListPicked,
  } = useDoingTest();
  const [listInput, setListInput] = useState([]);

  // console.log("List ID Là: ", listQuestionID);
  // console.log("Data question: ", dataQuestion);

  useEffect(() => {
    if (dataQuestion.Paragraph !== "") {
      let spaceEditor = document.querySelectorAll(".box-typing .space-editor");

      if (spaceEditor && spaceEditor.length > 0) {
        spaceEditor.forEach((item, index) => {
          let quesID = parseInt(item.getAttribute("ques-id"));

          // Sắp xếp lại thứ tự các ô input trong đoạn văn
          let indexQues = null;
          if (listQuestionID.includes(quesID)) {
            indexQues = listQuestionID.indexOf(quesID);
          }

          if (indexQues) {
            let positionSpace = document.querySelectorAll(
              ".box-typing .position-space"
            );

            if (positionSpace.length < spaceEditor.length) {
              let span = document.createElement("span");
              span.classList.add("position-space");
              span.id = quesID.toString();
              if (quesID === activeID) {
                span.classList.add("active");
              }
              span.append(`(${indexQues + 1})`);

              item.innerHTML = "";
              item.before(span);
            }
          }
        });
      }
    }
  }, [listQuestionID]);

  // ----------- ALL ACTION IN DOINGTEST -------------

  useEffect(() => {
    if (isDoingTest) {
      if (dataQuestion.Paragraph !== "") {
        let spaceEditor = document.querySelectorAll(
          ".doingtest-group .box-typing .space-editor"
        );

        if (spaceEditor && spaceEditor.length > 0) {
          spaceEditor.forEach((item, index) => {
            let quesID = parseInt(item.getAttribute("ques-id"));

            // Trường hợp điền từ xong một lát quay lại vẫn còn
            let indexQuestion =
              packageResult.SetPackageResultDetailInfoList.findIndex(
                (item) => item.ExamTopicDetailID === dataQuestion.ID
              );

            let indexQuestionDetail =
              packageResult.SetPackageResultDetailInfoList[
                indexQuestion
              ].SetPackageExerciseStudentInfoList.findIndex(
                (item) => item.ExerciseID === quesID
              );

            if (
              packageResult.SetPackageResultDetailInfoList[indexQuestion]
                .SetPackageExerciseStudentInfoList[indexQuestionDetail]
                .SetPackageExerciseAnswerStudentList.length > 0
            ) {
              item.innerHTML =
                packageResult.SetPackageResultDetailInfoList[
                  indexQuestion
                ].SetPackageExerciseStudentInfoList[
                  indexQuestionDetail
                ].SetPackageExerciseAnswerStudentList[0].AnswerContent;
            }

            // Tìm và active đúng ô input
            item.classList.remove("active-type-input");
            if (quesID === activeID) {
              item.classList.add("active-type-input");
            }
          });
        }

        // -- Sắp xếp lại vị trí
        let positionSpace = document.querySelectorAll(".position-space");
        positionSpace.forEach((item) => {
          item.classList.remove("active");
          if (parseInt(item.id) === activeID) {
            item.classList.add("active");
          }
        });
      }
    }
  }, [activeID]);

  const handleChangeText = (text, quesID) => {
    getActiveID(quesID);
    getListPicked(quesID);
    // Find index
    let indexQuestion = packageResult.SetPackageResultDetailInfoList.findIndex(
      (item) => item.ExamTopicDetailID === dataQuestion.ID
    );

    let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[
      indexQuestion
    ].SetPackageExerciseStudentInfoList.findIndex(
      (item) => item.ExerciseID === quesID
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
        AnswerID: 0,
        AnswerContent: text,
        FileAudio: "",
      });
    } else {
      packageResult.SetPackageResultDetailInfoList[
        indexQuestion
      ].SetPackageExerciseStudentInfoList[
        indexQuestionDetail
      ].SetPackageExerciseAnswerStudentList[0].AnswerContent = text;
    }

    getPackageResult({ ...packageResult });
  };

  useEffect(() => {
    let el = document.querySelectorAll(
      ".doingtest-group .box-typing .space-editor"
    );

    el.forEach((item) => {
      listInput.push(item.innerHTML);
      let quesID = parseInt(item.getAttribute("ques-id"));

      item.addEventListener("click", (event) => {
        const input = event.target as HTMLElement;
        if (listInput.includes(input.innerHTML)) {
          input.innerHTML = "";
        }
      });

      item.addEventListener("keyup", (event) => {
        const input = event.target as HTMLElement;

        handleChangeText(input.innerText, quesID);

        // Điều kiện đề input co giãn theo text
        let lengthText = input.innerText.length;
        if (lengthText > 14) {
          item.classList.add("auto");
        } else {
          item.classList.remove("auto");
        }
      });
    });

    setListInput([...listInput]);
  }, []);

  return (
    <>
      <div className="box-typing">
        {ReactHtmlParser(dataQuestion.Paragraph)}
      </div>
    </>
  );
};

export default TypingList;
