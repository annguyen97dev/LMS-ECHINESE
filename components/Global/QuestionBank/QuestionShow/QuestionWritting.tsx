import React, { useEffect, useState } from "react";
import { Radio, Tooltip, Skeleton, Popconfirm } from "antd";
import { Info, Bookmark, Edit, Trash2 } from "react-feather";
import CreateQuestionForm from "~/components/Global/QuestionBank/CreateQuestionForm";

import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { exerciseApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const QuestionWritting = (props: any) => {
  const {
    listQuestion,
    loadingQuestion,
    onFetchData,
    onRemoveData,
    isGroup,
    onEditData,
    listAlphabet,
  } = props;
  const [value, setValue] = React.useState(1);
  const [dataListQuestion, setDataListQuestion] = useState(null);
  const { showNoti } = useWrap();
  const [visible, setVisible] = useState({
    id: null,
    status: false,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingInGroup, setLoadingInGroup] = useState(false);

  // console.log("List Question: ", listQuestion);

  const onChange = (e) => {
    e.preventDefault();
    // setValue(e.target.value);
  };

  // ON EDIT
  const onEdit = (dataEdit) => {
    if (!isGroup.status) {
      onEditData(dataEdit);
    } else {
      let index = dataListQuestion.findIndex((item) => item.ID == dataEdit.ID);
      dataListQuestion.splice(index, 1, dataEdit);

      setDataListQuestion([...dataListQuestion]);
    }
  };

  const deleteQuestionItem = (quesID) => {
    !visible.status
      ? setVisible({
          id: quesID,
          status: true,
        })
      : setVisible({
          id: quesID,
          status: false,
        });
  };

  // Chấp nhận xóa câu hỏi
  const handleOk = async (quesItem) => {
    setConfirmLoading(true);
    quesItem.Enable = false;
    try {
      let res = await exerciseApi.update(quesItem);
      if (res.status == 200) {
        setVisible({
          ...visible,
          status: false,
        });
        onRemoveData(quesItem);
        showNoti("success", "Xóa thành công");
      }
    } catch (error) {
      showNoti("danger", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = (quesID) => {
    setVisible({
      id: quesID,
      status: false,
    });
  };

  const getQuestionInGroup = async () => {
    setLoadingInGroup(true);
    try {
      let res = await exerciseApi.getAll({
        pageIndex: 1,
        pageSize: 9999,
        ExerciseGroupID: isGroup.id,
      });
      res.status == 200 && setDataListQuestion(res.data.data);
      res.status == 204 && setDataListQuestion([]);
    } catch (error) {
      showNoti("danger", error);
    } finally {
      setLoadingInGroup(false);
    }
  };

  useEffect(() => {
    setDataListQuestion(listQuestion);
  }, [listQuestion]);

  // useEffect(() => {
  //   isGroup.status && setDataListQuestion([]);
  //   isGroup.status && isGroup.id && getQuestionInGroup();
  // }, [isGroup]);

  return (
    <>
      {dataListQuestion?.map((item, index) => (
        <div className="question-item" key={index}>
          <div className="box-detail">
            <div className="box-title">
              <span className="title-ques">Câu hỏi {index + 1}</span>
              <div className="title-text">{ReactHtmlParser(item.Content)}</div>
            </div>
          </div>
          <div className="box-action">
            <CreateQuestionForm
              questionData={item}
              onFetchData={onFetchData}
              onEditData={(dataEdit) => onEdit(dataEdit)}
            />
            <Popconfirm
              title="Bạn có chắc muốn xóa?"
              visible={item.ID == visible.id && visible.status}
              onConfirm={() => handleOk(item)}
              okButtonProps={{ loading: confirmLoading }}
              onCancel={() => handleCancel(item.ID)}
            >
              <button
                className="btn btn-icon delete"
                onClick={() => deleteQuestionItem(item.ID)}
              >
                <Trash2 />
              </button>
            </Popconfirm>
          </div>
        </div>
      ))}

      {/* {isGroup?.status && loadingInGroup ? (
        <div>
          <Skeleton />
        </div>
      ) : (
        dataListQuestion?.length == 0 && (
          <p style={{ color: "#dd4667" }}>
            <i>Nhóm này chưa có câu hỏi</i>
          </p>
        )
      )}
      {loadingQuestion && (
        <div>
          <Skeleton />
        </div>
      )} */}
    </>
  );
};

export default QuestionWritting;
