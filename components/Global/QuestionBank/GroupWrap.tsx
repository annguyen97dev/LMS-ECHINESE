import React, { useState } from "react";
import { Collapse, Popover, Modal } from "antd";
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
import EditGroupForm from "./Drawer/EditGroupForm";
import { exerciseApi, exerciseGroupApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

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

  const returnNewData = (item) => {
    let cloneItem = JSON.parse(JSON.stringify(item));
    delete cloneItem.ID;
    cloneItem.Content = "";
    cloneItem.ExerciseGroupID = item.ID;

    switch (item.Type) {
      // Trường hợp chọn 1 đáp án
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
      // Trường hợp chọn nhiều đáp án
      case 4:
        cloneItem.ExerciseAnswer = [];
        break;
      default:
        break;
    }

    return cloneItem;
  };

  // const onEditGroupItem = (e, item) => {
  //   e.stopPropagation();
  //   setVisible({
  //     id: item.ID,
  //     status: false,
  //   });
  //   setOpenForm({
  //     status: true,
  //     data: item,
  //   });
  //   setTimeout(() => {
  //     setOpenForm({
  //       ...openForm,
  //       status: false,
  //     });
  //   }, 500);
  // };

  // DELETE GROUP ITEM

  // CONTENT POPOVER
  const contentMenu = (groupID, item) => {
    return (
      <div className="function-group-item">
        <div className="wrap-btn">
          {/* <button
            className="btn btn-icon edit"
            onClick={(e) => onEditGroupItem(e, item)}
          >
            <FormOutlined />
            Sửa nhóm
          </button> */}
          <CreateQuestionForm
            isGroup={isGroup}
            questionData={item}
            onFetchData={onFetchData}
            handlePopover={() => onChangePopover(item.ID)}
            onEditData={(data) => onEditData(data)}
          />
        </div>
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
        <div className="wrap-btn">
          <CreateQuestionForm
            isGroup={{ status: false, id: groupID }}
            questionData={returnNewData(item)}
            onFetchData={onFetchData}
            handlePopover={() => onChangePopover(item.ID)}
            onEditData={(data) => onEditData(data)}
            onAddData={(data) => onAddData(data)}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* {listQuestion.map((item) => (
        <EditGroupForm
          isGroup={isGroup}
          openForm={openForm}
          onFetchData={onFetchData}
          questionData={item}
        />
      ))} */}

      {/* {openForm && (
        <EditGroupForm
          isGroup={isGroup}
          openForm={openForm}
          onFetchData={onFetchData}
        />
      )} */}
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
          {listQuestion?.map((item, index) => (
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
                  {item.ID == activeKey ? <DownOutlined /> : <RightOutlined />}
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
                <div className="body-content">
                  {ReactHtmlParser(item.Content)}
                  {children}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>{children}</>
      )}

      {/* {isGroup.status ? (
        <Collapse
          activeKey={activeKey}
          onChange={callback}
          destroyInactivePanel={false}
        >
          {listQuestion?.map((item, index) => (
            <Panel
              header={"Group " + (index + 1)}
              key={item.ID}
              extra={
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
              }
            >
              <p>{ReactHtmlParser(item.Content)}</p>
              {children}
            </Panel>
          ))}
        </Collapse>
      ) : (
        <>{children}</>
      )} */}
    </>
  );
};

export default GroupWrap;
