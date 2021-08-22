import React, { useEffect, useState } from "react";
import { Drawer, Form, Select, Input, Radio, Spin } from "antd";
import Editor from "~/components/Elements/Editor";
import { Edit } from "react-feather";
import ChoiceForm from "../QuestionType/ChoiceForm";
import MultipleForm from "../QuestionType/MultipleForm";
import GroupForm from "../GroupForm";
import { FormOutlined } from "@ant-design/icons";
import { dataQuestion } from "~/lib/question-bank/dataBoxType";

const EditGroupForm = (props) => {
  const { questionData, isGroup, onFetchData, handlePopover, openForm } = props;
  // console.log("props", props);
  // console.log("QuestionData Drawer: ", questionData);

  const [visible, setVisible] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questionDataForm, setQuestionDataForm] = useState(null);

  console.log("DATA trong edit: ", questionDataForm);

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

  const onSuccessSubmit = () => {
    isSubmit &&
      (setIsSubmit(false),
      setIsLoading(false),
      onFetchData(),
      setVisible(false));
    console.log("chạy vô đây");
  };

  // RENDER FORM GROUP
  const renderFormGroup = () => {
    let type = questionDataForm?.Type;
    // let groupID = questionData.ExerciseGroupID;

    // console.log("Group ID là gì: ", groupID);

    if (type) {
      return (
        <GroupForm
          questionData={questionDataForm}
          isSubmit={isSubmit}
          changeIsSubmit={onSuccessSubmit}
        />
      );
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
    let type = questionDataForm?.Type;
    switch (type) {
      case 0:
        return <p className="font-weight-bold">Vui lòng chọn dạng câu hỏi</p>;
        break;
      case 1:
        return (
          <ChoiceForm
            questionData={questionData}
            isSubmit={isSubmit}
            changeIsSubmit={onSuccessSubmit}
          />
        );
        break;
      case 4:
        return (
          <MultipleForm
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

  const onEditGroupItem = (e) => {
    e.stopPropagation();
    handlePopover();
    showDrawer();
  };

  const returnButton = (questionData) => {
    console.log("question data trong này: ", questionData);
    console.log("is Group là: ", isGroup);
    if (questionDataForm?.ID) {
      if (isGroup?.status) {
        return (
          <button className="btn btn-icon edit" onClick={onEditGroupItem}>
            <FormOutlined />
            Sửa nhóm
          </button>
        );
      } else {
        return (
          <button className="btn btn-icon" onClick={showDrawer}>
            <Edit />
          </button>
        );
      }
    } else {
      if (isGroup?.status) {
        return (
          <button className="btn btn-success" onClick={showDrawer}>
            Tạo nhóm
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
  };

  useEffect(() => {
    console.log("Open form: ", openForm);
    if (openForm.status) {
      setVisible(true);
      setQuestionDataForm(openForm.data);
    }
  }, [openForm]);

  return (
    <>
      {/* {questionData.ID ? (
        <button className="btn btn-icon" onClick={showDrawer}>
          <Edit />
        </button>
      ) : !isGroup.status ? (
        <button className="btn btn-success" onClick={showDrawer}>
          Tạo câu hỏi
        </button>
      ) : (
        <button className="btn btn-success" onClick={showDrawer}>
          Tạo nhóm
        </button>
      )} */}

      {/* {returnButton(questionData)} */}

      <Drawer
        title={questionDataForm?.ID ? "Form sửa câu hỏi" : "Form tạo câu hỏi"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={900}
        footer={
          <div className="text-center">
            <button className="btn btn-light mr-2" onClick={onClose}>
              Đóng
            </button>
            {questionDataForm?.Type !== 0 && (
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
      </Drawer>
    </>
  );
};

export default EditGroupForm;
