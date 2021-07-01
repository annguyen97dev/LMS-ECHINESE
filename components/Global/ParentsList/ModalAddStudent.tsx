import React, { useState } from "react";
import { Modal, Form, Input, Button, Radio } from "antd";
import SelectFilterBox from "~/components/Elements/SelectFilterBox";

type LayoutType = Parameters<typeof Form>[0]["layout"];

const ModalAddStudent = () => {
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

  const dataStudent = [
    {
      Value: "st1",
      Text: "Nguyễn An",
    },
    {
      Value: "st2",
      Text: "Nguyễn Phi Hùng",
    },
    {
      Value: "st2",
      Text: "Trương Thức",
    },
  ];

  return (
    <>
      <button className="btn btn-warning add-new" onClick={showModal}>
        Thêm mới
      </button>
      <Modal
        title="Tạo mới học viên"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="box-form">
          <Form layout="vertical">
            <div className="row">
              <div className="col-md-12 col-12">
                <Form.Item label="Chọn học viên">
                  <SelectFilterBox data={dataStudent} />
                </Form.Item>
              </div>
            </div>

            <Form.Item className="text-center">
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalAddStudent;
