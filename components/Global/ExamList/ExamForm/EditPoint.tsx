import React, { useEffect, useState } from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { Radio, Tooltip, Popconfirm, Modal, Input, Spin } from "antd";
import { Trash2, Edit } from "react-feather";
import { examDetailApi } from "~/apiBase";
import { useExamDetail } from "~/pages/question-bank/exam-list/exam-detail/[slug]";
import { useWrap } from "~/context/wrap";

const EditPoint = (props) => {
  const { quesItem, dataQuestion, listQuestionGroup } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [valuePoint, setValuePoint] = useState(
    quesItem
      ? quesItem.Point
      : listQuestionGroup.length > 0
      ? listQuestionGroup[0].Point
      : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { showNoti } = useWrap();
  const { onEditPoint } = useExamDetail();
  const [listQuestion, setListQuestion] = useState(listQuestionGroup);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChange_EditPoint = (e) => {
    let value = e.target.value;
    setValuePoint(value);
    if (!quesItem) {
      listQuestion.forEach((element) => {
        element.Point = value;
      });
      setListQuestion([...listQuestion]);
    }
  };

  const onSubmitData = async () => {
    let itemDelete = {
      ID: dataQuestion.ID,
      Enable: true,
      ExerciseOrExerciseGroup: quesItem
        ? [
            {
              Point: parseFloat(valuePoint),
              ExerciseOrExerciseGroupID: quesItem.ExerciseID,
            },
          ]
        : listQuestion,
    };

    setIsLoading(true);
    try {
      let res = await examDetailApi.update(itemDelete);
      if (res.status == 200) {
        onEditPoint(itemDelete.ExerciseOrExerciseGroup, dataQuestion.ID);
        setIsModalVisible(false);
        showNoti("success", "Cập nhật điểm thành công");
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <Tooltip title="Sửa điểm">
        <button className="btn btn-icon edit" onClick={showModal}>
          <Edit />
        </button>
      </Tooltip>
      <Modal
        title="Sửa điểm"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <div className="text-center">
            <button className="btn btn-light mr-2" onClick={handleCancel}>
              Hủy
            </button>
            <button className="btn btn-primary" onClick={() => onSubmitData()}>
              Lưu
              {isLoading && <Spin className="loading-base" />}
            </button>
          </div>
        }
      >
        <Input
          className="style-input"
          value={valuePoint}
          onChange={(e) => onChange_EditPoint(e)}
          onPressEnter={onSubmitData}
          allowClear
        />
      </Modal>
    </>
  );
};

export default EditPoint;
