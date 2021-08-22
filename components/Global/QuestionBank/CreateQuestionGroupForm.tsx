import React, { useEffect, useState } from "react";
import { Drawer, Form, Select, Input, Radio, Spin } from "antd";
import Editor from "~/components/Elements/Editor";
import { Edit } from "react-feather";
import ChoiceForm from "./QuestionType/ChoiceForm";
import MultipleForm from "./QuestionType/MultipleForm";
import GroupForm from "./GroupForm";
import {
  FormOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

const CreateQuestionForm = (props) => {
  const {
    questionData,
    isGroup,
    onFetchData,
    handlePopover,
    onEditData,
    onAddData,
  } = props;
  // console.log("props", props);
  // console.log("QuestionData Drawer: ", questionData);

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
    console.log("question in create: ", data);
    isSubmit &&
      (setIsSubmit(false),
      setIsLoading(false),
      // onFetchData(),
      questionData.ID ? onEditData(data) : onAddData(data),
      setVisible(false));
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
      return (
        <GroupForm
          visible={visible}
          questionData={questionData}
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
            visible={visible}
            questionData={questionData}
            isSubmit={isSubmit}
            changeIsSubmit={(data: any) => onSuccessSubmit(data)}
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
      return (
        <button className="btn btn-icon edit" onClick={onEditGroupItem}>
          <FormOutlined />
          Sửa nhóm
        </button>
      );
    } else {
      return (
        <button className="btn btn-success" onClick={showDrawer}>
          Tạo nhóm
        </button>
      );
    }

    // if (questionData?.ID) {
    //   if (isGroup?.status) {
    //     return (
    //       <button className="btn btn-icon edit" onClick={onEditGroupItem}>
    //         <FormOutlined />
    //         Sửa nhóm
    //       </button>
    //     );
    //   } else {
    //     <button className="btn btn-icon" onClick={showDrawer}>
    //       <Edit />
    //     </button>;
    //   }
    // } else {
    //   if (isGroup?.status) {
    //     return (
    //       <button className="btn btn-success" onClick={showDrawer}>
    //         Tạo nhóm
    //       </button>
    //     );
    //   } else {
    //     if (isGroup?.id) {
    //       return (
    //         <button className="btn btn-icon add" onClick={onAddDataToGroup}>
    //           <AppstoreAddOutlined />
    //           Thêm câu hỏi
    //         </button>
    //       );
    //     } else {
    //       return (
    //         <button className="btn btn-success" onClick={showDrawer}>
    //           Tạo câu hỏi
    //         </button>
    //       );
    //     }
    //   }
    // }
  };

  useEffect(() => {
    visible && renderTitleForm();
  }, [visible]);

  // useEffect(() => {
  //   renderButton();
  // }, [isGroup]);

  return (
    <>
      {renderButton()}

      <Drawer
        title={titleForm}
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
        {renderFormGroup()}
      </Drawer>
    </>
  );
};

export default CreateQuestionForm;
