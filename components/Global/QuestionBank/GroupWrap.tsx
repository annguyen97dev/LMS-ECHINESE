import React, { useEffect, useState, useRef } from "react";
import { Collapse, Popover, Modal, Spin } from "antd";
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
import { link } from "fs";

const GroupWrap = (props) => {
  const {
    children,
    isGroup,
    listQuestion,
    onFetchData,
    onRemoveData,
    onEditData,
    onAddData,
    getGroupID,
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

  console.log("List question in group: ", listQuestion);
  console.log("Link audio: ", linkAudio);

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
    getGroupID(groupID);
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
      // Multiple
      case 4:
        cloneItem.ExerciseAnswer = [];

        break;
      // Typing
      case 3:
        cloneItem.Content = item.Content;
        cloneItem.ID = groupID;
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
    setLoadingAudio(true);
    setTimeout(() => {
      setLoadingAudio(false);
    }, 200);

    setLinkAudio(listQuestion);
  }, [listQuestion]);

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
          {listQuestion?.length == 0 ? (
            <p className="text-center">
              <b>Danh sách còn trống</b>
            </p>
          ) : (
            listQuestion?.map((item, index) => (
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
                  <Popover
                    content={contentMenu(item.ID, item)}
                    trigger="click"
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
                          <div className="d-flex align-items-center">
                            <Spin />
                            <span
                              style={{
                                marginLeft: "5px",
                                fontStyle: "italic",
                                fontSize: "13px",
                              }}
                            >
                              Loading audio...
                            </span>
                          </div>
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
                      {children}
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
