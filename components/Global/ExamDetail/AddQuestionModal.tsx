import React, { useContext, useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import QuestionCreate from "../QuestionBank/QuestionCreate";
import ExamDetail, {
  useExamDetail,
} from "~/pages/question-bank/exam-list/exam-detail/[slug]";
import { examDetailApi, examTopicApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const AddQuestionModal = (props) => {
  const { dataExam, onFetchData } = props;
  const { onAddQuestion, listQuestionAdd } = useExamDetail();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showNoti } = useWrap();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddQuestion = () => {
    onAddQuestion();
  };

  useEffect(() => {
    if (listQuestionAdd.length > 0) {
      console.log("ListQuestionADD: ", listQuestionAdd);
      (async function submitQuestionAdd() {
        setIsLoading(true);
        try {
          let res = await examDetailApi.add({
            ExamTopicID: dataExam.ID,
            ExerciseOrExerciseGroup: listQuestionAdd,
          });
          if (res.status == 200) {
            showNoti("success", "Thêm câu hỏi thành công");
            onFetchData && onFetchData();
          }
        } catch (error) {
          showNoti("danger", error);
        } finally {
          setIsModalVisible(false);
          setIsLoading(false);
        }
      })();
    }
  }, [listQuestionAdd]);

  return (
    <>
      <button className="btn btn-success" onClick={showModal}>
        Thêm câu hỏi
      </button>
      <Modal
        centered={true}
        style={{ top: 10 }}
        width={"80%"}
        title="Thêm câu hỏi vào đề thi"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="modal-add-question"
        footer={
          <div className="text-center">
            <button className="btn btn-light mr-2" onClick={handleCancel}>
              Đóng
            </button>
            <button className="btn btn-primary" onClick={handleAddQuestion}>
              Lưu
              {isLoading && <Spin className="loading-base" />}
            </button>
          </div>
        }
      >
        <QuestionCreate dataExam={dataExam} />
      </Modal>
    </>
  );
};

export default AddQuestionModal;
