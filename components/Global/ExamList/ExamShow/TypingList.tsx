import React, { useEffect, useState } from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { useDoingTest } from "~/context/useDoingTest";

const TypingList = (props) => {
  const { dataQuestion, listQuestionID, isDoingTest } = props;
  const { activeID, packageResult, getPackageResult } = useDoingTest();
  const [listInput, setListInput] = useState([]);

  // console.log("List ID Là: ", listQuestionID);
  // console.log("Data question: ", dataQuestion);

  useEffect(() => {
    if (dataQuestion.Paragraph !== "") {
      let spaceEditor = document.querySelectorAll(".space-editor");

      if (spaceEditor && spaceEditor.length > 0) {
        spaceEditor.forEach((item, index) => {
          let quesID = parseInt(item.getAttribute("ques-id"));

          // Tìm và active đúng ô input
          if (quesID === activeID) {
            item.classList.add("active-type-input");
          }

          // Sắp xếp lại thứ tự các ô input trong đoạn văn
          let indexQues = null;
          if (listQuestionID.includes(quesID)) {
            indexQues = listQuestionID.indexOf(quesID);
          }
          item.innerHTML = `${(indexQues + 1).toString()}`;
        });
      }
    }
  }, []);

  // ----------- ALL ACTION IN DOINGTEST -------------

  useEffect(() => {
    if (isDoingTest) {
      if (dataQuestion.Paragraph !== "") {
        let spaceEditor = document.querySelectorAll(".space-editor");

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
      }
    }
  }, [activeID]);

  const handleChangeText = (text, quesID) => {
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

  // useEffect(() => {
  //   console.log("CHẠY VÔ ĐÂY NHA");
  //   if (isDoingTest) {
  //     if (packageResult) {
  //       let indexQuestion =
  //         packageResult.SetPackageResultDetailInfoList.findIndex(
  //           (item) => item.ExamTopicDetailID === dataQuestion.ID
  //         );

  //         if() {

  //         }

  //       packageResult.SetPackageResultDetailInfoList[
  //         indexQuestion
  //       ].SetPackageExerciseStudentInfoList.forEach((item) => {
  //         item.SetPackageExerciseAnswerStudentList.push({
  //           AnswerID: 0,
  //           AnswerContent: "",
  //           FileAudio: "",
  //         });
  //       });
  //     }
  //   }
  // }, [packageResult]);

  return (
    <>
      {isDoingTest && (
        <div className="box-typing">
          {ReactHtmlParser(dataQuestion.Paragraph)}
        </div>
      )}
    </>
  );
};

export default TypingList;
