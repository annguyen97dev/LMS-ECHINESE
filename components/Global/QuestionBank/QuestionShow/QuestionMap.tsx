import React, { useEffect, useState } from "react";
import { Radio, Tooltip, Skeleton, Popconfirm, Spin } from "antd";
import { Info, Bookmark, Edit, Trash2 } from "react-feather";
import CreateQuestionForm from "~/components/Global/QuestionBank/CreateQuestionForm";

import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { exerciseApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const QuestionMap = (props: any) => {
  const {
    listQuestion,
    loadingQuestion,
    onFetchData,
    onRemoveData,
    isGroup,
    onEditData,
    listAlphabet,
    groupID,
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
  const [loadingAudio, setLoadingAudio] = useState(null);
  const [activeID, setActiveID] = useState(null);
  const [lengthData, setLengthData] = useState(null);

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
      showNoti("danger", error.message);
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
      showNoti("danger", error.message);
    } finally {
      setLoadingInGroup(false);
    }
  };

  const onHover = (ID: number) => {
    setActiveID(ID);
  };

  const returnAudio = (item) => {
    const audioHTML = (item) => {
      return (
        <audio controls>
          <source src={item.LinkAudio} type="audio/mpeg" />
        </audio>
      );
    };

    return (
      <>
        {!activeID ? (
          item.LinkAudio !== "" && audioHTML(item)
        ) : item.ID == activeID ? (
          !loadingAudio ? (
            item.LinkAudio !== "" && audioHTML(item)
          ) : (
            <></>
          )
        ) : (
          item.LinkAudio !== "" && audioHTML(item)
        )}
      </>
    );
  };

  useEffect(() => {
    // Check active item when add new data
    if (dataListQuestion?.length > 0) {
      if (listQuestion.length > lengthData) {
        setActiveID(listQuestion[0].ID);
      }
    }
    setLengthData(listQuestion.length);

    // Loading audio for change html audio (because the link not change when update state)
    setLoadingAudio(true);
    setTimeout(() => {
      setLoadingAudio(false);
    }, 100);

    // Check all situations between no group and have group
    !isGroup.status
      ? setDataListQuestion(listQuestion)
      : isGroup.id && isGroup.id === groupID && getQuestionInGroup();
  }, [listQuestion]);

  useEffect(() => {
    isGroup.status && setDataListQuestion([]);
    isGroup.status &&
      isGroup.id &&
      isGroup.id === groupID &&
      getQuestionInGroup();
  }, [isGroup]);

  return (
    <>
      {dataListQuestion?.length == 0 ? (
        !isGroup.status && (
          <p className="text-center">
            <b>Danh sách còn trống</b>
          </p>
        )
      ) : (
        <table
          className="table-question mt-3 w-100"
          style={{ maxWidth: "100%" }}
        >
          <thead>
            <tr>
              <th></th>
              <th>Câu hỏi</th>
              <th>Đáp án đúng</th>
              <th>Đáp án gây nhiễu</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataListQuestion?.map((item, index) => (
              <tr key={index}>
                <td className="text-center" style={{ width: "5%" }}>
                  {index + 1 + "/"}
                </td>
                <td style={{ width: "40%" }}>
                  {ReactHtmlParser(item.Content)}
                </td>
                <td>
                  {item.ExerciseAnswer?.map(
                    (ans, i) =>
                      ans.Enable &&
                      ans.isTrue && (
                        <div key={i}>
                          <span className="tick">- </span>
                          <span className="text">{ans.AnswerContent}</span>
                        </div>
                      )
                  )}
                </td>
                <td>
                  {item.ExerciseAnswer?.map(
                    (ans, i) =>
                      ans.Enable &&
                      !ans.isTrue && (
                        <div key={i}>
                          <span className="tick">- </span>
                          <span className="text">{ans.AnswerContent}</span>
                        </div>
                      )
                  )}
                </td>
                <td className="text-center">
                  <CreateQuestionForm
                    questionData={item}
                    onFetchData={onFetchData}
                    onEditData={(dataEdit: any) => onEdit(dataEdit)}
                    isGroup={{ status: false, id: null }}
                    getActiveID={(ID: any) => setActiveID(ID)}
                  />
                  <Popconfirm
                    title="Bạn có chắc muốn xóa?"
                    onConfirm={() => handleOk(item)}
                    okButtonProps={{ loading: confirmLoading }}
                    onCancel={() => handleCancel(item.ID)}
                  >
                    <Tooltip title="Xóa câu hỏi" placement="rightTop">
                      <button
                        className="btn btn-icon delete"
                        onClick={() => deleteQuestionItem(item.ID)}
                      >
                        <Trash2 />
                      </button>
                    </Tooltip>
                  </Popconfirm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isGroup?.status && loadingInGroup ? (
        <div>
          <Skeleton />
        </div>
      ) : (
        isGroup?.status &&
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
      )}
    </>
  );
};

export default QuestionMap;
