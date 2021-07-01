import React, { useState } from "react";
import { Modal, Input } from "antd";
import PowerTable from "~/components/PowerTable";
import { Checkbox, Table } from "antd";
import SearchBox from "~/components/Elements/SearchBox";

const ModalAdd = (props) => {
  const dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      CityName: "Hồ Chí Minh",
      DistrictName: "Quận 1",
      TeacherName: "Nguyễn An",
      TeacherPhone: "012939494",
      Action: "",
    });
  }

  const columns = [
    {
      title: "City Name",
      dataIndex: "CityName",
      key: "cityname",
    },
    {
      title: "District Name",
      dataIndex: "DistrictName",
      key: "districtname",
    },
    {
      title: "Teacher Name",
      dataIndex: "TeacherName",
      key: "teachername",
    },
    {
      title: "Teacher Phone",
      dataIndex: "TeacherPhone",
      key: "teacherphone",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "action",
      render: () => <Checkbox onChange={onChange}></Checkbox>,
    },
  ];

  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <button className="btn btn-warning" onClick={showModal}>
        Select Teacher
      </button>

      <Modal
        title="List teacher"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={
          <>
            <button className="btn btn-primary" onClick={handleOk}>
              Save
            </button>
            <button
              className="btn btn-light"
              style={{ marginLeft: "10px" }}
              onClick={handleCancel}
            >
              Close
            </button>
          </>
        }
      >
        <div className="modal-topic-content">
          <div
            style={{
              width: "200px",
              marginBottom: "20px",
              marginLeft: "auto",
              marginRight: "10px",
            }}
          >
            <SearchBox />
          </div>
          {/* <Table dataSource={dataSource} columns={columns} /> */}
          <PowerTable
            dataSource={dataSource}
            columns={columns}
            addClass="body-p-0"
          />
        </div>
      </Modal>
    </>
  );
};

export default ModalAdd;
