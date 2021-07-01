import React, { useState } from "react";
import { Modal, Form, Input, Button, Radio } from "antd";
import SelectFilterBox from "~/components/Elements/SelectFilterBox";

type LayoutType = Parameters<typeof Form>[0]["layout"];

const ModalAdd = () => {
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

  const dataCity = [
    {
      Value: "hcm",
      Text: "Hồ Chí Minh",
    },
    {
      Value: "hn",
      Text: "Hà Nội",
    },
    {
      Value: "dn",
      Text: "Đà Nẵng",
    },
  ];

  const dataDistrict = [
    {
      Value: "q1",
      Text: "Trung tâm 1",
    },
    {
      Value: "q2",
      Text: "Trung tâm 2",
    },
    {
      Value: "q3",
      Text: "Trung tâm 3",
    },
  ];

  return (
    <>
      <button className="btn btn-warning add-new" onClick={showModal}>
        Thêm mới
      </button>
      <Modal
        title="Create Saler"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="box-form">
          <Form layout="vertical">
            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item label="Tỉnh/thành phố">
                  <SelectFilterBox data={dataCity} />
                </Form.Item>

                <Form.Item label="Email">
                  <Input className="style-input" placeholder="" />
                </Form.Item>

                <Form.Item label="Tên tài khoản">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Trung tâm">
                  <SelectFilterBox data={dataDistrict} />
                </Form.Item>

                <Form.Item label="Họ và tên">
                  <Input className="style-input" placeholder="" />
                </Form.Item>

                <Form.Item label="Số điện thoại">
                  <Input className="style-input" placeholder="" />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Địa chỉ">
                  <Input className="style-input" placeholder="" />
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

export default ModalAdd;
