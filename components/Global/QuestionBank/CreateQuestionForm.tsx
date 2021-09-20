import React, { useEffect, useState } from "react";
import { Drawer, Tooltip, Spin, Modal } from "antd";
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
import DragForm from "./QuestionFormType/DragForm";
import MapForm from "./QuestionFormType/MapForm";

const CreateQuestionForm = (props) => {
  const {
    questionData,
    isGroup,
    onFetchData,
    handlePopover,
    onEditData,
    onAddData,
    getActiveID,
  } = props;

  // console.log("Is Group in create: ", isGroup);
  // console.log("question Data in create: ", questionData);

  const [visible, setVisible] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [titleForm, setTitleForm] = useState("");
  const [questionDataForm, setQuestionDataForm] = useState(questionData);
  const [changeData, setChangeData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = (e) => {
    e.stopPropagation();

    if (changeData) {
      setIsModalVisible(true);
    } else {
      setVisible(false);
      setChangeData(false);
    }
  };

  // ACTION TABLE

  const handleClose = async (e) => {
    e.stopPropagation();
    setIsModalVisible(false);
    setVisible(false);
    setChangeData(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // ON SUBMIT DATA
  const onSubmitData = () => {
    !isSubmit && setIsSubmit(true);
    setIsLoading(true);
  };

  const onSuccessSubmit = (data) => {
    // console.log("question submit in create: ", data);

    if (isSubmit) {
      setIsSubmit(false);
      setIsLoading(false);
      setChangeData(false);

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

    if (type) {
      switch (type) {
        default:
          return (
            <GroupForm
              visible={visible}
              questionData={questionData}
              isSubmit={isSubmit}
              changeIsSubmit={onSuccessSubmit}
              changeData={() => !changeData && setChangeData(true)}
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
            changeData={() => !changeData && setChangeData(true)}
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
            changeData={() => !changeData && setChangeData(true)}
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
            changeData={() => !changeData && setChangeData(true)}
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
            changeData={() => !changeData && setChangeData(true)}
          />
        );
        break;
      case 2:
        return (
          <DragForm
            isGroup={isGroup}
            visible={visible}
            questionData={questionData}
            isSubmit={isSubmit}
            changeIsSubmit={onSuccessSubmit}
            changeData={() => !changeData && setChangeData(true)}
          />
        );
        break;
      case 5:
        return (
          <MapForm
            isGroup={isGroup}
            visible={visible}
            questionData={questionData}
            isSubmit={isSubmit}
            changeIsSubmit={onSuccessSubmit}
            changeData={() => !changeData && setChangeData(true)}
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
              {questionData.Type == 3 || questionData.Type == 2
                ? "Thêm/sửa câu hỏi"
                : "Thêm câu hỏi"}
            </button>
          );
        } else {
          return (
            <Tooltip title="Sửa câu hỏi">
              <button className="btn btn-icon edit" onClick={showDrawer}>
                <Edit />
              </button>
            </Tooltip>
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
              {questionData.Type == 3 || questionData.Type == 2
                ? "Thêm/sửa câu hỏi"
                : "Thêm câu hỏi"}
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
      getActiveID && getActiveID(questionData.ID);
      return;
    }
  }, [visible]);

  // useEffect(() => {
  //   renderButton();
  // }, [isGroup]);

  // console.log("question data in create: ", questionData);
  return (
    <>
      <Modal
        title="Chú ý"
        visible={isModalVisible}
        onOk={handleClose}
        onCancel={handleCancel}
      >
        <p style={{ fontWeight: 500, color: "#292929" }}>
          Dữ liệu này chưa được lưu lại. Bạn có muốn hủy tác vụ?
        </p>
      </Modal>

      {renderButton()}

      <Drawer
        title={titleForm}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={
          (!isGroup?.status && questionData.Type == 3) || questionData.Type == 2
            ? 1300
            : 800
        }
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
