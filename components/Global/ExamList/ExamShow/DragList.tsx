import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDoingTest } from "~/context/useDoingTest";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";

const DragList = (props) => {
  const { activeID, packageResult, getPackageResult } = useDoingTest();
  const { dataQuestion, listQuestionID, isDoingTest } = props;
  console.log("Data question in drag: ", dataQuestion);

  useEffect(() => {
    let el = document.querySelectorAll(
      ".doingtest-group .box-typing .space-editor"
    );

    el.forEach((item) => {
      item.setAttribute("contenteditable", "false");

      let quesID = parseInt(item.getAttribute("ques-id"));

      item.addEventListener("keyup", (event) => {
        const input = event.target as HTMLElement;

        // Điều kiện đề input co giãn theo text
        let lengthText = input.innerText.length;
        if (lengthText > 14) {
          item.classList.add("auto");
        } else {
          item.classList.remove("auto");
        }
      });
    });
  }, []);

  return (
    <div className="drag-list">
      <h6 className="font-italic mb-3 mt-4">Kéo đáp án vào ô thích hợp</h6>

      {isDoingTest && ReactHtmlParser(dataQuestion.Paragraph)}

      {dataQuestion?.ExerciseTopic.map((item, index) =>
        item.ExerciseAnswer.map((ans, indexAns) => (
          <div className="drag-list-answer" key={indexAns}>
            <span>{ans.AnswerContent}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default DragList;
