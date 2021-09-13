import React, { useEffect, useState } from "react";
import { Radio, Spin, Skeleton, Popconfirm } from "antd";
import { Trash2 } from "react-feather";
import CreateQuestionForm from "~/components/Global/QuestionBank/CreateQuestionForm";

import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { useWrap } from "~/context/wrap";
import { exerciseApi } from "~/apiBase";

const QuestionMultiple = (props: any) => {
  const {
    isGroup,
    listQuestion,
    loadingQuestion,
    onFetchData,
    onRemoveData,
    onEditData,
    listAlphabet,
    groupID,
  } = props;
  const [value, setValue] = React.useState(1);
  const [dataListQuestion, setDataListQuestion] = useState(listQuestion);
  const { showNoti } = useWrap();
  const [visible, setVisible] = useState({
    id: null,
    status: false,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingInGroup, setLoadingInGroup] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [activeID, setActiveID] = useState(null);
  const [lengthData, setLengthData] = useState(0);

  const onChange = (e) => {
    e.preventDefault();
    console.log("radio checked", e.target.value);

    // setValue(e.target.value);
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
        onRemoveData(quesItem.ID);
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

  // Lấy data theo group id
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
      : isGroup.id && getQuestionInGroup();
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
      {dataListQuestion?.length == 0
        ? !isGroup.status && (
            <p className="text-center">
              <b>Danh sách còn trống</b>
            </p>
          )
        : dataListQuestion?.map((item, index) => (
            <div
              className={`question-item ${item.ID == activeID ? "active" : ""}`}
              key={index}
              onMouseEnter={() => onHover(item.ID)}
            >
              <div className="box-detail">
                <div className="box-title">
                  <span className="title-ques">Câu hỏi {index + 1}</span>
                  {returnAudio(item)}
                  <div className="title-text">
                    {ReactHtmlParser(item.Content)}
                  </div>
                </div>
                <div className="box-answer">
                  <div className="question-single question-wrap w-100">
                    {item.ExerciseAnswer?.map((ans, i) => (
                      <Radio
                        checked={ans.isTrue}
                        key={i}
                        className="d-block"
                        value={ans.ID}
                        onChange={onChange}
                        disabled={ans.isTrue ? false : true}
                      >
                        <span className="tick">{listAlphabet[i]}</span>
                        <span className="text">{ans.AnswerContent}</span>
                      </Radio>
                    ))}
                  </div>
                </div>
              </div>
              <div className="box-action">
                <CreateQuestionForm
                  questionData={item}
                  onFetchData={onFetchData}
                  onEditData={(data) => onEditData(data)}
                  isGroup={{ status: false, id: null }}
                  getActiveID={(ID: any) => setActiveID(ID)}
                />
                <Popconfirm
                  title="Bạn có chắc muốn xóa?"
                  // visible={item.ID == visible.id && visible.status}
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

export default QuestionMultiple;
