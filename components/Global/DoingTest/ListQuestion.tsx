import React from "react";
import AddQuestionModal from "~/components/Global/ExamDetail/AddQuestionModal";
import ChoiceList from "~/components/Global/ExamList/ExamShow/ChoiceList";
import MultipleList from "~/components/Global/ExamList/ExamShow/MultipleList";
import WrapList from "~/components/Global/ExamList/ExamShow/WrapList";
import MapList from "~/components/Global/ExamList/ExamShow/MapList";
import DragList from "~/components/Global/ExamList/ExamShow/DragList";
import TypingList from "~/components/Global/ExamList/ExamShow/TypingList";
import WrittingList from "~/components/Global/ExamList/ExamShow/WrittingList";
import { useDoingTest } from "~/context/useDoingTest";
import { ListAlphabet } from "~/lib/list-alphabet/ListAlphabet";

const ListQuestion = (props) => {
  //   const { listQuestionID } = useDoingTest();
  const { dataQuestion, listQuestionID } = props;

  // RETURN QUESTION TYPE
  const returnQuestionType = (dataQuestion) => {
    const type = dataQuestion.Type;
    switch (type) {
      case 1:
        return (
          <div>
            <ChoiceList
              isDoingTest={true}
              listQuestionID={listQuestionID}
              dataQuestion={dataQuestion}
              listAlphabet={ListAlphabet}
            />
          </div>
        );
        break;
      case 2:
        return (
          <div>
            <DragList
              isDoingTest={true}
              listQuestionID={listQuestionID}
              dataQuestion={dataQuestion}
              listAlphabet={ListAlphabet}
            />
          </div>
        );
        break;
      case 3:
        return (
          <div>
            <TypingList
              isDoingTest={true}
              listQuestionID={listQuestionID}
              dataQuestion={dataQuestion}
              listAlphabet={ListAlphabet}
            />
          </div>
        );
        break;
      case 4:
        return (
          <div>
            <MultipleList
              isDoingTest={true}
              listQuestionID={listQuestionID}
              dataQuestion={dataQuestion}
              listAlphabet={ListAlphabet}
            />
          </div>
        );
        break;
      case 5:
        return (
          <div>
            <MapList
              isDoingTest={true}
              listQuestionID={listQuestionID}
              dataQuestion={dataQuestion}
              listAlphabet={ListAlphabet}
            />
          </div>
        );
        break;
      case 6:
        return (
          <div>
            <WrittingList
              isDoingTest={true}
              listQuestionID={listQuestionID}
              dataQuestion={dataQuestion}
              listAlphabet={ListAlphabet}
            />
          </div>
        );
        break;
      case 7:
        return (
          <WrittingList
            isDoingTest={true}
            listQuestionID={listQuestionID}
            dataQuestion={dataQuestion}
            listAlphabet={ListAlphabet}
          />
        );
        break;
      default:
        return;
        break;
    }
  };

  return (
    <div className="question-create">
      <div className="card-detail-exam card-detail-question">
        <div className="question-list">{returnQuestionType(dataQuestion)}</div>
      </div>
    </div>
  );
};

export default ListQuestion;
