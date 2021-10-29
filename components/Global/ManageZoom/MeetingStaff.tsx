import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Divider, Tooltip, Select } from "antd";
import { User } from "react-feather";
import { List, Avatar } from "antd";

const itemPerPage = 5;
let itemStaff = [];

const data = [
  {
    title: "Staff 1",
    description: "0901234583",
  },
  {
    title: "Staff 2",
    description: "0901234583",
  },
  {
    title: "Staff 3",
    description: "0901234583",
  },
  {
    title: "Staff 4",
    description: "0901234583",
  },
  //   {
  //     title: "Staff 1",
  //     description: "0901234583",
  //   },
  //   {
  //     title: "Staff 2",
  //     description: "0901234583",
  //   },
  //   {
  //     title: "Staff 3",
  //     description: "0901234583",
  //   },
  //   {
  //     title: "Staff 4",
  //     description: "0901234583",
  //   },
  //   {
  //     title: "Staff 1",
  //     description: "0901234583",
  //   },
  //   {
  //     title: "Staff 2",
  //     description: "0901234583",
  //   },
  //   {
  //     title: "Staff 3",
  //     description: "0901234583",
  //   },
  //   {
  //     title: "Staff 4",
  //     description: "0901234583",
  //   },
];

const MeetingStaff = () => {
  const [itemToShow, setItemToShow] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [next, setNext] = useState(5);

  const loopWithSlice = (start, end) => {
    const slicedItem = data.slice(start, end);
    itemStaff = [...itemStaff, ...slicedItem];
    setItemToShow(itemStaff);
  };

  useEffect(() => {
    loopWithSlice(0, itemPerPage);
  }, []);

  const handleShowMoreStaff = () => {
    loopWithSlice(next, next + itemPerPage);
    setNext(next + itemPerPage);
  };

  return (
    <>
      <Tooltip title="Người tham gia">
        <button
          className="btn btn-icon edit"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          <User />
        </button>
      </Tooltip>

      {/*  */}
      <Modal
        title="Danh sách người tham gia"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={
                    <a href="https://app-echinese.monamedia.net/Admin/ZoomMeeting/MeetingInternal">
                      {item.title}
                    </a>
                  }
                  description={item.description}
                />
              </List.Item>
            )}
          />
          {/* <button onClick={handleShowMoreStaff}>Load more</button> */}
        </div>
      </Modal>
    </>
  );
};

export default MeetingStaff;
