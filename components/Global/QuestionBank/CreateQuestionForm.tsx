import React, { useEffect, useState } from "react";
import { Drawer, Form, Select, Input, Radio, Spin } from "antd";
import Editor from "~/components/Elements/Editor";
import { Edit } from "react-feather";
import ChoiceForm from "./QuestionFormType/ChoiceForm";
import MultipleForm from "./QuestionFormType/MultipleForm";
import GroupForm from "./QuestionFormType/GroupForm";
import {
  FormOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import WrittingForm from "./QuestionFormType/WrittingForm";
import GroupFormTyping from "./QuestionFormType/TypingForm";
import TypingForm from "./QuestionFormType/TypingForm";

const CreateQuestionForm = (props) => {
  const {
    questionData,
    isGroup,
    onFetchData,
    handlePopover,
    onEditData,
    onAddData,
  } = props;

  // console.log("Is Group in create: ", isGroup);
  console.log("question Data in create: ", questionData);

  const [visible, setVisible] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [titleForm, setTitleForm] = useState("");
  const [questionDataForm, setQuestionDataForm] = useState(questionData);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = (e) => {
    setVisible(false);
    e.stopPropagation();
  };

  const onSubmitData = () => {
    !isSubmit && setIsSubmit(true);
    setIsLoading(true);
  };

  const onSuccessSubmit = (data) => {
    console.log("question submit in create: ", data);

    if (isSubmit) {
      setIsSubmit(false);
      setIsLoading(false);
      // if (data.ExerciseList) {
      //   !isGroup.status ? onEditData(data) : onAddData(data);
      // } else {
      //   questionData.ID ? onEditData(data) : onAddData(data);
      // }
      questionData.ID ? onEditData(data) : onAddData(data);

      setVisible(false);
    }
  };

  // ON EDIT GROUP ITEM
  const onEditGroupItem = () => {
    handlePopover();
    showDrawer();
  };

  // ON ADD DATA TO GROUP
  const onAddDataToGroup = () => {
    handlePopover();
    showDrawer();
  };

  // RENDER FORM GROUP
  const renderFormGroup = () => {
    let type = questionData.Type;
    // let groupID = questionData.ExerciseGroupID;

    // console.log("Group ID là gì: ", groupID);

    if (type) {
      switch (type) {
        // case 3:
        //   return (
        //     <TypingForm
        //       visible={visible}
        //       questionData={questionData}
        //       isSubmit={isSubmit}
        //       changeIsSubmit={onSuccessSubmit}
        //     />
        //   );
        //   break;

        default:
          return (
            <GroupForm
              visible={visible}
              questionData={questionData}
              isSubmit={isSubmit}
              changeIsSubmit={onSuccessSubmit}
            />
          );
          break;
      }
    } else {
      if (!isGroup?.status) {
        renderFormSingle();
      } else {
        return <p className="font-weight-bold">Vui lòng chọn dạng câu hỏi</p>;
      }
    }
  };

  // RENDER FORM SINGLE
  const renderFormSingle = () => {
    // console.log("Type is: ", type);
    let type = questionData?.Type;
    switch (type) {
      case 0:
        return <p className="font-weight-bold">Vui lòng chọn dạng câu hỏi</p>;
        break;
      case 1:
        return (
          <ChoiceForm
            isGroup={isGroup}
            visible={visible}
            questionData={questionData}
            isSubmit={isSubmit}
            changeIsSubmit={(data: any) => onSuccessSubmit(data)}
          />
        );
        break;
      case 4:
        return (
          <MultipleForm
            isGroup={isGroup}
            visible={visible}
            questionData={questionData}
            isSubmit={isSubmit}
            changeIsSubmit={(data: any) => onSuccessSubmit(data)}
          />
        );
        break;
      case 6:
        return (
          <WrittingForm
            isGroup={isGroup}
            visible={visible}
            questionData={questionData}
            isSubmit={isSubmit}
            changeIsSubmit={(data: any) => onSuccessSubmit(data)}
          />
        );
        break;
      case 3:
        return (
          <TypingForm
            isGroup={isGroup}
            visible={visible}
            questionData={questionData}
            isSubmit={isSubmit}
            changeIsSubmit={onSuccessSubmit}
          />
        );
        break;
      default:
        return <p>Vui lòng chọn dạng câu hỏi</p>;
        break;
    }
  };

  // RETURN TITLE FORM
  const renderTitleForm = () => {
    let text = "";
    if (questionData?.ID) {
      if (!isGroup?.status) {
        text = "Form sửa câu hỏi";
      } else {
        text = "Form sửa nhóm";
      }
    } else {
      if (isGroup?.status) {
        text = "Form tạo nhóm";
      } else {
        text = "Form tạo câu hỏi";
      }
    }

    setTitleForm(text);
    return text;
  };

  // RETURN BUTTON
  const renderButton = () => {
    if (questionData?.ID) {
      if (isGroup?.status) {
        return (
          <button className="btn btn-icon edit" onClick={onEditGroupItem}>
            <FormOutlined />
            Sửa nhóm
          </button>
        );
      } else {
        if (questionData.ExerciseList) {
          return (
            <button className="btn btn-icon add" onClick={onAddDataToGroup}>
              <AppstoreAddOutlined />
              {questionData.Type == 3 ? "Thêm/sửa câu hỏi" : "Thêm câu hỏi"}
            </button>
          );
        } else {
          return (
            <button className="btn btn-icon edit" onClick={showDrawer}>
              <Edit />
            </button>
          );
        }
      }
    } else {
      if (isGroup?.status) {
        return (
          <button className="btn btn-success" onClick={showDrawer}>
            Tạo nhóm
          </button>
        );
      } else {
        if (isGroup?.id) {
          return (
            <button className="btn btn-icon add" onClick={onAddDataToGroup}>
              <AppstoreAddOutlined />
              {questionData.Type == 3 ? "Thêm/sửa câu hỏi" : "Thêm câu hỏi"}
            </button>
          );
        } else {
          return (
            <button className="btn btn-success" onClick={showDrawer}>
              Tạo câu hỏi
            </button>
          );
        }
      }
    }
  };

  useEffect(() => {
    if (visible) {
      renderTitleForm();
      return;
    }
  }, [visible]);

  // useEffect(() => {
  //   renderButton();
  // }, [isGroup]);

  // console.log("question data in create: ", questionData);
  return (
    <>
      {renderButton()}

      <Drawer
        title={titleForm}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={!isGroup?.status && questionData.Type == 3 ? 1300 : 800}
        footer={
          <div className="text-center">
            <button className="btn btn-light mr-2" onClick={onClose}>
              Hủy tác vụ
            </button>
            {questionData?.Type !== 0 && (
              <button
                className="btn btn-primary"
                onClick={() => onSubmitData()}
              >
                Lưu
                {isLoading && <Spin className="loading-base" />}
              </button>
            )}
          </div>
        }
      >
        {!isGroup?.status ? renderFormSingle() : renderFormGroup()}
        {/* <GroupFormTyping
          visible={visible}
          questionData={questionData}
          isSubmit={isSubmit}
          changeIsSubmit={onSuccessSubmit}
        /> */}
      </Drawer>
    </>
  );
};

export default CreateQuestionForm;
