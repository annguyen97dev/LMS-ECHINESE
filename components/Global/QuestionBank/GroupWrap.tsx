import React, { useEffect, useState, useRef } from "react";
import { Collapse, Popover, Modal, Spin, Tooltip, Checkbox } from "antd";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { group } from "console";
import {
  MoreOutlined,
  FormOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
  PlusSquareOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import CreateQuestionForm from "./CreateQuestionForm";

import { exerciseApi, exerciseGroupApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { useExamDetail } from "~/pages/question-bank/exam-list/exam-detail/[slug]";
import { CheckOutlined } from "@ant-design/icons";

const GroupWrap = (props) => {
  const {
    isGetQuestion,
    onGetListQuestionID,
    listGroupID,
    onRemoveQuestionAdd,
    listQuestionAddOutside,
  } = useExamDetail();
  const {
    children,
    isGroup,
    listQuestion,
    onFetchData,
    onRemoveData,
    onEditData,
    onAddData,
    getGroupID,
    dataExam,
  } = props;
  const { Panel } = Collapse;
  const { showNoti } = useWrap();
  const [isCollapse, setIsCollapse] = useState(false);
  const [visible, setVisible] = useState({
    status: false,
    id: null,
  });
  const [activeKey, setActiveKey] = useState(null);
  const [openForm, setOpenForm] = useState({
    status: false,
    data: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [linkAudio, setLinkAudio] = useState(listQuestion);
  const audioRef = useRef(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [dataListQuestion, setDataListQuestion] = useState(null);
  const [lengthData, setLengthData] = useState(0);
  const [listQuestionAdd, setListQuestionAdd] = useState([]);

  // console.log("List question in group: ", listQuestion);
  // console.log("active Key: ", activeKey);

  // ACTION TABLE
  const showModalConfirm = (e) => {
    e.stopPropagation();
    setIsModalVisible(true);
  };

  // Confirm delete group
  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsModalVisible(false);
    onRemoveData(deleteID);
    showNoti("success", "Xóa thành công");

    try {
      let res = await exerciseGroupApi.update({ ID: deleteID, Enable: false });
    } catch (error) {}
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Open popover
  const onChangePopover = (id) => {
    !visible.status
      ? setVisible({
          id: id,
          status: true,
        })
      : setVisible({
          ...visible,
          status: false,
        });
  };

  // Show menu in group item
  const showMenu = (e) => {
    e.stopPropagation();
  };

  // ACTION COLLAPSE
  const onShowCollapse = (groupID) => {
    getGroupID && getGroupID(groupID);
    if (groupID == activeKey) {
      setActiveKey(null);
    } else {
      setActiveKey(groupID);
    }
  };

  const returnNewData = (groupID, item) => {
    let cloneItem = JSON.parse(JSON.stringify(item));
    delete cloneItem.ID;
    cloneItem.Content = "";
    cloneItem.ExerciseGroupID = item.ID;
    cloneItem.LinkAudio = "";

    switch (item.Type) {
      // Choice
      case 1:
        cloneItem.ExerciseAnswer = [
          {
            ID: 1,
            AnswerContent: "",
            isTrue: false,
          },
          {
            ID: 2,
            AnswerContent: "",
            isTrue: false,
          },
          {
            ID: 3,
            AnswerContent: "",
            isTrue: false,
          },
          {
            ID: 4,
            AnswerContent: "",
            isTrue: false,
          },
        ];
        break;

      // Map
      case 5:
        cloneItem.ExerciseAnswer = [];
        break;
      // Multiple
      case 4:
        cloneItem.ExerciseAnswer = [];
        break;

      // Typing
      case 3:
        cloneItem.Content = item.Content;
        cloneItem.ID = groupID;
        cloneItem.LinkAudio = item.LinkAudio;
        break;

      // Drag;
      case 2:
        cloneItem.Content = item.Content;
        cloneItem.ID = groupID;
        cloneItem.LinkAudio = item.LinkAudio;
        break;
      default:
        break;
    }

    return cloneItem;
  };

  // CONTENT POPOVER
  const contentMenu = (groupID, item) => {
    return (
      <div className="function-group-item">
        {/** Fix group */}
        <div className="wrap-btn">
          <CreateQuestionForm
            isGroup={isGroup}
            questionData={item}
            onFetchData={onFetchData}
            handlePopover={() => onChangePopover(item.ID)}
            onEditData={(data) => onEditData(data)}
          />
        </div>
        {/** Delete group */}
        <div className="wrap-btn">
          <button
            className="btn btn-icon delete"
            onClick={(e) => (
              setDeleteID(item.ID),
              showModalConfirm(e),
              onChangePopover(item.ID)
            )}
          >
            <DeleteOutlined />
            Xóa nhóm
          </button>
        </div>
        {/** Add more question */}
        <div className="wrap-btn">
          <CreateQuestionForm
            isGroup={{ status: false, id: groupID }}
            questionData={returnNewData(groupID, item)}
            onFetchData={onFetchData}
            handlePopover={() => onChangePopover(item.ID)}
            onEditData={(data) => onEditData(data)}
            onAddData={(data) => onAddData(data)}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Check active item when add new data
    if (dataListQuestion?.length > 0) {
      if (listQuestion.length > lengthData) {
        setActiveKey(listQuestion[0].ID);
        getGroupID(listQuestion[0].ID);
      }
    }
    setLengthData(listQuestion.length);

    // Loading audio for change html audio (because the link not change when update state)
    setLoadingAudio(true);
    setTimeout(() => {
      setLoadingAudio(false);
    }, 100);

    // Make new data
    setDataListQuestion(listQuestion);
    setLinkAudio(listQuestion);
  }, [listQuestion]);

  // On change - add question
  const onChange_AddQuestion = (checked, quesID) => {
    let objectQuestion = {
      type: 2,
      ExerciseOrExerciseGroupID: quesID,
    };

    // Call function to get ID of question
    if (checked) {
      onGetListQuestionID(objectQuestion);
    } else {
      onRemoveQuestionAdd(objectQuestion);
    }

    // Check isChecked in checkbox
    // dataListQuestion.every((item) => {
    //   if (item.ID == quesID) {
    //     item.isChecked = checked;
    //     return false;
    //   }
    //   return true;
    // });

    // setDataListQuestion([...dataListQuestion]);
  };

  useEffect(() => {
    if (dataListQuestion?.length > 0) {
      if (listQuestionAddOutside?.length > 0) {
        dataListQuestion?.forEach((item) => {
          if (
            listQuestionAddOutside.some(
              (object) => object["ExerciseOrExerciseGroupID"] == item.ID
            )
          ) {
            item.isChecked = true;
          } else {
            item.isChecked = false;
          }
        });
      } else {
        dataListQuestion?.forEach((item) => {
          item.isChecked = false;
        });
      }
      setDataListQuestion([...dataListQuestion]);
    }
  }, [listQuestionAddOutside]);

  return (
    <>
      <Modal
        title="Chú ý"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
      >
        <p style={{ fontWeight: 500, color: "#292929" }}>
          Bạn có chắc muốn xóa nhóm câu hỏi này?
        </p>
      </Modal>

      {isGroup.status ? (
        <div className="lms-collapse">
          {dataListQuestion?.length == 0 ? (
            <p className="text-center">
              <b>Danh sách còn trống</b>
            </p>
          ) : (
            dataListQuestion?.map((item, index) => (
              <div
                data-click="trigger-collapse"
                className="collapse-item"
                key={index}
              >
                <div className="collapse-item__header">
                  <button
                    className="btn-function"
                    onClick={(e) => onShowCollapse(item.ID)}
                  >
                    {item.ID == activeKey ? (
                      <DownOutlined />
                    ) : (
                      <RightOutlined />
                    )}
                  </button>
                  <div
                    className="wrap-action-right"
                    style={{ right: dataExam ? "12px" : "0" }}
                  >
                    <Popover
                      content={contentMenu(item.ID, item)}
                      trigger="hover"
                      visible={item.ID == visible.id && visible.status}
                      onVisibleChange={() => onChangePopover(item.ID)}
                    >
                      <button
                        className="btn btn-icon menu"
                        onClick={(e) => showMenu(e)}
                      >
                        <MoreOutlined />
                      </button>
                    </Popover>
                    {dataExam &&
                      (listGroupID.includes(item.ID) ? (
                        <Tooltip title="Đã có trong đề thi">
                          <button className="btn btn-icon edit">
                            <CheckOutlined />
                          </button>
                        </Tooltip>
                      ) : (
                        <Checkbox
                          className="checkbox-addquestion"
                          checked={item.isChecked}
                          onChange={(e) =>
                            onChange_AddQuestion(e.target.checked, item.ID)
                          }
                        />
                      ))}
                  </div>
                  <div className="header-content">
                    <div className="title">Nhóm {index + 1}</div>
                  </div>
                </div>
                <div
                  className={`collapse-item__body ${
                    activeKey == null ? "d-none" : ""
                  } ${item.ID == activeKey ? "active" : "un-active"} `}
                >
                  <div className="body-content w-100 d-block">
                    <div className="group-content">
                      <div className="file-audio mb-3">
                        {!loadingAudio ? (
                          linkAudio[index].LinkAudio !== "" && (
                            <audio controls ref={audioRef}>
                              <source
                                src={linkAudio[index].LinkAudio}
                                type="audio/mpeg"
                              />
                            </audio>
                          )
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="introduce mb-1">
                        {ReactHtmlParser(item.Introduce)}
                      </div>
                      <div className="content">
                        {ReactHtmlParser(item.Content)}
                      </div>
                    </div>
                    <div className="group-content-question mt-3">
                      {/* {children} */}
                      {React.cloneElement(children, { groupID: item.ID })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default GroupWrap;
